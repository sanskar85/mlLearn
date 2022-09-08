import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GetPredictionFields, PredictData as predictData } from '../../api/CollectionsHelper';
import { GEOMETRIC_LINES } from '../../assets/Images';
import DarkModeToggle from '../../components/DarkModeToggle';
import Box from '../../components/modules/Box';
import Button from '../../components/modules/Button';
import Image from '../../components/modules/Image';
import Input from '../../components/modules/Input';
import Screen from '../../components/modules/Screen';
import Text from '../../components/modules/Text';
import SpotBackground from '../../components/SpotBackground';
import { IoArrowUndo as BackIcon } from 'react-icons/io5';
import {
	reset,
	setData,
	setPredictionFields,
	setResult,
} from '../../store/reducers/PredictReducer';
import { RootState, StoreNames } from '../../store/store';

const Predict = () => {
	const { id } = useParams<{ id: string }>();
	const { fields, data, result } = useSelector((state: RootState) => state[StoreNames.PREDICT]);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (!id) {
			navigate('/not-found');
			return;
		}
		dispatch(reset());

		GetPredictionFields(id)
			.then((fields) => dispatch(setPredictionFields(fields)))
			.catch((err) => navigate('/not-found'));
	}, [id, dispatch, navigate]);

	console.log(data);

	const predict = () => {
		const values = Object.values(data);
		const hasEmpty = values.some((value) => value === '');
		if (hasEmpty || !id || values.length === 0) {
			toast.error('Please fill out all fields');
			return;
		}
		predictData(id, values)
			.then((result) => dispatch(setResult(result)))
			.catch((err) => {
				toast.error(err);
			});
	};

	const handleBack = () => {
		navigate(`/collections/${id}`);
	};

	return (
		<Screen background={<SpotBackground />} backgroundBlur='md'>
			<Image
				src={GEOMETRIC_LINES}
				className='h-screen w-full md:w-3/4 -z-10 object-cover absolute top-0 right-0 dark:invert invert-0 opacity-75'
			/>
			<BackIcon
				className='absolute left-6 top-4 invert-0 dark:invert cursor-pointer w-6 h-6 opacity-75 hover:opacity-100'
				onClick={handleBack}
			/>
			<Box className='justify-between pb-6 h-full rounded-md mx-6 my-12 md:m-12 p-2 bg-light/80 dark:bg-dark/80 border border-dark/50 dark:border-light/50 overflow-y-scroll'>
				<Box className='grid grid-cols-1 md:grid-cols-2 gap-3'>
					{fields.map((field, index) => {
						if (field.available_options && field.available_options.length > 0) {
							return (
								<Box
									key={index}
									className='border mt-3 mx-[5%] border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'
								>
									<Text className='text-xs text-dark dark:text-light opacity-80'>
										{field.label}
									</Text>
									<select
										className=' bg-transparent text-dark dark:text-light border-none outline-none '
										value={data[field.name]}
										onChange={(e) => dispatch(setData({ [field.name]: e.target.value }))}
									>
										{field.available_options.map((option) => (
											<option value={option}>{option}</option>
										))}
									</select>
								</Box>
							);
						} else {
							return (
								<Box
									key={index}
									className='border mt-3 mx-[5%] border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'
								>
									<Text className='text-xs text-dark dark:text-light opacity-80'>
										{field.label}
									</Text>
									<Input
										type='text'
										placeholder={`Enter value of ${field.label}`}
										className='text-dark dark:text-light '
										value={data[field.name]}
										onChange={(text: string) =>
											dispatch(setData({ name: field.name, value: text }))
										}
									/>
								</Box>
							);
						}
					})}
				</Box>
				<Box className=' mx-6  md:mx-12 mt-6'>
					<Text className='font-semibold text-center text-dark dark:text-light capitalize'>
						{result}
					</Text>

					<Button
						onClick={predict}
						className=' py-2 rounded-md mt-3 bg-green-400 hover:bg-green-500 border border-green-900 border-dashed'
					>
						<Text className='font-semibold uppercase tracking-wider  text-light '>Predict</Text>
					</Button>
				</Box>
			</Box>
			<DarkModeToggle />
		</Screen>
	);
};

export default Predict;
