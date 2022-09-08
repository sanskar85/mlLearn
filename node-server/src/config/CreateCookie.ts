import { Response } from 'express';
import User from '../model/User';
import IUser from '../types/User';
import { JWT_COOKIE, JWT_REFRESH_COOKIE } from '../utils/const';

const JWT_EXPIRE_TIME = 3 * 60 * 1000;
const REFRESH_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

export interface ICreateCookie {
	name: string;
	value: string;
	expires: number;
}

const CreateAuthCookie = async (res: Response, _user: IUser, jwt_only: boolean = false) => {
	if (!res || !_user) return new Error('Parameters cannot be empty');

	const user = await User.findById(_user._id).select('refreshTokens');
	if (!user) return new Error('User not found');

	const accessToken = user.getSignedToken();

	res.cookie(JWT_COOKIE, accessToken, {
		sameSite: 'strict',
		expires: new Date(Date.now() + JWT_EXPIRE_TIME),
		httpOnly: true,
		secure: process.env.MODE !== 'development',
	});
	if (!jwt_only) {
		const refreshToken = user.getRefreshToken();

		res.cookie(JWT_REFRESH_COOKIE, refreshToken, {
			sameSite: 'strict',
			expires: new Date(Date.now() + REFRESH_EXPIRE_TIME),
			httpOnly: true,
			secure: process.env.MODE !== 'development',
		});
	}
};

const CreateCookie = (res: Response, { name, value, expires }: ICreateCookie) => {
	if (!res || !name || !value) return new Error('Parameters cannot be empty');
	res.cookie(name, value, {
		sameSite: 'strict',
		expires: new Date(Date.now() + expires),
		httpOnly: true,
		secure: process.env.MODE !== 'development',
	});
};

export { CreateAuthCookie, CreateCookie };
