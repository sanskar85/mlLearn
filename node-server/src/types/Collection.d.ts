import mongoose from 'mongoose';
import IModel from './Model';
import IUser from './User';

interface ICollection extends mongoose.Document {
	name: string;
	summary: string;
	description: string;
	dataset: string;
	labels: {
		[key: string]: string;
	};
	results_mapping: {
		[key: string]: string;
	};
	available_options: {
		[key: string]: string;
	};
	models: IModel[];
	user: IUser;
}

export default ICollection;
