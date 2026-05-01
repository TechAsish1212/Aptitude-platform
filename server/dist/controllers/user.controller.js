"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const User_model_1 = require("../models/User.model");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields required." });
        }
        const existingUser = yield User_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already register.Go to login" });
        }
        const user = yield User_model_1.User.create({
            name,
            email,
            password,
            role: role || 'student'
        });
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
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const existingUser = yield User_model_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not exists , go to signup" });
        }
        const passwordValid = yield existingUser.isPasswordCorrect(password);
    }
    catch (error) {
    }
});
exports.signIn = signIn;
//# sourceMappingURL=user.controller.js.map