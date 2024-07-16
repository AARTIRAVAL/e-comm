import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middlewares
import { isAdmin, requireSignin } from "../middlewares/auth.js";

// controllers
import { create, list, read, photo, remove, update } from "../controllers/product.js";
//import { update } from "../controllers/category.js";
//import { remove } from "../controllers/category.js";
import { update as updateCategory } from "../controllers/category.js";

// Routes
router.post("/product", requireSignin, isAdmin, formidable(), create);
router.get("/products", list);
router.get("/product/:slug", read); // Changed to singular to be consistent
router.get("/products/photo/:productId", photo);
router.delete("/product/:productId", requireSignin, isAdmin, remove)
router.put("/product/:productId", requireSignin, isAdmin, formidable(), update)


export default router;
