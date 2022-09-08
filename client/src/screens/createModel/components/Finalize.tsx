import React from 'react';
import Box from '../../../components/modules/Box';
import ProgressBar, { ProgressBarHandle } from '../../../components/modules/ProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, StoreNames } from '../../../store/store';
import { prevStage, setActiveColumn } from '../../../store/reducers/CreateModelReducer';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import ConstructCSVWorker from '../../../utils/worker/construct-csv-worker';
import { CreateModel } from '../../../api/CollectionsHelper';
import { useNavigate } from 'react-router-dom';

const workerInstance = new Worker(ConstructCSVWorker);

const Finalize = () => {
	const navigate = useNavigate();
	const [label, setLabel] = React.useState('Verifying data...');

	const progressBar = React.useRef<ProgressBarHandle>(null);

	const state = useSelector((state: RootState) => state[StoreNames.CREATE_MODEL]);

	const dispatch = useDispatch();

	const upload = React.useCallback(
		async ({
			file,
			name,
			summary,
			description,
			column_details,
			results_mapping,
		}: {
			file: File;
			name: string;
			summary: string;
			description: string;
			column_details: IColumnDetails[];
			results_mapping: {
				[key: string]: string;
			};
		}) => {
			progressBar.current?.setProgress(90);
			setLabel('Uploading data.');

			const labels: {
				[key: string]: string;
			} = {};
			for (let i = 0; i < column_details.length; i++) {
				labels[column_details[i].name] = column_details[i].label;
			}

			CreateModel({
				name,
				summary,
				description,
				file,
				labels,
				results_mapping,
			})
				.then(() => {
					progressBar.current?.setProgress(100);
					toast.success('Model training has started.');

					setTimeout(() => {
						navigate('/collections/my-collections');
					}, 5500);
				})
				.catch((err) => {
					toast.error('Failed to upload data. ' + err.message);
				});
		},
		[navigate]
	);

	const constructCSV = React.useCallback(() => {
		setLabel('Constructing CSV.');
		progressBar.current?.setProgress(20);

		workerInstance.postMessage({
			columns: state.columns,
			rows: state.rows,
			column_details: state.column_details,
		});
	}, [state]);

	React.useEffect(() => {
		workerInstance.onmessage = (e) => {
			if (e.data.type === 'progress') {
				const progress = e.data.progress * 0.8 + 20;

				progressBar.current?.setProgress(progress);
			} else if (e.data.type === 'done') {
				setLabel('Done.');
				progressBar.current?.setProgress(100);
				const csv = e.data.csv;
				progressBar.current?.setProgress(50);
				setLabel('Writing CSV file.');
				const csvString = Papa.unparse(csv);
				progressBar.current?.setProgress(80);
				const blob = new Blob([csvString], { type: 'text/csv' });
				const file = new File([blob], 'file.csv', { type: 'text/csv' });
				const results_mapping = state.results_mapping;

				upload({
					file,
					name: state.name,
					summary: state.summary,
					description: state.description,
					column_details: state.column_details,
					results_mapping: results_mapping,
				});
			}
		};
	}, [dispatch, upload, state]);

	const validateData = React.useCallback(() => {
		if (state.file === null) {
			toast.error('No file selected');
			dispatch(prevStage());
		} else if (!state.name || !state.summary || !state.description) {
			toast.error('Please fill out model details');
			dispatch(prevStage());
		}
		progressBar.current?.setProgress(10);

		const no_label = state.column_details.findIndex((col) => !col.label);
		if (no_label !== -1) {
			toast.error('Please fill out all column labels');
			dispatch(setActiveColumn(no_label));
			dispatch(prevStage());
			return;
		}
		const dependent = state.column_details.some((col) => col.dependent);
		if (!dependent) {
			toast.error('Please select a dependent column');
			dispatch(prevStage());
			return;
		}

		constructCSV();
	}, [constructCSV, dispatch, state]);

	React.useEffect(() => {
		validateData();
	}, [validateData]);

	return (
		<Box className='h-full w-full'>
			<ProgressBar ref={progressBar} label={label} />
		</Box>
	);
};

export default Finalize;
