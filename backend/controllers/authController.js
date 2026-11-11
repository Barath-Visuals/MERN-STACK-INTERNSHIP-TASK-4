import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )
}

export const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, and password"
            })
        }

        if(password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            })
        }

        const existingUser = await User.findOne({
            email: email.trim().toLowerCase(),
        })

        if(existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: 'user',
        })

        const token = generateToken(user._id)

        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })
    } catch (error) {
        console.error(`Error : ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            })
        }
        
        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select('+password');

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const verifyPassword = await bcrypt.compare(
            password,
            user.password
        )

        if(!verifyPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = generateToken(user._id)

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })
    } catch (error) {
        console.error(`Error : ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}