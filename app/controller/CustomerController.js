const mongoose = require('mongoose');
const { CategoryModel } = require("../model/category");
const { ProductModel } = require("../model/product");


class CustomerController {

    async showHomePage(req, res) {
        const { category, keyword } = req.query;
        const query = { isDeleted: false };
        if (category) query.category = category;
        if (keyword) query.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } }
        ];
        const products = await ProductModel.find(query).populate('category');
        const categories = await CategoryModel.find({ isDeleted: false });
        res.render('customer/home', {
            products,
            categories,
            selectedCategory: category || '', searchTerm: keyword || ''
        });
    }

    async showProductDetail(req, res) {
        const { slug } = req.params;
        const query = { isDeleted: false };

        if (mongoose.Types.ObjectId.isValid(slug)) {
            query.$or = [{ slug }, { _id: slug }];
        } else {
            query.slug = slug;
        }

        const product = await ProductModel.findOne(query).populate('category');

        if (!product) {
            return res.render('customer/notfound');
        }

        res.render('customer/detail', { product });
    }

}

module.exports = new CustomerController();
