document.addEventListener('DOMContentLoaded', function () {
    const users = [];
    const userForm = document.getElementById('user-form');
    const userList = document.getElementById('user-list');
    let editMode = false;
    let editUserId = null;

    userForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const rol = document.getElementById('rol').value;

        if (editMode) {
            const userIndex = users.findIndex(user => user.id === editUserId);
            if (userIndex !== -1) {
                users[userIndex].nombre = nombre;
                users[userIndex].email = email;
                users[userIndex].rol = rol;
            }
            editMode = false;
            editUserId = null;
        } else {
            const newUser = {
                id: users.length + 1,
                nombre,
                email,
                rol
            };
            users.push(newUser);
        }

        loadUsers();
        userForm.reset();
    });

    function loadUsers() {
        userList.innerHTML = '';

        users.forEach(user => {
            const userRow = document.createElement('tr');
            userRow.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td>${user.rol}</td>
                <td>
                    <button class="btn btn-secondary btn-sm edit-user" data-id="${user.id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-user" data-id="${user.id}">Eliminar</button>
                </td>
            `;
            userList.appendChild(userRow);
        });


        //selecciona todos los botones que tengas la clase edit-user
        document.querySelectorAll('.edit-user').forEach(function (btnEdit) {
            //para cada boton, vamos a manejar el evento click, este evento lo va a manejar la funcion handleEditUser
            //definida mas abajo
            btnEdit.addEventListener('click', handleEditUser);
        })


        //selecciona todos los botones que tengas la clase edit-user
        document.querySelectorAll('.delete-user').forEach(function (btnDelete) {
            //para cada boton, vamos a manejar el evento click, este evento lo va a manejar la funcion handleEditUser
            //definida mas abajo
            btnDelete.addEventListener('click', handleDeleteUser);
        })
    }

    function handleEditUser(event) {
        const userId = parseInt(event.target.dataset.id);
        const user = users.find(user => user.id === userId);

        if (user) {
            document.getElementById('nombre').value = user.nombre;
            document.getElementById('email').value = user.email;
            document.getElementById('rol').value = user.rol;
            editMode = true;
            editUserId = userId;
        }
    }

    function handleDeleteUser(event) {
        const userId = event.target.dataset.id;
        const index = users.findIndex(user => user.id == userId);
        if (index !== -1) {
            users.splice(index, 1);
            loadUsers();
        }
    }

    loadUsers();
});
