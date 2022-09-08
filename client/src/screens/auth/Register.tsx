import React from 'react';
import Box from '../../components/modules/Box';
import Input from '../../components/modules/Input';
import Text from '../../components/modules/Text';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, StoreNames } from '../../store/store';
import {
	setEmail,
	setName,
	setPassword,
	setRePassword,
	setSecurityAnswer,
	setSecurityQuestion,
} from '../../store/reducers/AuthReducer';
import Button from '../../components/modules/Button';
import { useNavigate } from 'react-router-dom';
import { BOUNCE_LOADING_LOTTIE } from '../../assets/Lottie';
import Lottie from 'lottie-react';
import { toast } from 'react-toastify';
import { Register as register } from '../../api/AuthHelper';

const Register = () => {
	const navigate = useNavigate();
	const state = useSelector((state: RootState) => state[StoreNames.AUTH]);
	const dispatch = useDispatch();

	const handleClick = () => {
		register()
			.then(() => {
				navigate('/collections');
			})
			.catch((err) => {
				toast.error(err);
			});
	};

	return (
		<Box className='w-[400px] items-center bg-light/90 dark:bg-dark/90 p-2 md:p-4 rounded-md border border-dark/80 dark:border-light/80 border-dashed shadow-lg'>
			<Text className='text-2xl uppercase text-orange-500 font-bold tracking-wider'>Register</Text>

			<Box className='w-full mt-3 border border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'>
				<Text className='text-xs text-dark dark:text-light opacity-80'>Name</Text>

				<Input
					type='text'
					placeholder='Abc'
					className='text-dark dark:text-light w-full'
					value={state.name}
					onChange={(text: string) => dispatch(setName(text))}
				/>
			</Box>
			<Box className='w-full mt-3 border border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'>
				<Text className='text-xs text-dark dark:text-light opacity-80'>Email</Text>

				<Input
					type='email'
					placeholder='abc@xyz.com'
					className='text-dark dark:text-light w-full'
					value={state.email}
					onChange={(text: string) => dispatch(setEmail(text))}
				/>
			</Box>
			<Box className='w-full mt-3 border border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'>
				<Text className='text-xs text-dark dark:text-light opacity-80'>Password</Text>

				<Input
					type='password'
					placeholder='********'
					className='text-dark dark:text-light w-full'
					value={state.password}
					onChange={(text: string) => dispatch(setPassword(text))}
				/>
			</Box>
			<Box className='w-full mt-3 border border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'>
				<Text className='text-xs text-dark dark:text-light opacity-80'>Re-enter Password</Text>

				<Input
					type='password'
					placeholder='********'
					className='text-dark dark:text-light w-full'
					value={state.re_password}
					onChange={(text: string) => dispatch(setRePassword(text))}
				/>
			</Box>

			<Box className='w-full mt-6 border border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'>
				<Text className='text-xs text-dark dark:text-light opacity-80'>Security Question</Text>

				<Input
					type='text'
					placeholder='What is your favorite color?'
					className='text-dark dark:text-light w-full'
					value={state.security_question}
					onChange={(text: string) => dispatch(setSecurityQuestion(text))}
				/>
			</Box>
			<Box className='w-full mt-3 border border-dashed border-dark/60 dark:border-light/60 py-0.5 px-2 rounded-md'>
				<Text className='text-xs text-dark dark:text-light opacity-80'>Security Answer</Text>

				<Input
					type='text'
					placeholder='Black'
					className='text-dark dark:text-light w-full'
					value={state.security_answer}
					onChange={(text: string) => dispatch(setSecurityAnswer(text))}
				/>
			</Box>
			<Button
				onClick={handleClick}
				className={`${
					state.loading
						? 'bg-dark/70 dark:bg-light '
						: 'bg-dark/70 dark:bg-light  hover:bg-orange-500  dark:hover:bg-orange-500'
				} relative w-full h-[45px] mt-3 flex-center  group rounded-md `}
			>
				{state.loading ? (
					<Box className='w-[90px] mt-3 centered-axis-xy'>
						<Lottie animationData={BOUNCE_LOADING_LOTTIE} loop={true} />;
					</Box>
				) : (
					<Text className=' text-orange-500 group-hover:text-light tracking-wider font-bold'>
						Register
					</Text>
				)}
			</Button>

			<Box horizontal className='flex-center mt-2'>
				<Button onClick={() => navigate('/auth/login')}>
					<Text className='text-sm text-indigo-700 dark:text-light opacity-70 hover:opacity-100'>
						Login
					</Text>
				</Button>
			</Box>
		</Box>
	);
};

export default Register;
