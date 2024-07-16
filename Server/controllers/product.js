import Product from "../models/product.js";
import mongoose from "mongoose";
import fs from "fs";
import slugify from "slugify";

export const create = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Validation
        if (!name.trim()) {
            return res.status(400).json({ error: "Name is required" });
        }
        if (!description.trim()) {
            return res.status(400).json({ error: "Description is required" });
        }
        if (!price) {
            return res.status(400).json({ error: "Price is required" });
        }
        if (!category.trim()) {
            return res.status(400).json({ error: "Category is required" });
        }
        if (!quantity) {
            return res.status(400).json({ error: "Quantity is required" });
        }
        if (!shipping) {
            return res.status(400).json({ error: "Shipping is required" });
        }
        if (photo && photo.size > 1000000) {
            return res.status(400).json({ error: "Image should be less than 1mb in size" });
        }

        // Create product
        const newProduct = new Product({ ...req.fields, slug: slugify(name) });

        if (photo) {
            newProduct.photo.data = fs.readFileSync(photo.path);
            newProduct.photo.contentType = photo.type;
        }

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

export const list = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

export const read = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

// export const photo = async (req, res) => {
//     try {
//         const { productId } = req.params;

//         // Check if the productId is a valid ObjectId
//         if (!mongoose.Types.ObjectId.isValid(productId)) {
//             return res.status(400).json({ error: "Invalid product ID" });
//         }

//         const product = await Product.findById(productId).select("photo");

//         // Check if the product exists
//         if (!product) {
//             return res.status(404).json({ error: "Product not found" });
//         }

//         // Check if the product has a photo
//         if (product.photo && product.photo.data) {
//             res.set("Content-Type", product.photo.contentType);
//             return res.send(product.photo.data);
//         } else {
//             return res.status(404).json({ error: "No photo found for this product" });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ error: err.message });
//     }
// };

export const photo = async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if the productId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const product = await Product.findById(productId).select("photo");

        // Check if the product exists
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if the product has a photo
        if (product.photo && product.photo.data) {
            res.set("Content-Type", product.photo.contentType);
            return res.send(product.photo.data);
        } else {
            return res.status(404).json({ error: "No photo found for this product" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

export const remove = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Check if the productId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const product = await Product.findByIdAndDelete(productId).select("-photo");

        // Check if the product exists
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};



export const update = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Validation
        if (!name.trim()) {
            return res.status(400).json({ error: "Name is required" });
        }
        if (!description.trim()) {
            return res.status(400).json({ error: "Description is required" });
        }
        if (!price) {
            return res.status(400).json({ error: "Price is required" });
        }
        if (!category.trim()) {
            return res.status(400).json({ error: "Category is required" });
        }
        if (!quantity) {
            return res.status(400).json({ error: "Quantity is required" });
        }
        if (!shipping) {
            return res.status(400).json({ error: "Shipping is required" });
        }
        if (photo && photo.size > 1000000) {
            return res.status(400).json({ error: "Image should be less than 1mb in size" });
        }

        // update product
        const newProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            {
                ...req.fields,
                slug: slugify(name),
            },
            { new: true }
        );

        if (photo) {
            newProduct.photo.data = fs.readFileSync(photo.path);
            newProduct.photo.contentType = photo.type;
        }

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};