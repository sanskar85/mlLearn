import React from 'react';
import Box from '../../../components/modules/Box';
import ProgressBar, { ProgressBarHandle } from '../../../components/modules/ProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, StoreNames } from '../../../store/store';
import { prevStage, reset, setActiveColumn } from '../../../store/reducers/CreateModelReducer';
import { toast } from 'react-toastify';
import { UpdateModel } from '../../../api/CollectionsHelper';
import { useNavigate } from 'react-router-dom';

const Finalize = () => {
	const navigate = useNavigate();
	const [label, setLabel] = React.useState('Verifying data...');

	const progressBar = React.useRef<ProgressBarHandle>(null);

	const state = useSelector((state: RootState) => state[StoreNames.CREATE_MODEL]);

	const dispatch = useDispatch();

	const upload = React.useCallback(
		async ({
			id,
			name,
			summary,
			description,
			column_details,
		}: {
			id: string;
			name: string;
			summary: string;
			description: string;
			column_details: IColumnDetails[];
		}) => {
			progressBar.current?.setProgress(90);
			setLabel('Uploading data.');

			const labels: {
				[key: string]: string;
			} = {};
			for (let i = 0; i < column_details.length; i++) {
				labels[column_details[i].name] = column_details[i].label;
			}

			UpdateModel({
				id,
				name,
				summary,
				description,
				labels,
			})
				.then(() => {
					progressBar.current?.setProgress(100);
					toast.success('Model details updated.');

					setTimeout(() => {
						navigate('/collections/my-collections');
						dispatch(reset());
					}, 5500);
				})
				.catch((err) => {
					toast.error('Failed to upload data. ' + err);
				});
		},
		[navigate, dispatch]
	);

	const constructCSV = React.useCallback(() => {
		setLabel('Parsing data.');
		progressBar.current?.setProgress(50);
		setLabel('Done.');
		progressBar.current?.setProgress(70);
		setLabel('Uploading data.');
		progressBar.current?.setProgress(80);

		upload({
			id: state.id,
			name: state.name,
			summary: state.summary,
			description: state.description,
			column_details: state.column_details,
		});
	}, [state, upload]);

	const validateData = React.useCallback(() => {
		if (!state.name || !state.summary || !state.description) {
			toast.error('Please fill out model details');
			dispatch(prevStage());
		}
		progressBar.current?.setProgress(20);

		const no_label = state.column_details.findIndex((col) => !col.label);
		if (no_label !== -1) {
			toast.error('Please fill out all column labels');
			dispatch(setActiveColumn(no_label));
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
