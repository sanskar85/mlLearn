import React from 'react';
import Box from '../../../components/modules/Box';
import Image from '../../../components/modules/Image';
import { ADD_FILES, ADD_FILES_DARK } from '../../../assets/Images';
import Text from '../../../components/modules/Text';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
	nextStage,
	setColumns,
	setFile,
	setRows,
} from '../../../store/reducers/CreateModelReducer';
import useDarkMode from '../../../hooks/DarkMode';
import Papa from 'papaparse';
import { RootState, StoreNames } from '../../../store/store';
import ProgressBar, { ProgressBarHandle } from '../../../components/modules/ProgressBar';

const UploadFile = () => {
	const progressBar = React.useRef<ProgressBarHandle>(null);
	const { file } = useSelector((state: RootState) => state[StoreNames.CREATE_MODEL]);

	const dispatch = useDispatch();

	const setProgress = (progress: number) => {
		progressBar.current?.setProgress(progress);
	};

	React.useEffect(() => {
		dispatch(setFile(null));
	}, [dispatch]);

	const onFileSelected = React.useCallback(
		(file: File) => {
			if (!file) {
				return;
			}
			dispatch(setFile(file));
			let size = 0;
			const reader = new FileReader();
			reader.onload = ({ target }) => {
				if (!target || !target.result) {
					return;
				}
				var csv = target.result as string; //the string version of your csv.
				var csvArray = csv.split('\n');
				size = csvArray.length - 1; //subtract 1 to remove the header row
			};
			reader.readAsText(file);

			const rows: object[] = [];
			let parser: Papa.Parser | null = null;

			Papa.parse(file, {
				header: true,
				skipEmptyLines: true,
				worker: true,
				step: function (results, _parser) {
					if (!parser) {
						parser = _parser;
					}
					if (results.data && typeof results.data === 'object') {
						rows.push(results.data);
						if (size !== 0) {
							const progress = Math.floor((rows.length / size) * 100);
							setProgress(progress);
						}
					}
				},
				complete: () => {
					dispatch(setRows(rows));
					if (rows.length > 0) {
						dispatch(setColumns(Object.keys(rows[0])));
						parser = null;
						dispatch(nextStage());
					} else {
						toast.error('No rows found in file');
					}
				},
			});

			return () => {
				parser?.abort();
			};
		},
		[dispatch]
	);

	return (
		<Box className='h-full w-full'>
			{file ? (
				<ProgressBar ref={progressBar} label='Processing CSV file.' />
			) : (
				<DropArea onFileSelected={onFileSelected} />
			)}
		</Box>
	);
};

const DropArea = ({ onFileSelected }: { onFileSelected: (file: File) => void }) => {
	const { isDarkMode } = useDarkMode();

	const onDrop = React.useCallback(
		(acceptedFiles: File[], fileRejections: any) => {
			if (fileRejections.length > 0) {
				if (fileRejections.length > 1) {
					return toast.error('Please upload only one file');
				} else if (fileRejections[0].file.type !== 'text/csv') {
					return toast.error('Only CSV files are supported.');
				}
				return;
			}
			if (acceptedFiles.length === 0) {
				return toast.error('Please upload a file');
			}

			if (acceptedFiles.length !== 1) {
				return toast.error('Only one file can be uploaded at a time.');
			}

			const file = acceptedFiles[0];
			onFileSelected(file);
		},
		[onFileSelected]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		accept: {
			'text/csv': ['.csv'],
		},
		validator: (file: File) => {
			if (!file || file.type !== 'text/csv') {
				return {
					code: 'INVALID_FILE_TYPE',
					message: 'Only CSV files are supported.',
				};
			}
			return null;
		},
	});

	return (
		<div
			{...getRootProps()}
			className='h-full  border border-dashed border-orange-500 bg-orange-200/5 rounded-md m-2 md:m-6 p-2 flex-center  !cursor-pointer'
		>
			<input {...getInputProps()} />

			<Box className='flex-center'>
				<Image src={isDarkMode ? ADD_FILES : ADD_FILES_DARK} className='h-1/4 w-1/4' />
				{isDragActive ? (
					<Text className='text-orange-500 text-bold mt-4'>Drop your file here</Text>
				) : (
					<>
						<Box
							horizontal
							className='flex-col md:flex-row items-center font-semibold mt-4 text-dark dark:text-light'
						>
							<Text className='md:mr-2 underline underline-offset-2'>Click to upload</Text>
							<Text>or drag and drop</Text>
						</Box>
						<Text className={`text-sm font-light mt-3 text-dark dark:text-light text-center `}>
							{'(Only *csv files will be accepted)*'}
						</Text>
					</>
				)}
			</Box>
		</div>
	);
};

export default UploadFile;
