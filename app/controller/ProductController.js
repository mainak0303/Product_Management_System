const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const { ProductModel, productJoiSchema } = require('../model/product');
const { CategoryModel } = require('../model/category');


class ProductController {
  
  async listProducts(req, res) {
    const products = await ProductModel.find({ isDeleted: false }).populate('category');
    res.render('admin/products/list', { 
      products, 
      messages: req.flash() 
    });
  }

  async showAddProduct(req, res) {
    const categories = await CategoryModel.find({ isDeleted: false });
    res.render('admin/products/add', { 
      categories, 
      messages: req.flash() 
    });
  }

  async addProduct(req, res) {
    try {
      const { error } = productJoiSchema.validate(req.body);
      if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect('/admin/products/add');
      }
      const { name, category, description } = req.body;
      const slug = slugify(name, { lower: true, strict: true });
      const exists = await ProductModel.findOne({ $or: [{ name }, { slug }] });
      if (exists) {
        req.flash('error', 'Product name/slug already exists');
        return res.redirect('/admin/products/add');
      }
      let imageFilename = '';
      if (req.file) {
        imageFilename = req.file.filename;
      }
      await ProductModel.create({
        name,
        slug,
        category,
        description,
        image: imageFilename,
      });
      req.flash('success', 'Product added');
      res.redirect('/admin/products');
    } catch (err) {
      req.flash('error', 'Failed to add product');
      res.redirect('/admin/products/add');
    }
  }

  async showEditProduct(req, res) {
    const product = await ProductModel.findById(req.params.id);
    const categories = await CategoryModel.find({ isDeleted: false });
    if (!product || product.isDeleted) {
      req.flash('error', 'Product not found');
      return res.redirect('/admin/products');
    }
    res.render('admin/products/edit', { product, categories, messages: req.flash() });
  }

  async editProduct(req, res) {
    try {
      const { error } = productJoiSchema.validate(req.body);
      if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect(`/admin/products/edit/${req.params.id}`);
      }
      const { name, category, description } = req.body;
      const slug = slugify(name, { lower: true, strict: true });
      const product = await ProductModel.findById(req.params.id);
      if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect('/admin/products');
      }
      const exists = await ProductModel.findOne({
        _id: { $ne: product._id },
        $or: [{ name }, { slug }],
      });
      if (exists) {
        req.flash('error', 'Product name/slug already exists');
        return res.redirect(`/admin/products/edit/${req.params.id}`);
      }

      
      if (req.file) {
        if (product.image) {
          const oldImagePath = path.join(__dirname, '..', 'uploads', product.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        product.image = req.file.filename;
      }
      product.name = name;
      product.slug = slug;
      product.category = category;
      product.description = description;
      await product.save();
      req.flash('success', 'Product updated');
      res.redirect('/admin/products');
    } catch (err) {
      req.flash('error', 'Failed to update product');
      res.redirect(`/admin/products/edit/${req.params.id}`);
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await ProductModel.findById(req.params.id);
      if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect('/admin/products');
      }
      if (product.image) {
        const imagePath = path.join(__dirname, '..', 'uploads', product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      product.isDeleted = true;
      await product.save();
      req.flash('success', 'Product deleted');
      res.redirect('/admin/products');
    } catch (err) {
      req.flash('error', 'Failed to delete product');
      res.redirect('/admin/products');
    }
  }
}

module.exports = new ProductController();
