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
} from '../../../store/reducers/CreateModelReducer';
import Button from '../../../components/modules/Button';
import Input from '../../../components/modules/Input';

const ManipulateDataset = () => {
	const dispatch = useDispatch();

	const handleNext = () => {
		dispatch(nextStage());
	};

	const handleBack = React.useCallback(() => {
		dispatch(prevStage());
	}, [dispatch]);

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
	const { columns, active_column } = useSelector(
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
						<Text className='font-semibold uppercase'>{column}</Text>
					</Button>
				))}
			</Box>
		</Box>
	);
};

const ColumnDetail = () => {
	const { active_column, column_details } = useSelector(
		(state: RootState) => state[StoreNames.CREATE_MODEL]
	);

	const dispatch = useDispatch();

	return (
		<Box className='w-full md:w-3/4 gap-3 rounded-md m-2 md:my-2 md:mx-6 p-2'>
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
		</Box>
	);
};

export default ManipulateDataset;
