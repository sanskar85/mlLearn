import { IUser } from './User';

declare global {
	function logger(message: string): void;
	var __basedir: string;

	namespace Express {
		interface Request {
			user: IUser;
		}
	}
}
export {};
