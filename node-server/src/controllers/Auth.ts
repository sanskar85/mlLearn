import { Request, Response } from 'express';
import { CreateAuthCookie, CreateCookie } from '../config/CreateCookie';
import User from '../model/User';
import { JWT_COOKIE, JWT_REFRESH_COOKIE, RESET_TOKEN_COOKIE } from '../utils/const';

export const Login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return result(res, 400, 'Email and password are required');
	}

	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return result(res, 400, 'Invalid email or password');
	}
	const isMatch = await user.verifyPassword(password);
	if (!isMatch) {
		return result(res, 400, 'Invalid email or password');
	}
	await CreateAuthCookie(res, user);
	return result(res, 200, {
		name: user.name,
		email,
	});
};

export const Register = async (req: Request, res: Response) => {
	const { name, email, password, security_question, security_answer } = req.body;
	if (!name || !email || !password) {
		return result(res, 400, 'Name, email and password are required');
	}
	if (!security_question || !security_answer) {
		return result(res, 400, 'Security Question and answer required');
	}

	const user = await User.findOne({ email });
	if (user) {
		return result(res, 400, 'User already exists');
	}
	const newUser = new User({ name, email, password, security_question, security_answer });
	await newUser.save();
	await CreateAuthCookie(res, newUser);
	return result(res, 201, {
		name: newUser.name,
		email: newUser.email,
	});
};

export const VerifyEmailForgot = async (req: Request, res: Response) => {
	const { email } = req.body;

	if (!email) {
		return result(res, 400, 'Email required');
	}

	const user = await User.findOne({ email }).select('+security_question');
	if (!user) {
		return result(res, 400, 'User does not exist');
	}

	return result(res, 200, user.security_question);
};

export const ForgotPassword = async (req: Request, res: Response) => {
	const { email, security_answer } = req.body;

	if (!email || !security_answer) {
		return result(res, 400, 'Email, security question and answer are required');
	}

	const user = await User.findOne({ email }).select('+security_answer');
	if (!user) {
		return result(res, 400, 'User does not exist');
	}

	if (user.security_answer !== security_answer) {
		return result(res, 400, 'Invalid security  answer');
	}

	const reset_token = user.getResetToken();

	CreateCookie(res, {
		name: RESET_TOKEN_COOKIE,
		value: reset_token,
		expires: 10 * 60 * 1000,
	});

	return result(res, 201, 'Reset token created');
};

export const ResetPassword = async (req: Request, res: Response) => {
	const { password } = req.body;

	if (!password) {
		return result(res, 400, 'New password required.');
	}

	const reset_token = req.cookies[RESET_TOKEN_COOKIE];
	res.clearCookie(RESET_TOKEN_COOKIE);
	if (!reset_token) {
		return result(res, 400, 'Invalid reset token.');
	}

	const user = await User.findOne({ reset_token }).select(
		'email name password reset_token reset_expires '
	);
	if (!user) {
		return result(res, 400, 'Invalid reset token.');
	}
	const token_expired = !user.reset_expires || user.reset_expires < new Date();
	user.reset_token = undefined;
	user.reset_expires = undefined;

	if (token_expired) {
		user.save();
		return result(res, 400, 'Reset token expired. Please try again.');
	}

	user.password = password;
	await user.save();
	await CreateAuthCookie(res, user);

	return result(res, 200, 'Password reset successfully.');
};

export const IsLoggedIn = async (req: Request, res: Response) => {
	const refreshToken = req.cookies[JWT_REFRESH_COOKIE];
	if (!refreshToken) {
		return result(res, 200, {
			success: false,
		});
	}

	const user = await User.findOne({ refreshTokens: refreshToken });

	return result(res, 200, {
		success: user ? true : false,
	});
};

export const Logout = async (req: Request, res: Response) => {
	res.clearCookie(JWT_COOKIE);
	res.clearCookie(JWT_REFRESH_COOKIE);

	const user = await User.findById(req.user._id).select('refreshTokens');
	if (user) {
		user.refreshTokens = user.refreshTokens.filter(
			(token) => token !== req.cookies[JWT_REFRESH_COOKIE]
		);
		await user.save();
	}
	return result(res, 200, 'Logout successfully.');
};

const result = (res: Response, status: number, data: string | number | object) => {
	res.status(status).json(data);
};
