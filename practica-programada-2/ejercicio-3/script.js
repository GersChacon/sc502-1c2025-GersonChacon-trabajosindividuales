document.addEventListener('DOMContentLoaded', function () {

    const users = [
        {
            id: 1,
            name: "Juan Perez",
            precio: "juanperez@gmail.com",
            categoria: "Administrador"
        }
    ];

    // carga tareas en el DOM
    function loadTasks() {
        const userList = document.getElementById('userList');
        userList.innerHTML = ""; // Limpia la tabla antes de agregar datos
    
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.precio}</td>
                <td>${user.categoria}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-user" data-id="${user.id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-user" data-id="${user.id}">Eliminar</button>
                </td>
            `;
            userList.appendChild(row);
        });
    
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', handleEditTask);
        });
    
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', handleDeleteTask);
        });
    }
    

    function handleEditTask(event) {
        alert('se presiono el boton con task Id ' + event.target.dataset.id);
    }

    function handleDeleteTask(event) {
        alert('se presiono el boton con delete Id ' + event.target.dataset.id);
    }

    loadTasks();
});