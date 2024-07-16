import Users from "../models/user.js";
import { hashpassword,comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import user from "../models/user.js";

dotenv.config();

export const register = async (req, res) => {
    try {
        // 1. destructure name, email, password from req.body
        const { name, email, password } = req.body;
        
        // 2. All fields require validation
        if (!name.trim()) {
            return res.json({ error: "Name is required "});
        }
        if (!email){
            return res.json({ error: "Email is taken" });
        }
        if (!password || password.length < 6) {
            return res.json({ error: "Password must be at least 6 characters long" });
        }
        // 3. Check if mail is taken
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.json({ error: "Email is taken"});
        }
        // 4. Hash password
        const hashedpassword = await hashpassword(password);
        // 5. Register user
        const User = await new Users ({
            name,
            email,
            password: hashedpassword
        }).save();
        // 6. Create signed jwt
        const token = jwt.sign({ _id: User._id }, process.env.JWT_SECRET, {expiresIn: "7d",} );

        // 7. Send response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token,
        });
    } catch (err) {
        console.log(err.message);
    }
};



export const login = async (req, res) => {
    try {
        // 1. destructure name, email, password from req.body
        const { email, password } = req.body;
        
        // 2. All fields require validation
        if (!email){
            return res.json({ error: "Email is required" });
        }
        if (!password || password.length < 6) {
            return res.json({ error: "Password must be at least 6 characters long" });
        }
        // 3. Check if mail is taken
        const user = await Users.findOne({ email });
        if (!user) {
            return res.json({ error: "User not found"});
        }
        // 4. compare password
        const match = await comparePassword(password, user.password);  
        if (!match) {
            return res.json({ error: "Wrong password" })
        }
        // 5. Create signed jwt
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: "7d",} );

        // 7. Send response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token,
        });
    } catch (err) {
        console.log(err.message);
    }
};

export const secret = async (req, res) => {
    res.json({ currentUser: req.user });
};