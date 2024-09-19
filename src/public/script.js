const socket = io();

document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();
    const description = e.target.description.value.trim();
    const code = e.target.code.value.trim();
    const price = parseFloat(e.target.price.value.trim());
    const stock = parseInt(e.target.stock.value.trim());
    const category = e.target.category.value.trim();
    const thumbnails = e.target.thumbnails.value.split(',').map(url => url.trim());

    if (!title || !description || !code || isNaN(price) || isNaN(stock) || !category) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    const product = {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
    };

    socket.emit('new-product', product);
    e.target.reset();
});

const deleteProduct = (productId) => {
    socket.emit('delete-product', productId);
};

socket.on('update-products', (products) => {
    const list = document.getElementById('products-list');
    list.innerHTML = '';
    products.forEach(product => {
        const item = document.createElement('li');
        item.id = `product-${product.id}`;
        item.innerHTML = `
            ${product.title} - ${product.price}
            <button onclick="deleteProduct('${product.id}')">Eliminar</button>
        `;
        list.appendChild(item);
    });
});
