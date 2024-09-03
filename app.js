const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.handlebars'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.get('/', (req, res) => {
    const products = readProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    const products = readProducts();
    res.render('realTimeProducts', { products });
});


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new-product', (product) => {
        const products = readProducts();
        const newId = Date.now(); 
        const newProduct = { id: newId, ...product };
        products.push(newProduct);
        saveProducts(products);
        io.emit('update-products', products);
    });

    socket.on('delete-product', (productId) => {
        let products = readProducts();
        products = products.filter(p => p.id !== productId);
        saveProducts(products);
        io.emit('update-products', products);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


const readProducts = () => {
    const data = fs.readFileSync(path.join(__dirname, 'data/productos.json'), 'utf-8');
    return JSON.parse(data);
};

const saveProducts = (products) => {
    fs.writeFileSync(path.join(__dirname, 'data/productos.json'), JSON.stringify(products, null, 2));
};
