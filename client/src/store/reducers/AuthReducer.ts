import { createSlice } from '@reduxjs/toolkit';

const AuthSlice = createSlice({
	name: 'auth',
	initialState: {
		loading: false,
		name: '',
		email: '',
		password: '',
		re_password: '',
		security_question: '',
		security_answer: '',
	},
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		reset: (state) => {
			state.loading = false;
			state.name = '';
			state.email = '';
			state.password = '';
			state.security_question = '';
			state.security_answer = '';
		},
		setName: (state, action) => {
			state.name = action.payload;
		},
		setEmail: (state, action) => {
			state.email = action.payload;
		},
		setPassword: (state, action) => {
			state.password = action.payload;
		},
		setRePassword: (state, action) => {
			state.re_password = action.payload;
		},
		setSecurityQuestion: (state, action) => {
			state.security_question = action.payload;
		},
		setSecurityAnswer: (state, action) => {
			state.security_answer = action.payload;
		},
	},
});

export const {
	setLoading,
	reset,
	setName,
	setEmail,
	setPassword,
	setRePassword,
	setSecurityQuestion,
	setSecurityAnswer,
} = AuthSlice.actions;

export default AuthSlice.reducer;
