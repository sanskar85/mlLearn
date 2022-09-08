import { Router } from 'express';
import {
	VerifyEmailForgot,
	ForgotPassword,
	IsLoggedIn,
	Login,
	Logout,
	Register,
	ResetPassword,
} from '../controllers/Auth';
import VerifyUser from '../middleware/VerifyUser';

const authRouter = Router();

authRouter.route('/login').post(Login);
authRouter.route('/register').post(Register);
authRouter.route('/verify-email-forgot').post(VerifyEmailForgot);
authRouter.route('/forgot-password').post(ForgotPassword);
authRouter.route('/reset-password').post(ResetPassword);
authRouter.route('/is-logged').post(IsLoggedIn);
authRouter.route('/logout').all(VerifyUser).post(Logout);

export default authRouter;
