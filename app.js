const express = require('express');
const mongoose = require('mongoose');
const { engine } = require('express-handlebars'); // Asegúrate de que estás importando el engine correctamente
const socketIO = require('socket.io');
const http = require('http');
const productRouter = require('./src/routes/products');
const cartRouter = require('./src/routes/cart');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Cambia esta línea
app.engine('handlebars', engine()); // Usa engine() aquí
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

io.on('connection', (socket) => {
    console.log('Usuario conectado');
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

mongoose.connect('mongodb://localhost:27017/ecommerce')
    .then(() => server.listen(8080, () => console.log('Servidor corriendo en http://localhost:8080')))
    .catch(err => console.error('Error conectando a MongoDB:', err));
