import mongoose from "mongoose";
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
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export { User };
//# sourceMappingURL=User.model.d.ts.map