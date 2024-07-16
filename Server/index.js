import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import cors from "cors";


dotenv.config();

const app = express();

//db 
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("DB Connected"))
.catch((err) => console.log("DB ERROR =>", err));

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// router middleware
app.use("/api" ,authRoutes);
app.use("/api" ,categoryRoutes);
app.use("/api" ,productRoutes);

  

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`Node server is running on port ${PORT}`);
});

