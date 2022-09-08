import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
	email: string;
	name: string;
	password: string;
	security_question: string;
	security_answer: string;
	reset_token: string | undefined;
	reset_expires: Date | undefined;
	refreshTokens: string[];

	verifyPassword(password: string): Promise<boolean>;
	getSignedToken(): string;
	getRefreshToken(): string;
	getResetToken(): string;
}

export default IUser;
