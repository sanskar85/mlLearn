import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import IUser from '../types/User';

const UserSchema = new mongoose.Schema<IUser>(
	{
		email: {
			type: String,
			unique: true,
			trim: true,
			lowercase: true,
			index: true,
		},
		name: { type: String },
		password: { type: String, select: false },
		security_question: { type: String, select: false },
		security_answer: { type: String, select: false },
		reset_token: { type: String, select: false },
		reset_expires: { type: Date, select: false },
		refreshTokens: [{ type: String, select: false }],
	},
	{ timestamps: true }
);

UserSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT_FACTOR!));
	next();
});

UserSchema.methods.verifyPassword = function (password: string) {
	return bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

UserSchema.methods.getRefreshToken = function () {
	const token = jwt.sign({ id: this._id }, process.env.REFRESH_SECRET!, {
		expiresIn: process.env.REFRESH_EXPIRE,
	});
	if (!this.refreshTokens) this.refreshTokens = [];

	this.refreshTokens.push(token);
	this.save();
	return token;
};

UserSchema.methods.getResetToken = function () {
	const reset_token = crypto.randomBytes(30).toString('hex');
	this.reset_token = reset_token;
	this.reset_expires = new Date(Date.now() + parseInt(process.env.RESET_EXPIRE!));
	this.save();
	return reset_token;
};

const User = mongoose.model('User', UserSchema);

export default User;
