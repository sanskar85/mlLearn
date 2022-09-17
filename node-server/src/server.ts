import { config } from 'dotenv';
config();

//  ------------------------- Connection with DB
import connectDB from './config/DB';
connectDB();

//  ------------------------- Setup Logger
import Logger from './utils/Logger';
global.logger = Logger;
global.__basedir = __dirname.slice(0, __dirname.lastIndexOf('/'));

import express, { Request } from 'express';
const app = express();

//  ------------------------- Imports

import cookieParser from 'cookie-parser';
import moment from 'moment';

//----------------------------------------------------CORS

import cors from 'cors';
// const allowlist = [process.env.CLIENT_URL];

const corsOptionsDelegate = (req: Request, callback: any) => {
	let corsOptions;

	// let isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;

	// if (isDomainAllowed) {
	// 	// Enable CORS for this request
	// 	corsOptions = { origin: true, credentials: true };
	// } else {
	// 	// Disable CORS for this request
	// 	corsOptions = { origin: false };
	// }

	corsOptions = { origin: true, credentials: true };
	callback(null, corsOptions);
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptionsDelegate));
app.use(cookieParser());
app.use(express.static(__basedir + 'static'));

app.get('/api', async (req, res) => {
	res.status(200).json({
		success: true,
		message: 'API Working',
	});
});

//  ------------------------- Routes
import AuthRoute from './routes/Auth';
import CollectionsRoute from './routes/Collections';
import ModelRoute from './routes/Models';

app.use('/auth', AuthRoute);
app.use('/collections', CollectionsRoute);
app.use('/model', ModelRoute);
app.get('/images/:imageID', async (req, res) => {
	if (!req.params.imageID) {
		return res.status(404);
	}
	try {
		res.sendFile(__basedir + '/static/uploads/' + req.params.imageID);
	} catch (e) {
		return res.status(404);
	}
});

const PORT = process.env.PORT!;
const server = app.listen(PORT, () =>
	console.log(`Server running at ${getTime()} on port ${PORT}`)
);

process.on('unhandledRejection', (err: Error) => {
	console.log(err);

	console.log(`Logged Error at ${getTime()}: ${err.message}`);
	server.close(() => process.exit(1));
});

const getTime = () => {
	return moment().format('YYYY-MM-DD HH:mm:ss');
};
