import express from 'express';
import { forgotPassword, resetPassword, verifyResetToken } from '../controllers/passwordReset.controller';

const passwordRouter = express.Router();

passwordRouter.post('/forgot-password', forgotPassword);
passwordRouter.get('/verify-reset-token', verifyResetToken);
passwordRouter.post('/reset-password', resetPassword);

export default passwordRouter;