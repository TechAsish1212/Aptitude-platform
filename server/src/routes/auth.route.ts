import {Router} from "express"
import { resendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/user.controller";


const authRouter=Router();

authRouter.post('/signup',signUp);
authRouter.post('/verify-otp',verifyOtp);
authRouter.post('/resend-otp',resendOtp);
authRouter.post('/signin',signIn);
authRouter.post('/signout',signOut);

export default authRouter;
