import { createSlice } from '@reduxjs/toolkit';

const UtilsSlice = createSlice({
	name: 'utils',
	initialState: {
		loading: false,
		title: 'mlLearn.in',
	},
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		reset: (state) => {
			state.loading = false;
		},
		setTitle: (state, action) => {
			if (action.payload) {
				state.title = action.payload + ' - mlLearn.in';
			} else {
				state.title = 'mlLearn.in';
			}
		},
	},
});

export const { setLoading, reset, setTitle } = UtilsSlice.actions;

export default UtilsSlice.reducer;
