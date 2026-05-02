import { Request, Response } from "express";
import { User } from "../models/User.model";
import crypto from 'crypto'
import {  sendPasswordResetEmail } from "../utils/email.service";


export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If your email is registered, you will receive a password reset link"
            });
        }

        // gen reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before saving to database
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token expiry (15 minutes)
        const resetExpiry = new Date();
        resetExpiry.setMinutes(resetExpiry.getMinutes() + 10);


        // Save to database
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpiry = resetExpiry;
        await user.save();

        // Create reset URL
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${email}`;

        // Send email
        const emailSent = await sendPasswordResetEmail(email, resetUrl);


        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to send reset email. Please try again."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });

    } catch (error:any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

export const verifyResetToken = async (req: Request, res: Response) => {
    try {
        const { token, email } = req.query;

        if (!token || !email) {
            return res.status(400).json({
                success: false,
                message: "Invalid reset link"
            });
        }

        // Type assertion - use this only if you're sure token and email are strings
        const tokenString = token as string;
        const emailString = email as string;

        // Hash the token to compare with database
        const hashedToken = crypto
            .createHash('sha256')
            .update(tokenString)
            .digest('hex');

        const user = await User.findOne({
            email: emailString,
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset link. Please request a new one."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Token is valid",
            email: user.email
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, email, newPassword, confirmPassword } = req.body;

        // Validation
        if (!token || !email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Hash the token to compare with database
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            email: email,
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: { $gt: new Date() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset link. Please request a new one."
            });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login with your new password."
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};