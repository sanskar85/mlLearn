import mongoose from 'mongoose';
import ICollection from '../types/Collection';

const CollectionSchema = new mongoose.Schema<ICollection>({
	name: { type: String, required: true },
	summary: { type: String, required: true },
	description: { type: String, required: true },
	dataset: { type: String, required: true },
	labels: { type: Object },
	results_mapping: { type: Object },
	available_options: { type: Object },
	models: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model' }],
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Collection = mongoose.model<ICollection>('Collection', CollectionSchema);

export default Collection;
