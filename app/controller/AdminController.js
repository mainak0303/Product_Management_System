const { CategoryModel } = require("../model/category");
const { ProductModel } = require("../model/product");


class AdminController {
    async dashboard(req, res) {
        try {
            const totalProducts = await ProductModel.countDocuments({ isDeleted: false });
            const totalCategories = await CategoryModel.countDocuments({ isDeleted: false });
            res.render('admin/dashboard', {
                totalProducts,
                totalCategories,
                messages: req.flash()
            });
        } catch (error) {
            req.flash('error', 'Failed to load dashboard.');
            res.redirect('/admin');
        }
    }
}

module.exports = new AdminController();
