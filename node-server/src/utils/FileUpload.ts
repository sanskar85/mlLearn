import { Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'static/uploads');
	},
	filename: (req, file, cb) => {
		cb(null, uuid() + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage }).single('file');

const FileUpload = (req: Request, res: Response) => {
	return new Promise((resolve: (filename: string) => void, reject) => {
		upload(req, res, (err) => {
			if (err) {
				return reject(err);
			}
			if (!req.file) {
				return reject('No file uploaded.');
			}
			resolve(req.file.filename);
		});
	});
};

const multi_upload = multer({ storage }).array('files', 1000);

const MultiFileUpload = (req: Request, res: Response) => {
	return new Promise((resolve, reject) => {
		multi_upload(req, res, (err) => {
			if (err) {
				return reject(err);
			}
			if (req.files && Array.isArray(req.files)) {
				resolve(req.files.map((file) => file.filename));
			} else {
				return reject('No files uploaded.');
			}
			if (req.file) {
				resolve([req.file.filename]);
			} else {
				return reject('No files uploaded.');
			}
		});
	});
};

export default FileUpload;

export { MultiFileUpload };
