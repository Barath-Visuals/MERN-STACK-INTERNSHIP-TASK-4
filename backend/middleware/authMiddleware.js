import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        let token

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1]
        }

        if(!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, Please login.'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id)

        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, User not found.'
            })
        }

        req.user = user

        next()
    }catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized, Invalid token.'
        })
    }
}

export const authorizeRoles = (...roles) => {
    return(req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            })
        }

        next()
    }
}