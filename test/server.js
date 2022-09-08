import express from 'express';
const app = express();
import cors from 'cors';

//------------------------------------------------------------------------------------

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import FileUpload from './FileUpload.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
global.__basedir = __dirname;

//-----------------------------------------------------------------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__basedir + 'static'));

//-----------------------------------------------------------------------------------------
const allowlist = ['http://localhost:5000'];

const corsOptionsDelegate = (req, callback) => {
	let corsOptions;

	let isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;

	if (isDomainAllowed) {
		// Enable CORS for this request
		corsOptions = { origin: true, credentials: true };
	} else {
		// Disable CORS for this request
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};
app.use(cors(corsOptionsDelegate));

//----------------------------------------------------------------------------------
app.post('/model/trained', async (req, res) => {
	let files;

	try {
		files = await FileUpload(req, res);
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			success: false,
			message: 'File upload failed',
		});
	}
	const { model, accuracy, recall, precision, f1_score, confusion_matrix } =
		req.body;

	res.send('ok');
});

app.post('/model/error-training', async (req, res) => {
	const { model, error } = req.body;
	console.log(model, error);

	res.send('ok');
});

const server = app.listen(9000, () => console.log(` Server running at  on port 9000`));
