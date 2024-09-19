const express = require('express');
const Cart = require('../models/cart.model');
const router = express.Router();


router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    const updatedCart = await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate('products.product');
    res.json(updatedCart);
});


router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json(cart);
});


router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
    res.json(cart);
});

module.exports = router;
