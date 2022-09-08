import { createSlice } from '@reduxjs/toolkit';

export interface IPredictState {
	loading: boolean;
	fields: {
		name: string;
		label: string;
		available_options: string[];
	}[];
	data: {
		[key: string]: string;
	};
	result: string;
}

const INITIAL_STATE: IPredictState = {
	loading: false,
	fields: [],
	data: {},
	result: '',
};

const PredictSlice = createSlice({
	name: 'predict',
	initialState: INITIAL_STATE,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		reset: (state) => {
			state.loading = INITIAL_STATE.loading;
			state.fields = INITIAL_STATE.fields;
			state.data = INITIAL_STATE.data;
			state.result = INITIAL_STATE.result;
		},
		setPredictionFields: (state, action) => {
			const { fields, available_options } = action.payload;

			state.fields = [];

			for (const field in fields) {
				state.fields.push({
					name: field,
					label: fields[field],
					available_options: available_options[field],
				});
				state.data[field] = '';
			}
			delete state.data[state.fields[state.fields.length - 1].name];
			state.fields.splice(state.fields.length - 1, 1);
		},
		setData: (state, action) => {
			const { name, value } = action.payload;
			state.data[name] = value;
			state.result = '';
		},
		setResult: (state, action) => {
			state.result = action.payload;
		},
	},
});

export const { setLoading, reset, setPredictionFields, setData, setResult } = PredictSlice.actions;

export default PredictSlice.reducer;
