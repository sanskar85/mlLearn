import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './reducers/AuthReducer';
import CollectionsReducer from './reducers/CollectionsReducer';
import CreateModelReducer from './reducers/CreateModelReducer';
import ModelDetailsReducer from './reducers/ModelDetailsReducer';
import PredictReducer from './reducers/PredictReducer';
import Utils from './reducers/Utils';

const store = configureStore({
	reducer: {
		utils: Utils,
		auth: AuthReducer,
		collections: CollectionsReducer,
		model_details: ModelDetailsReducer,
		create_model: CreateModelReducer,
		predict: PredictReducer,
	},

	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export enum StoreNames {
	UTILS = 'utils',
	AUTH = 'auth',
	COLLECTIONS = 'collections',
	MODEL_DETAILS = 'model_details',
	CREATE_MODEL = 'create_model',
	PREDICT = 'predict',
}
