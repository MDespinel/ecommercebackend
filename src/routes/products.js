const express = require('express');
const Product = require('../models/product.model');
const router = express.Router();

// GET con filtros, paginación, y ordenamientos
router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    const filter = query ? { category: query } : {};

    const products = await Product.paginate(filter, options);

    res.json({
        status: 'success',
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
        nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null,
    });
});

module.exports = router;
