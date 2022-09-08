import { Request, Response } from 'express';
import path from 'path';
import Collection from '../model/Collection';
import Model from '../model/Model';
import FileUpload from '../utils/FileUpload';
import fs from 'fs';
import { moveFile } from '../utils/Utilities';
import { ModelStatus } from '../utils/const';

export const ModelTrained = async (req: Request, res: Response) => {
	let file;
	try {
		file = await FileUpload(req, res);
	} catch (err) {
		return res.send('ok');
	}

	const { id, model, accuracy, recall, precision, f1_score, confusion_matrix, available_options } =
		req.body;

	if (!id) {
		return res.send('ok');
	}
	const collection = await Collection.findById(id);
	if (!collection) {
		return res.send('ok');
	}

	const _model = await Model.create({
		name: model,
		accuracy,
		recall,
		precision,
		f1_score,
		confusion_matrix,
	});
	collection.models.push(_model);

	collection.available_options = available_options;
	await collection.save();

	if (!file) {
		_model.status = ModelStatus.FAILED;
		await _model.save();
		return res.send('ok');
	}

	const uploadFilePath = path.join(__basedir, 'static/uploads', file);
	const destFilePath = path.join(__basedir, 'static/models', _model._id + path.extname(file));
	try {
		await moveFile(uploadFilePath, destFilePath);
	} catch (err) {
		fs.unlinkSync(uploadFilePath);
		_model.status = ModelStatus.FAILED;
		await _model.save();
		return res.send('ok');
	}

	_model.status = ModelStatus.COMPLETED;
	await _model.save();

	res.send('ok');
};

export const ErrorModelTraining = async (req: Request, res: Response) => {
	const { id, model } = req.body;
	if (!id) {
		return res.send('ok');
	}
	const collection = await Collection.findById(id);
	if (!collection) {
		return res.send('ok');
	}
	const _model = await Model.create({
		name: model,
		status: ModelStatus.FAILED,
	});
	collection.models.push(_model);
	await collection.save();

	res.send('ok');
};

const result = (res: Response, status: number, data: string | number | object) => {
	res.status(status).json(data);
};
