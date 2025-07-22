const slugify = require('slugify');
const { CategoryModel, categoryJoiSchema } = require('../model/category');

class CategoryController {
    
    async listCategories(req, res) {
        const categories = await CategoryModel.find({ isDeleted: false });
        res.render('admin/categories/list', { 
            categories, 
            messages: req.flash() 
        });
    }

    showAddCategory(req, res) {
        res.render('admin/categories/add', { 
            messages: req.flash() 
        });
    }

    async addCategory(req, res) {
        try {
            const { error } = categoryJoiSchema.validate(req.body);
            if (error) {
                req.flash('error', error.details[0].message);
                return res.redirect('/admin/categories/add');
            }
            const { name } = req.body;
            const slug = slugify(name, { lower: true, strict: true });
            const exists = await CategoryModel.findOne({ $or: [{ name }, { slug }] });
            if (exists) {
                req.flash('error', 'Category name/slug already exists');
                return res.redirect('/admin/categories/add');
            }
            await CategoryModel.create({ name, slug });
            req.flash('success', 'Category added');
            res.redirect('/admin/categories');
        } catch (err) {
            req.flash('error', 'Failed to add category');
            res.redirect('/admin/categories/add');
        }
    }

    async showEditCategory(req, res) {
        const category = await CategoryModel.findById(req.params.id);
        if (!category || category.isDeleted) {
            req.flash('error', 'Category not found');
            return res.redirect('/admin/categories');
        }
        res.render('admin/categories/edit', { 
            category, 
            messages: req.flash() 
        });
    }

    async editCategory(req, res) {
        try {
            const { error } = categoryJoiSchema.validate(req.body);
            if (error) {
                req.flash('error', error.details[0].message);
                return res.redirect(`/admin/categories/edit/${req.params.id}`);
            }
            const { name } = req.body;
            const slug = slugify(name, { lower: true, strict: true });
            const category = await CategoryModel.findById(req.params.id);
            if (!category) {
                req.flash('error', 'Category not found');
                return res.redirect('/admin/categories');
            }

            const exists = await CategoryModel.findOne({
                _id: { $ne: category._id },
                $or: [{ name }, { slug }],
            });
            if (exists) {
                req.flash('error', 'Category name/slug already exists');
                return res.redirect(`/admin/categories/edit/${req.params.id}`);
            }
            category.name = name;
            category.slug = slug;
            await category.save();
            req.flash('success', 'Category updated');
            res.redirect('/admin/categories');
        } catch (err) {
            req.flash('error', 'Failed to update category');
            res.redirect(`/admin/categories/edit/${req.params.id}`);
        }
    }

    async deleteCategory(req, res) {
        try {
            const category = await CategoryModel.findById(req.params.id);
            if (!category) {
                req.flash('error', 'Category not found');
                return res.redirect('/admin/categories');
            }
            category.isDeleted = true;
            await category.save();
            req.flash('success', 'Category deleted');
            res.redirect('/admin/categories');
        } catch (err) {
            req.flash('error', 'Failed to delete category');
            res.redirect('/admin/categories');
        }
    }
}

module.exports = new CategoryController();
