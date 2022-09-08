import fs from 'fs';
import moment from 'moment';

const Log = (data: string) => {
	const time = moment().format('YYYY-MM-DD hh:mm A :: ');
	const logData = time.concat(data).concat('\n');
	fs.appendFile(
		__basedir + `/static/logs/${moment().format('MMM YYYY')}.log`,
		logData,
		'utf8',
		function (err) {
			if (err) {
				console.log('Error Saving Log File');
				console.log(err);
			}
		}
	);
};

export default Log;
