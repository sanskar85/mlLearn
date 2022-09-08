import Axios from './Axios';
import axios from 'axios';
import validator from 'validator';
import store, { StoreNames } from '../store/store';
import { setLoading } from '../store/reducers/AuthReducer';

const Login = () => {
	const { loading, email, password } = store.getState()[StoreNames.AUTH];
	if (loading) return Promise.reject();
	if (!email) {
		return Promise.reject('Please enter your email');
	} else if (!password) {
		return Promise.reject('Please enter your password');
	}

	store.dispatch(setLoading(true));

	return new Promise<void>((resolve, reject) => {
		if (!validator.isEmail(email)) {
			reject('Please enter a valid email');
		}

		Axios.post('/auth/login', {
			email,
			password,
		})
			.then(() => {
				store.dispatch(setLoading(false));
				resolve();
			})
			.catch((e: Error) => {
				store.dispatch(setLoading(false));
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 400) {
						reject('Invalid credentials.');
					} else if (e.response.status === 401) {
						reject('Invalid credentials.');
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					}
				} else {
					reject('Unable to verify your credentials. Please try again later.');
				}
			});
	});
};

const Register = () => {
	const { loading, name, email, password, re_password, security_question, security_answer } =
		store.getState()[StoreNames.AUTH];

	if (loading) return Promise.reject();

	if (!name) {
		return Promise.reject('Please enter your name.');
	} else if (!email) {
		return Promise.reject('Please enter your email.');
	} else if (!password) {
		return Promise.reject('Please enter your password.');
	} else if (!security_question) {
		return Promise.reject('Please enter your security question.');
	} else if (!security_answer) {
		return Promise.reject('Please enter your security answer.');
	} else if (password !== re_password) {
		return Promise.reject('Passwords do not match.');
	} else if (password.length < 6) {
		return Promise.reject('Password must be at least 6 characters.');
	}

	return new Promise<void>((resolve, reject) => {
		if (!validator.isEmail(email)) {
			reject('Please enter a valid email');
		}

		Axios.post('/auth/register', {
			name,
			email,
			password,
			security_question,
			security_answer,
		})
			.then(() => {
				resolve();
			})
			.catch((e: Error) => {
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 400 && e.response.data) {
						reject(e.response.data);
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					} else {
						reject('Unable to register. Please try again later.');
					}
				} else {
					reject('Unable to verify your email. Please try again later.');
				}
			});
	});
};

const VerifyEmailForgot = () => {
	const { loading, email } = store.getState()[StoreNames.AUTH];

	if (loading) return Promise.reject();

	if (!email) {
		return Promise.reject('Please enter your email.');
	}

	return new Promise<void>((resolve, reject) => {
		if (!validator.isEmail(email)) {
			reject('Please enter a valid email');
		}

		Axios.post('/auth/verify-email-forgot', {
			email,
		})
			.then(({ data }) => {
				resolve(data);
			})
			.catch((e: Error) => {
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 400 && e.response.data) {
						reject(e.response.data);
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					} else {
						reject('Unable to register. Please try again later.');
					}
				} else {
					reject('Unable to verify your email. Please try again later.');
				}
			});
	});
};

const ForgotPassword = () => {
	const { loading, email, security_answer } = store.getState()[StoreNames.AUTH];

	if (loading) return Promise.reject();

	if (!email) {
		return Promise.reject('Please enter your email.');
	} else if (!security_answer) {
		return Promise.reject('Please enter your security answer.');
	}

	return new Promise<void>((resolve, reject) => {
		if (!validator.isEmail(email)) {
			reject('Please enter a valid email');
		}

		Axios.post('/auth/forgot-password', {
			email,
			security_answer,
		})
			.then(() => {
				resolve();
			})
			.catch((e: Error) => {
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 400 && e.response.data) {
						reject(e.response.data);
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					} else {
						reject('Unable to register. Please try again later.');
					}
				} else {
					reject('Unable to verify your email. Please try again later.');
				}
			});
	});
};

const ResetPassword = () => {
	const { loading, password, re_password } = store.getState()[StoreNames.AUTH];

	if (loading) return Promise.reject();

	if (!password) {
		return Promise.reject('Please enter your password.');
	} else if (password !== re_password) {
		return Promise.reject('Passwords do not match.');
	} else if (password.length < 6) {
		return Promise.reject('Password must be at least 6 characters.');
	}

	return new Promise<void>((resolve, reject) => {
		Axios.post('/auth/reset-password', {
			password,
		})
			.then(() => {
				resolve();
			})
			.catch((e: Error) => {
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 400 && e.response.data) {
						reject('Unable to reset password. Please try again later.');
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					} else {
						reject('Unable to register. Please try again later.');
					}
				} else {
					reject('Unable to verify your email. Please try again later.');
				}
			});
	});
};

export { Login, Register, VerifyEmailForgot, ForgotPassword, ResetPassword };
