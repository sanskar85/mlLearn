import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { CreateAuthCookie } from '../config/CreateCookie';
import User from '../model/User';
import { JWT_COOKIE, JWT_REFRESH_COOKIE } from '../utils/const';
const VerifyUser = async (req: Request, res: Response, next: NextFunction) => {
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
			return res.status(401).json('Unauthorized.');
		}

		user = await User.findOne({ refreshTokens: refreshToken });
		if (!user) {
			return res.status(401).json('Unauthorized.');
		}
		await CreateAuthCookie(res, user, true);
	}
	if (!id && !user) {
		return res.status(401).json('Unauthorized.');
	}
	if (user == null) {
		user = await User.findById(id);
	}
	if (!user) {
		return res.status(401).send('Unauthorized');
	}
	req.user = user;
	next();
};

export default VerifyUser;
