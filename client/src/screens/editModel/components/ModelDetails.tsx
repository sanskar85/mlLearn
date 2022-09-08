import React from 'react';
import Box from '../../../components/modules/Box';
import { RootState, StoreNames } from '../../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import {
	nextStage,
	setDescription,
	setDetails,
	setID,
	setModelName,
	setSummary,
} from '../../../store/reducers/CreateModelReducer';
import { toast } from 'react-toastify';
import Input from '../../../components/modules/Input';
import Text from '../../../components/modules/Text';
import { IoArrowUndo as BackIcon } from 'react-icons/io5';
import Button from '../../../components/modules/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteModel as deleteModel } from '../../../api/CollectionsHelper';
import { MdDelete } from 'react-icons/md';

const ModelDetails: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const state = useSelector((state: RootState) => state[StoreNames.CREATE_MODEL]);
	const dispatch = useDispatch();

	const handleNext = () => {
		if (!state.name) {
			toast.error('Please enter a model name');
			return;
		} else if (!state.summary) {
			toast.error('Please enter a summary');
			return;
		} else if (!state.description) {
			toast.error('Please enter a description');
			return;
		}
		dispatch(nextStage());
	};

	const handleBack = React.useCallback(() => {
		navigate('/collections/' + id);
	}, [navigate, id]);

	const handleDelete = () => {
		if (!id) return navigate('/not-found');
		deleteModel(id)
			.then(() => {
				toast.success('Model deleted');
				navigate('/collections/my-collections');
			})
			.catch((err) => toast.error(err));
	};

	return (
		<Box className='h-full w-full p-2 overflow-y-scroll px-2 md:px-6'>
			<Box horizontal className='justify-between items-center '>
				<BackIcon
					className='invert-0 dark:invert cursor-pointer w-6 h-6 opacity-75'
					onClick={handleBack}
				/>
				<Button
					className='bg-light  hover:bg-orange-500 px-6 py-2 text-orange-500 hover:text-white font-semibold rounded-md hover:scale-105'
					onClick={handleNext}
				>
					<Text>Next</Text>
				</Button>
			</Box>

			<Box className='border mt-3 border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'>
				<Text className='text-xs text-dark dark:text-light opacity-80'>Model Name</Text>
				<Input
					type='text'
					placeholder='It is recommended to use a name that describes the model'
					className='text-dark dark:text-light '
					value={state.name}
					onChange={(text: string) => dispatch(setModelName(text))}
				/>
			</Box>
			<Box className='mt-3 border border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'>
				<Text className='text-xs text-dark dark:text-light opacity-80'>Summary</Text>
				<Input
					multiline
					placeholder='Describe the model in a few words'
					className='text-dark dark:text-light h-[200px] md:h-[100px]'
					value={state.summary}
					onChange={(text: string) => dispatch(setSummary(text))}
				/>
			</Box>
			<Box className='mt-3 border border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'>
				<Text className='text-xs text-dark dark:text-light opacity-80'>Description</Text>
				<Input
					multiline
					placeholder='Provide a full description of the model. This will be displayed on the model page.'
					className='text-dark dark:text-light h-[300px] md:h-[200px]'
					value={state.description}
					onChange={(text: string) => dispatch(setDescription(text))}
				/>
			</Box>
			<Box className='mt-3 items-end '>
				<Button
					className='flex-center gap-1 bg-red-500 w-[150px] hover:bg-red-600 px-6 py-2 text-light hover:text-white font-semibold rounded-md hover:scale-105'
					onClick={handleDelete}
				>
					<MdDelete className='w-5 h-5' />
					<Text>Delete</Text>
				</Button>
			</Box>
		</Box>
	);
};

export default ModelDetails;
