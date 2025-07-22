const mongoose = require('mongoose');
const Joi = require('joi');

const categoryJoiSchema = Joi.object({
    name: Joi.string().min(2).max(50).required()
});

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const CategoryModel = mongoose.model('Category', CategorySchema);
module.exports = { categoryJoiSchema, CategoryModel }