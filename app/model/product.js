const mongoose = require('mongoose');
const Joi = require('joi');

const productJoiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    category: Joi.string().required(),
    description: Joi.string().allow('').max(500),

});

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = { productJoiSchema, ProductModel }