import { Router } from "express";
import authRouter from "./auth.route";
import passwordRouter from "./password.route";

const routes = Router();

routes.use('/auth',authRouter);
routes.use('/password',passwordRouter);

export default routes;