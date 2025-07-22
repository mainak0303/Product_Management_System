const express = require('express');
const router = express.Router();

const CustomerController = require('../controller/CustomerController');

// Homepage: list, filter, search products
router.get('/', CustomerController.showHomePage);

// Product detail page
router.get('/product/:slug', CustomerController.showProductDetail);

module.exports = router;
