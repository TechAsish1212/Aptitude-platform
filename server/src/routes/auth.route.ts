import {Router} from "express"
import { getProfile, resendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";


const authRouter=Router();

authRouter.post('/signup',signUp);
authRouter.post('/verify-otp',verifyOtp);
authRouter.post('/resend-otp',resendOtp);
authRouter.post('/signin',signIn);
authRouter.post('/signout',authenticate,signOut);
authRouter.get('/me',authenticate,getProfile);

export default authRouter;
