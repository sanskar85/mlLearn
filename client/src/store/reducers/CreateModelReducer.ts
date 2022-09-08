import { createSlice } from '@reduxjs/toolkit';

export enum CREATE_STAGE {
	UPLOAD_CSV,
	DETAILS,
	MANIPULATE_DATASET,
	FINALIZE,
}

const INITIAL_STATE: ICreateModel = {
	file: null,
	columns: [],
	rows: [],
	stage: CREATE_STAGE.UPLOAD_CSV,

	id: '',
	name: '',
	summary: '',
	description: '',

	active_column: 0,
	column_details: [],
	results_mapping: {},
};

const CreateModelSlice = createSlice({
	name: 'create_model',
	initialState: INITIAL_STATE,
	reducers: {
		nextStage: (state) => {
			state.stage = state.stage + 1;
		},
		prevStage: (state) => {
			state.stage = state.stage - 1;
		},
		setStage: (state, action) => {
			state.stage = action.payload;
		},
		reset: (state) => {
			return INITIAL_STATE;
		},
		setID: (state, action) => {
			state.id = action.payload;
		},
		setFile: (state, action) => {
			state.file = action.payload;
		},
		setColumns: (state, action) => {
			state.columns = action.payload;

			state.column_details = action.payload.map((column: string) => ({
				name: column,
				label: column[0].toUpperCase() + column.slice(1),
				required: true,
				independent: true,
				dependent: false,
			}));
		},
		setRows: (state, action) => {
			state.rows = action.payload;
		},
		setModelName: (state, action) => {
			state.name = action.payload;
		},
		setSummary: (state, action) => {
			state.summary = action.payload;
		},
		setDescription: (state, action) => {
			state.description = action.payload;
		},
		setActiveColumn: (state, action) => {
			state.active_column = action.payload;
		},
		setColumnRequired: (state) => {
			const column = state.column_details[state.active_column];
			column.required = !column.required;
			if (!column.required) {
				column.dependent = false;
				column.independent = true;
			}
		},
		setColumnLabel: (state, action) => {
			state.column_details[state.active_column].label = action.payload;
		},
		toggleColumnDependence: (state) => {
			const column = state.column_details[state.active_column];
			column.dependent = !column.dependent;
			column.independent = !column.independent;
			state.results_mapping = {};

			if (column.dependent) {
				state.column_details.forEach((column, index) => {
					if (index !== state.active_column) {
						column.dependent = false;
						column.independent = true;
					}
				});
			}
		},
		setResultsMapping: (state, action) => {
			const { result, text } = action.payload;
			state.results_mapping[result] = text;
		},
		setDetails: (state, action) => {
			const { name, summary, description, labels } = action.payload;
			state.name = name;
			state.summary = summary;
			state.description = description;
			state.column_details = [];
			for (const name in labels) {
				state.columns.push(name);
				state.column_details.push({
					required: true,
					independent: true,
					dependent: false,
					name,
					label: labels[name],
				});
			}
		},
	},
});

export const {
	reset,
	setFile,
	nextStage,
	prevStage,
	setStage,
	setID,
	setColumns,
	setRows,
	setModelName,
	setSummary,
	setDescription,
	setActiveColumn,
	setColumnRequired,
	setColumnLabel,
	toggleColumnDependence,
	setResultsMapping,
	setDetails,
} = CreateModelSlice.actions;

export default CreateModelSlice.reducer;
