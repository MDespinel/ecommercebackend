const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    const carts = readCarts();
    res.json(carts);
});


router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1,
        ...req.body
    };
    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});


const readCarts = () => {
    const data = fs.readFileSync(path.join(__dirname, '../data/carrito.json'), 'utf-8');
    return JSON.parse(data);
};

const saveCarts = (carts) => {
    fs.writeFileSync(path.join(__dirname, '../data/carrito.json'), JSON.stringify(carts, null, 2));
};

module.exports = router;
