import Product from "../models/productModel.js";
import mongoose from "mongoose";

// CREATE PRODUCT - admin only
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, published } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            published: published !== undefined ? published : false
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Product creation failed",
            error: error.message
        });
    }
};

// GET ALL PRODUCTS
// normal user -> published only, admin -> all
// supports filter (category, minPrice, maxPrice), sort, pagination
export const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

        const filter = {};

        // normal users only see published products
        if (!req.user || req.user.role !== "admin") {
            filter.published = true;
        }

        if (category) {
            filter.category = { $regex: new RegExp(category, "i") };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        let sortOption = {};

        switch (sort) {
            case "price_asc":
                sortOption = { price: 1 };
                break;
            case "price_desc":
                sortOption = { price: -1 };
                break;
            case "newest":
                sortOption = { createdAt: -1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const totalProducts = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        const totalPages = Math.ceil(totalProducts / limitNum);

        res.status(200).json({
            products,
            page: pageNum,
            limit: limitNum,
            totalProducts,
            totalPages
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // normal users can only see published products
        if (!req.user || req.user.role !== "admin") {
            if (!product.published) {
                return res.status(404).json({ message: "Product not found" });
            }
        }

        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
};

// UPDATE PRODUCT - admin only
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Product update failed",
            error: error.message
        });
    }
};

// DELETE PRODUCT - admin only
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Product deletion failed",
            error: error.message
        });
    }
};

// PUBLISH PRODUCT - admin only
export const publishProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { published: true },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product published successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Publish failed",
            error: error.message
        });
    }
};

// UNPUBLISH PRODUCT - admin only
export const unpublishProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { published: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product unpublished successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Unpublish failed",
            error: error.message
        });
    }
};
