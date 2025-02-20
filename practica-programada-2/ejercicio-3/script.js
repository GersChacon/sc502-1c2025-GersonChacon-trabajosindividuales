document.addEventListener('DOMContentLoaded', function () {
    const products = [];
    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('productList');

    productForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const nombre = document.getElementById('product-nombre').value;
        const precio = document.getElementById('product-precio').value;
        const categoria = document.getElementById('product-categoria').value;

        const newProduct = {
            id: products.length + 1,
            nombre,
            precio,
            categoria
        };

        products.push(newProduct);
        loadProducts();
        productForm.reset();
    });

    function loadProducts() {
        productList.innerHTML = '';

        products.forEach(product => {
            const productRow = document.createElement('tr');
            productRow.innerHTML = `
          <td>${product.nombre}</td>
          <td>${product.precio}</td>
          <td>${product.categoria}</td>
          <td>
            <button class="btn btn-secondary btn-sm edit-product" data-id="${product.id}">Editar</button>
            <button class="btn btn-danger btn-sm delete-product" data-id="${product.id}">Eliminar</button>
          </td>
          <td></td>
        `;
            productList.appendChild(productRow);
        });

        document.querySelectorAll('.edit-product').forEach(btnEdit => {
            btnEdit.addEventListener('click', handleEditProduct);
        });

        document.querySelectorAll('.delete-product').forEach(btnDelete => {
            btnDelete.addEventListener('click', handleDeleteProduct);
        });

        document.querySelectorAll('.category-filter').forEach(btnCategory => {
            btnCategory.addEventListener('click', handleCategoryFilter);
        });
    }

    function handleEditProduct(event) {
        alert('Se presionó el botón con id ' + event.target.dataset.id);
    }

    function handleDeleteProduct(event) {
        const productId = event.target.dataset.id;
        const index = products.findIndex(product => product.id == productId);
        if (index !== -1) {
            products.splice(index, 1);
            loadProducts();
        }
    }

    function handleCategoryFilter() {
        const categoryFilter = document.getElementById('category-filter').value;
        productList.innerHTML = '';

        products
            .filter(product => product.categoria === categoryFilter)
            .forEach(product => {
                const productRow = document.createElement('tr');
                productRow.innerHTML = `
                    <td>${product.nombre}</td>
                    <td>${product.precio}</td>
                    <td>${product.categoria}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm edit-product" data-id="${product.id}">Editar</button>
                        <button class="btn btn-danger btn-sm delete-product" data-id="${product.id}">Eliminar</button>
                    </td>
                    <td></td>
                `;
                productList.appendChild(productRow);
            });

        document.querySelectorAll('.edit-product').forEach(btnEdit => {
            btnEdit.addEventListener('click', handleEditProduct);
        });

        document.querySelectorAll('.delete-product').forEach(btnDelete => {
            btnDelete.addEventListener('click', handleDeleteProduct);
        });
    }

    loadProducts();
});