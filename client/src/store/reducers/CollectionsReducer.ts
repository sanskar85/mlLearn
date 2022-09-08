import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE: ICollections = {
	loading: false,
	search_text: '',
	collections: [],
	limit: 10,
	skip: 0,
	hasMore: true,
};

const CollectionsSlice = createSlice({
	name: 'collections',
	initialState: INITIAL_STATE,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setSearchText: (state, action) => {
			state.search_text = action.payload;
		},
		reset: (state) => {
			state.loading = false;
			state.collections = [];
			state.limit = 10;
			state.skip = 0;
		},
		clearCollections: (state) => {
			state.hasMore = INITIAL_STATE.hasMore;
			state.collections = INITIAL_STATE.collections;
			state.skip = INITIAL_STATE.skip;
			state.limit = INITIAL_STATE.limit;
		},
		addToCollections: (state, action) => {
			if (action.payload.length < state.limit) {
				state.hasMore = false;
			}

			state.collections.push(...action.payload);
			state.collections = state.collections.filter(
				(item, index, arr) => arr.findIndex(({ id }) => id === item.id) === index
			);
			state.skip = state.collections.length;
		},
	},
});

export const { setLoading, reset, clearCollections, addToCollections, setSearchText } =
	CollectionsSlice.actions;

export default CollectionsSlice.reducer;
