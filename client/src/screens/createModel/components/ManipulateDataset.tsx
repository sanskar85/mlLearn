import React from 'react';
import Box from '../../../components/modules/Box';
import Text from '../../../components/modules/Text';
import { RootState, StoreNames } from '../../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { IoArrowUndo as BackIcon } from 'react-icons/io5';
import {
	nextStage,
	prevStage,
	setActiveColumn,
	setColumnLabel,
	setColumnRequired,
	setResultsMapping,
	toggleColumnDependence,
} from '../../../store/reducers/CreateModelReducer';
import Button from '../../../components/modules/Button';
import Checkbox from '../../../components/modules/Checkbox';
import Input from '../../../components/modules/Input';

const ManipulateDataset = () => {
	const { file } = useSelector((state: RootState) => state[StoreNames.CREATE_MODEL]);
	const dispatch = useDispatch();

	const handleNext = () => {
		dispatch(nextStage());
	};

	const handleBack = React.useCallback(() => {
		dispatch(prevStage());
	}, [dispatch]);

	React.useEffect(() => {
		if (!file) {
			handleBack();
		}
	}, [file, handleBack]);

	return (
		<Box className='h-full w-full'>
			<Box horizontal className='justify-between items-center px-2 md:px-6'>
				<BackIcon
					className='invert-0 dark:invert cursor-pointer w-6 h-6 opacity-75 hover:opacity-100'
					onClick={handleBack}
				/>
				<Button
					className='bg-light hover:bg-orange-500 px-6 py-2 text-orange-500 hover:text-white font-semibold rounded-md hover:scale-105'
					onClick={handleNext}
				>
					<Text>Next</Text>
				</Button>
			</Box>
			<Box className='flex-col md:flex-row h-[90%] w-full '>
				<Columns />
				<ColumnDetail />
			</Box>
		</Box>
	);
};

const Columns = () => {
	const { columns, active_column, column_details } = useSelector(
		(state: RootState) => state[StoreNames.CREATE_MODEL]
	);
	const dispatch = useDispatch();
	return (
		<Box className='md:w-1/4  rounded-md m-2 md:my-2 md:mx-6 p-2 border border-dark/50 dark:border-light/50 bg-neutral-50'>
			<Box className='bg-black/80  h-[40px] rounded-md flex-center'>
				<Text className='text-light font-semibold uppercase'>Columns</Text>
			</Box>
			<Box className='overflow-y-scroll h-[200px] md:h-full'>
				{columns.map((column, index) => (
					<Button
						key={index}
						className={`h-[40px] justify-center mt-2 w-full rounded-md px-2 py-1 cursor-pointer ${
							active_column === index && 'bg-dark/20'
						} `}
						onClick={() => dispatch(setActiveColumn(index))}
					>
						<Text
							className={`font-semibold uppercase ${
								!column_details[index].required && 'text-red-500'
							} ${column_details[index].dependent && 'text-green-500'}`}
						>
							{column}
						</Text>
					</Button>
				))}
			</Box>
		</Box>
	);
};

const ColumnDetail = () => {
	const { active_column, column_details, rows, results_mapping } = useSelector(
		(state: RootState) => state[StoreNames.CREATE_MODEL]
	);

	const results = React.useMemo(() => {
		const column = column_details[active_column];
		if (!column) return [];
		if (column.independent) {
			return [];
		}
		const unique = rows
			.map((row) => row[column.name])
			.filter((value, index, self) => self.indexOf(value) === index);
		return unique;
	}, [rows, column_details, active_column]);

	const dispatch = useDispatch();

	return (
		<Box className='w-full md:w-3/4 gap-3 rounded-md m-2 md:my-2 md:mx-6 p-2'>
			<Box className='flex:col md:flex-row  items-center gap-x-3 text-dark dark:text-light'>
				<Box horizontal className='gap-x-3 items-center'>
					<Checkbox
						isSelected={column_details[active_column]?.required}
						onClick={() => dispatch(setColumnRequired())}
					/>
					<Text>Required</Text>
				</Box>
				<Text className='opacity-60 hover:opacity-80'>
					{'( Will it be used in model training ? )'}
				</Text>
			</Box>
			{column_details[active_column]?.required && (
				<>
					<Box horizontal className='items-center gap-3 text-dark dark:text-light'>
						<Text>Name : </Text>
						<Text>{column_details[active_column]?.name}</Text>
					</Box>
					<Box className='border border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'>
						<Text className='text-xs text-dark dark:text-light opacity-80'>Column Label</Text>
						<Input
							type='text'
							placeholder='It is will be used as input label for Prediction'
							className='text-dark dark:text-light '
							value={column_details[active_column]?.label}
							onChange={(text: string) => dispatch(setColumnLabel(text))}
						/>
					</Box>
					<Box className='group flex:col md:flex-row mt-6 items-center gap-x-3 text-dark dark:text-light'>
						<Box horizontal className='gap-x-3 items-center'>
							<Checkbox
								isSelected={column_details[active_column]?.independent}
								onClick={() => dispatch(toggleColumnDependence())}
							/>
							<Text>Independent Variable</Text>
						</Box>
						<Text className='group-hover:block hidden opacity-60 hover:opacity-80'>
							{'( Will be used as input ? )'}
						</Text>
					</Box>
					<Box className='group flex:col md:flex-row items-center gap-x-3 text-dark dark:text-light'>
						<Box horizontal className='gap-x-3 items-center'>
							<Checkbox
								isSelected={column_details[active_column]?.dependent}
								onClick={() => dispatch(toggleColumnDependence())}
							/>
							<Text>Dependent Variable</Text>
						</Box>
						<Text className='group-hover:block hidden opacity-60 hover:opacity-80'>
							{'( Will be used as Output ? )'}
						</Text>
					</Box>

					{column_details[active_column]?.dependent && (
						<Box>
							<Box className='rounded-md mt-6  p-2 border border-dark/50 dark:border-light/50 bg-neutral-50'>
								<Box
									horizontal
									className='bg-black/80 p-1.5 rounded-md items-center justify-between'
								>
									<Text className='text-light font-medium '>Results</Text>
									<Text className='text-light font-medium '>Displayed As</Text>
								</Box>
								{results.map((result, index) => (
									<Box
										horizontal
										key={index}
										className='odd:bg-zinc-200 mt-1 w-full px-2 rounded-sm items-center justify-between'
									>
										<Text className='opacity-80 max-w-min'>{result}</Text>
										<Input
											type='text'
											placeholder='Displayed As'
											className='text-light dark:text-dark text-right pl-6 flex-1'
											value={results_mapping[result]}
											onChange={(text) => dispatch(setResultsMapping({ result, text }))} //{(text: string) => dispatch(setColumnResult(text))}
										/>
									</Box>
								))}
							</Box>
						</Box>
					)}
				</>
			)}
		</Box>
	);
};

export default ManipulateDataset;
