const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


router.get('/', (req, res) => {
    const products = readProducts();
    res.json(products);
});


router.post('/', (req, res) => {
    const products = readProducts();
    const newProduct = {
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...req.body
    };
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});


const readProducts = () => {
    const data = fs.readFileSync(path.join(__dirname, '../data/productos.json'), 'utf-8');
    return JSON.parse(data);
};

const saveProducts = (products) => {
    fs.writeFileSync(path.join(__dirname, '../data/productos.json'), JSON.stringify(products, null, 2));
};

module.exports = router;
