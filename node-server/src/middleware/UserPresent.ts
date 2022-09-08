import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { CreateAuthCookie } from '../config/CreateCookie';
import User from '../model/User';
import { JWT_COOKIE, JWT_REFRESH_COOKIE } from '../utils/const';
const UserPresent = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies[JWT_COOKIE];

	let id = '';
	let user = null;
	try {
		if (!token) {
			throw new Error('Token is required');
		}
		const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;
		id = decoded.id;
	} catch (e) {
		const refreshToken = req.cookies[JWT_REFRESH_COOKIE];
		if (!refreshToken) {
			return next();
		}

		user = await User.findOne({ refreshTokens: refreshToken });
		if (!user) {
			return next();
		}
		await CreateAuthCookie(res, user, true);
	}
	if (!id && !user) {
		return next();
	}
	if (user == null) {
		user = await User.findById(id);
	}
	if (!user) {
		return next();
	}
	req.user = user;
	next();
};

export default UserPresent;
