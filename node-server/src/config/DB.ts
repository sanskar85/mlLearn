import mongoose from 'mongoose';

const connect = () => {
	// Connecting to the database
	mongoose
		.connect(process.env.DATABASE_URL!)
		.then(() => {
			console.log('Successfully connected to database');
		})
		.catch((error) => {
			console.log('database connection failed. exiting now...');
			console.error(error);
			logger(error);
			process.exit(1);
		});
};

export default connect;
