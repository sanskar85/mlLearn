import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE: IModelDetails = {
	loading: true,
	not_found: false,
	detailsView: false,
	name: '',
	author: '',
	summary: '',
	description: '',
	owner: false,
	models: [],
};

const ModelDetailsSlice = createSlice({
	name: 'model_details',
	initialState: INITIAL_STATE,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		reset: (state) => {
			state.loading = false;
			state.not_found = false;
			state.detailsView = false;
			state.name = '';
			state.author = '';
			state.summary = '';
			state.description = '';
			state.models = [];
		},
		notFound: (state) => {
			state.not_found = true;
		},
		setDetails: (state, action) => {
			state.name = action.payload.name;
			state.author = action.payload.author;
			state.summary = action.payload.summary;
			state.description = action.payload.description;
			state.owner = action.payload.own;
			state.models = action.payload.models.map((model: IModel) => ({
				name: model.name,
				accuracy: model.accuracy,
				precision: model.precision,
				recall: model.recall,
				f1_score: model.f1_score,
				confusion_matrix: model.confusion_matrix,
			}));
		},
		toggleView: (state) => {
			state.detailsView = !state.detailsView;
		},
	},
});

export const { setLoading, reset, notFound, setDetails, toggleView } = ModelDetailsSlice.actions;

export default ModelDetailsSlice.reducer;
