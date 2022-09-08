import mongoose from 'mongoose';

interface IModel extends mongoose.Document {
	name: string;
	accuracy: number;
	precision: number;
	recall: number;
	f1_score: number;
	confusion_matrix: string[];
	file: string;
	status: ModelStatus;
}

export default IModel;
