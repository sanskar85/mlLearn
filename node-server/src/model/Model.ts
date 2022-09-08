import mongoose from 'mongoose';
import IModel from '../types/Model';
import { ModelStatus } from '../utils/const';

const ModelSchema = new mongoose.Schema<IModel>({
	name: { type: String, required: true },
	accuracy: { type: Number },
	precision: { type: Number },
	recall: { type: Number },
	f1_score: { type: Number },
	confusion_matrix: { type: [String] },
	file: { type: String },
	status: { type: String, required: true, default: ModelStatus.TRAINING },
});

const Model = mongoose.model<IModel>('Model', ModelSchema);

export default Model;
