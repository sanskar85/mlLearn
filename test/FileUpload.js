import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'static/uploads');
	},
	filename: (req, file, cb) => {
		cb(null, nanoid() + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage }).single('file');

const FileUpload = (req, res) => {
	return new Promise((resolve, reject) => {
		upload(req, res, (err) => {
			if (err) {
				reject(err);
			}
			resolve(req.file.filename);
		});
	});
};

const multi_upload = multer({ storage }).array('files', 1000);

const MultiFileUpload = (req, res) => {
	return new Promise((resolve, reject) => {
		multi_upload(req, res, (err) => {
			if (err) {
				reject(err);
			}
			if (req.files) resolve(req.files.map((file) => file.filename));
			else if (req.file) {
				resolve([req.file.filename]);
			} else {
				reject('Cannot Save Images');
			}
		});
	});
};

export default FileUpload;

export { MultiFileUpload };
