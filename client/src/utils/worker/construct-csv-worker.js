const worker_code = () => {
	// eslint-disable-next-line no-restricted-globals
	self.onmessage = (message) => {
		const { rows, columns, column_details } = message.data;

		const _column_details = column_details.reduce((prev, curr) => {
			prev[curr.name] = {
				label: curr.label,
				required: curr.required,
				independent: curr.independent,
				dependent: curr.dependent,
			};
			return prev;
		}, {});

		const csv = [];

		const row = parseColumn(columns, _column_details);
		csv.push(row);
		console.log('start');

		for (let i = 0; i < rows.length; i++) {
			const progress = Math.floor((i / rows.length) * 100);

			postMessage({ type: 'progress', progress });

			const newRow = parseRow(rows[i], columns, _column_details);
			csv.push(newRow);
		}

		postMessage({ type: 'progress', progress: 100 });
		postMessage({ type: 'done', csv });
	};

	const parseColumn = (columns, column_details) => {
		const newRow = [];
		const dependent = [];
		columns.forEach((column) => {
			if (!column_details[column].required) {
				return;
			}
			if (column_details[column].dependent) {
				dependent.push(column);
				return;
			}
			newRow.push(column);
		});
		if (dependent.length > 0) {
			newRow.push(...dependent);
		}
		return newRow;
	};

	const parseRow = (row, columns, column_details) => {
		const newRow = [];
		const dependent = [];
		columns.forEach((column) => {
			if (!column_details[column].required) {
				return;
			}
			if (column_details[column].dependent) {
				dependent.push(row[column]);
				return;
			}
			newRow.push(row[column]);
		});
		if (dependent.length > 0) {
			newRow.push(...dependent);
		}
		return newRow;
	};
};

let code = worker_code.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], { type: 'application/javascript' });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;
