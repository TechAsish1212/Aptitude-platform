import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../models/User.model";

interface jwtPayload {
    id: string;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            }
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Authentication required. Please login"
            })
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwtPayload;

        // if user still exist
        const user = await User.findById(decoded.id).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User no longer exists.please register again"
            })
        }

        // user to request
        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.role,
        }

        next();

    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please login again.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
}