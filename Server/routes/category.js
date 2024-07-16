import express from "express";

const router = express.Router();

// middlewares
import { isAdmin, requireSignin } from "../middlewares/auth.js";

// controllers
import { create, update, remove, list, read } from "../controllers/category.js";

router.post("/Category", requireSignin, isAdmin, create);
router.put("/Category/:CategoryId", requireSignin, isAdmin, update);
router.delete("/Category/:CategoryId", requireSignin, isAdmin, remove);
router.get("/Category", list);
router.get("/Category/:slug", read);


export default router;
