import { Request, Response } from 'express';
import Collection from '../model/Collection';
import FileUpload from '../utils/FileUpload';
import path from 'path';
import FormData from 'form-data';
import * as fs from 'fs';
import { moveFile } from '../utils/Utilities';
import axios from 'axios';
import { FilterQuery, isValidObjectId } from 'mongoose';
import ICollection from '../types/Collection';
import User from '../model/User';
import Model from '../model/Model';
import IModel from '../types/Model';

export const Collections = async (req: Request, res: Response) => {
	const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
	const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
	const search = req.query.search ? (req.query.search as string) : '';

	let query: FilterQuery<ICollection> = { name: { $regex: search, $options: 'i' } };
	if (search.startsWith('author@')) {
		// query = { user: { $regex: '^' + search.replace('author@', ''), $options: 'i' } };

		const users = await User.find({
			name: { $regex: search.replace('author@', ''), $options: 'i' },
		});

		query = { user: { $in: users.map((user) => user._id) } };
	}
	let collections = await Collection.find(query)
		.skip(skip)
		.limit(limit)
		.populate('user models')
		.sort({ createdAt: -1 });
	const _collections = collections
		.map((collection) => ({
			id: collection._id,
			name: collection.name,
			author: collection.user.name,
			models: collection.models.map((model) => ({
				name: model.name,
				accuracy: model.accuracy,
				precision: model.precision,
				recall: model.recall,
				f1_score: model.f1_score,
			})),
		}))
		.filter((collection) => collection.models.length !== 0);

	result(res, 200, _collections);
};

export const CollectionsByUser = async (req: Request, res: Response) => {
	const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
	const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
	const search = req.query.search ? (req.query.search as string) : '';

	let query: FilterQuery<ICollection> = {
		$and: [{ name: { $regex: '^' + search, $options: 'i' } }, { user: req.user._id }],
		// user: req.user._id,
	};

	let collections = await Collection.find(query)
		.skip(skip)
		.limit(limit)
		.populate('user models')
		.sort({ createdAt: -1 });
	const _collections = collections.map((collection) => ({
		id: collection._id,
		name: collection.name,
		author: collection.user.name,
		models: collection.models.map((model) => ({
			name: model.name,
			accuracy: model.accuracy,
			precision: model.precision,
			recall: model.recall,
			f1_score: model.f1_score,
		})),
	}));

	result(res, 200, _collections);
};

export const CreateCollection = async (req: Request, res: Response) => {
	let file: string | undefined;

	try {
		file = await FileUpload(req, res);
	} catch (err) {
		let message = 'Unknown Error';
		if (err instanceof Error) {
			message = err.message;
		}
		logger(message);
		return result(res, 500, message);
	}

	if (!file) {
		return result(res, 400, 'File is required');
	}

	const { name, summary, description, labels, results_mapping } = req.body;

	const collection = new Collection({
		name,
		summary,
		description,
		user: req.user,
		labels,
		results_mapping,
	});

	const uploadFilePath = path.join(__basedir, 'static/uploads', file);
	const destFilePath = path.join(__basedir, 'static/datasets', collection._id + path.extname(file));

	try {
		await moveFile(uploadFilePath, destFilePath);
	} catch (err) {
		fs.unlinkSync(uploadFilePath);
		let message = 'Unknown Error';
		if (err instanceof Error) {
			message = err.message;
		}
		logger(message);
		return result(res, 500, message);
	}

	try {
		const formData = new FormData();
		formData.append('file', fs.createReadStream(destFilePath));
		formData.append('id', collection.id.toString());
		formData.append('callback_success', process.env.SERVER_URL + 'model/trained');
		formData.append('callback_failure', process.env.SERVER_URL + 'model/error-training');

		const { data } = await axios.post(process.env.PYTHON_SERVER_URL + 'create-model', formData);
		if (!data.success) {
			throw new Error(data.message);
		}
	} catch (err) {
		console.log(err);

		fs.unlinkSync(destFilePath);
		let message = 'Unknown Error';
		if (err instanceof Error) {
			message = err.message;
		}
		logger(message);
		return result(res, 500, 'Unable to create model');
	}

	collection.dataset = collection._id + path.extname(file);
	await collection.save();
	result(res, 201, 'Model training started.');
};

export const Details = async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!isValidObjectId(id)) {
		return result(res, 404, 'Collection not found');
	}
	const collection = await Collection.findById(id).populate('user models');
	if (!collection) {
		return result(res, 404, 'Collection not found');
	}

	result(res, 200, {
		name: collection.name,
		author: collection.user.name,
		summary: collection.summary,
		description: collection.description,
		models: collection.models.map((model) => ({
			name: model.name,
			accuracy: model.accuracy,
			precision: model.precision,
			recall: model.recall,
			f1_score: model.f1_score,
			confusion_matrix: model.confusion_matrix,
		})),
		own: collection.user._id.toString() === req.user?.id.toString(),
	});
};

export const EditDetails = async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!isValidObjectId(id)) {
		return result(res, 404, 'Collection not found');
	}
	const collection = await Collection.findById(id).populate('user models');
	if (!collection || collection.user._id.toString() !== req.user.id.toString()) {
		return result(res, 404, 'Collection not found');
	}

	result(res, 200, {
		name: collection.name,
		summary: collection.summary,
		description: collection.description,
		labels:
			typeof collection.labels === 'string'
				? JSON.parse(collection.labels as any)
				: collection.labels,
	});
};

export const UpdateDetails = async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!isValidObjectId(id)) {
		return result(res, 404, 'Collection not found');
	}
	const collection = await Collection.findById(id).populate('user models');
	if (!collection || collection.user._id.toString() !== req.user.id.toString()) {
		return result(res, 404, 'Collection not found');
	}

	const { name, summary, description, labels } = req.body;

	collection.name = name;
	collection.summary = summary;
	collection.description = description;
	collection.labels = labels;

	await collection.save();

	result(res, 200, 'Collection updated');
};

export const Delete = async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!isValidObjectId(id)) {
		return result(res, 404, 'Collection not found');
	}
	const collection = await Collection.findById(id).populate('user models');
	if (!collection || collection.user._id.toString() !== req.user.id.toString()) {
		return result(res, 404, 'Collection not found');
	}

	for (const model of collection.models) {
		await Model.findByIdAndDelete(model._id);
	}

	await collection.remove();

	result(res, 200, 'Collection deleted');
};

export const PredictionFields = async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!isValidObjectId(id)) {
		return result(res, 404, 'Collection not found');
	}
	const collection = await Collection.findById(id);

	if (!collection) {
		return result(res, 404, 'Collection not found');
	}

	const fields = JSON.parse((collection.labels as any) || '{}');
	const available_options = JSON.parse((collection.available_options as any) || '{}');

	result(res, 200, { fields, available_options });
};

export const PredictData = async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!isValidObjectId(id)) {
		return result(res, 404, 'Collection not found');
	}
	const collection = await Collection.findById(id).populate('models');

	if (!collection || collection.models.length === 0) {
		return result(res, 404, 'Collection not found');
	}

	const datasetFile = path.join(__basedir, 'static/datasets', collection.dataset);
	let model: IModel = collection.models[0];

	for (const _model of collection.models) {
		if (_model.accuracy > model.accuracy) {
			model = _model;
		}
	}
	let modelFile = path.join(__basedir, 'static/models', model._id + '.sav');

	let predicting_data = req.body.data;
	predicting_data = predicting_data.join(',');

	let message = '';

	try {
		const formData = new FormData();
		formData.append('dataset', fs.createReadStream(datasetFile));
		formData.append('model', fs.createReadStream(modelFile));
		formData.append('data', predicting_data + ', ');

		const { data } = await axios.post(process.env.PYTHON_SERVER_URL + 'predict-model', formData);
		if (!data.success) {
			throw new Error(data.message);
		}
		message = data.message;
	} catch (err) {
		console.log(err);
		let message = 'Unknown Error';
		if (err instanceof Error) {
			message = err.message;
		}
		logger(message);
		return result(res, 500, 'Unable to predict model');
	}

	const results_mapping = JSON.parse((collection.results_mapping as any) || '{}');
	if (results_mapping[message]) {
		message = results_mapping[message];
	}

	result(res, 200, message);
};

const result = (res: Response, status: number, data: string | number | object) => {
	res.status(status).json(data);
};
