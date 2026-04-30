import mongoose, { model, Schema } from "mongoose";
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
    }
})


// hash password
userSchema.pre('save', async function (next: any) {
    if (!this.isModified('password'))
        return next();

    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.isPasswordCorrect = async function (password: any) {
    return await bcrypt.compare(password, this.password);
}

const User = model<IUser>('User', userSchema);

export { User }