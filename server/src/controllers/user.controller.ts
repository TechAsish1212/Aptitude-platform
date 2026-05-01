import { Request, Response } from 'express'
import { User } from '../models/User.model';
import otpGenerator from "otp-generator";
import { sendEmail } from '../utils/email.service';
import { generateToken } from '../utils/jwt';


export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields required."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already register.Go to login"
            });
        }

        // gen otp
        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: true,
            lowerCaseAlphabets: false,
            specialChars: false,
        })

        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // otp valid for 5 min

        // otp send the email
        const emailSent = await sendEmail(email, otp);

        if (!emailSent) {
            return res.status(400).json({
                success: false,
                message: "Error coming while sending otp to email",
            })
        }



        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            otp,
            otpExpiry
        })

        return res.status(201).json({
            success: true,
            message: "User register Successfully. Verify your email with the OTP sent",
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

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified"
            })
        }

        // check otp match 
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        // check otp is not expire
        if (user.otpExpiry && new Date() > user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP"
            })
        }

        // mark email verified
        user.isEmailVerified = true;
        user.otp = "";
        user.otpExpiry = null;
        await user.save();

        // gen jwt token
        const token = generateToken(user._id.toString(), user.email, user.role);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                stats: user.stats
            }
        });

    } catch (error: any) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const resendOtp = async (req: Request, res: Response) => {
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
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified"
            });
        }

        // Generate new OTP
        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: true,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send new OTP 
        const emailSent = await sendEmail(email, otp);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email. Please try again."
            });
        }

        return res.status(200).json({
            success: true,
            message: "New OTP sent to your email"
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
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