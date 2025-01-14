import Category from "../models/category.js";
import slugify from "slugify";

export const create = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name.trim()) {
            return res.json({ error: "Name is required" });
        }
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.json({ error: "Already exists" });
        }

        const newCategory = await new Category({ name, slug: slugify(name) }).save();
        res.json(newCategory);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

export const update = async (req, res) => {
    try {
        const { name } = req.body;
        const { CategoryId } = req.params;
        const updatedCategory = await Category.findByIdAndUpdate(
            CategoryId,
            {
                name,
                slug: slugify(name),
            },
            { new: true }
        );
        res.json(updatedCategory); 
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};

export const remove = async (req, res) => {
    try {
        const removed = await Category.findByIdAndDelete(req.params.CategoryId);
        res.json(removed);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};

export const list = async (req, res) => {
    try {
        const all = await Category.find({});
        res.json(all);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};

export const read = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        res.json(category);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};
