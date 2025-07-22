const express = require('express');
const router = express.Router();
const AdminController = require('../controller/AdminController');
const CategoryController = require('../controller/CategoryController');
const ProductController = require('../controller/ProductController');
const Imageupload = require('../helper/ImageUpload');


//  Dashboard (/admin)
router.get('/admin', AdminController.dashboard);

//  Category Management (/admin/categories)
router.get('/admin/categories', CategoryController.listCategories);
router.get('/admin/categories/add', CategoryController.showAddCategory);
router.post('/admin/categories/add', CategoryController.addCategory);
router.get('/admin/categories/edit/:id', CategoryController.showEditCategory);
router.post('/admin/categories/edit/:id', CategoryController.editCategory); 
router.post('/admin/categories/delete/:id', CategoryController.deleteCategory);

//  Product Management (/admin/products)
router.get('/admin/products', ProductController.listProducts);
router.get('/admin/products/add', ProductController.showAddProduct);
router.post('/admin/products/add', Imageupload.single('image'), ProductController.addProduct);
router.get('/admin/products/edit/:id', ProductController.showEditProduct);
router.post('/admin/products/edit/:id', Imageupload.single('image'), ProductController.editProduct);
router.post('/admin/products/delete/:id', ProductController.deleteProduct);

module.exports = router;
