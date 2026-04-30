import {Router} from "express"
import { signUp } from "../controllers/user.controller";


const authRouter=Router();

authRouter.post('/signup',signUp);

export default authRouter;
