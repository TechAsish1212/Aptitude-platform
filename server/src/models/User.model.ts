    import mongoose, { Document, model, Schema } from "mongoose";
    import bcrypt from 'bcryptjs'

    export interface IUser {
        name: string;
        email: string;
        password: string;
        stats: {
            totalQuizzesTaken: number;
            averageScore: number;
            totalQuestionsAttempted: number;
            correctAnswers: number;
        };
        role: "student" | "admin";
        createdAt: Date;
        otp: string;
        otpExpiry: Date;
        isEmailVerified: boolean;
    }

    // Create a new interface that extends Document and includes the method
    export interface IUserDocument extends Document, IUser {
        isPasswordCorrect(password: string): Promise<boolean>;
    }

    const userSchema = new Schema<IUser>({
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: [50, "Name cannot be more than 50 characters"]
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Provide a valid email"]
        },
        password: {
            type: String,
            required: true,
            minLength: [6, "Password must be at least 6 characters"]
        },
        role: {
            type: String,
            enum: ['student', 'admin'],
            default: 'student',
        },
        stats: {
            totalQuizzesTaken: { type: Number, default: 0 },
            totalQuestionsAttempted: { type: Number, default: 0 },
            averageScore: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            default: null,
        },
        otpExpiry: {
            type: Date,
            default: null
        }
    })


    // hash password
    userSchema.pre('save', async function () {
        if (!this.isModified('password'))
            return ;

        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 10);
        this.password = await bcrypt.hash(this.password, salt);
    })

    userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }

    const User = model<IUserDocument>('User', userSchema);

    export { User }