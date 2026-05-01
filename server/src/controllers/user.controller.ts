import { Request, Response } from 'express'
import { User } from '../models/User.model';


export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields required." });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already register.Go to login" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student'
        })

        return res.status(201).json({
            success: true,
            message: "User register Successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                stats: user.stats
            }
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export const signIn = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not exists , go to signup" });
        }

        const passwordValid = await existingUser.isPasswordCorrect(password);

        if (!passwordValid) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                stats: existingUser.stats
            }
        });


    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}