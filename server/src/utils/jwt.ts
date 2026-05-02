import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, email: string, role: string) => {
    return jwt.sign(
        { id: userId, email, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};