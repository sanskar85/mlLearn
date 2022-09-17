import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../not-found.css';
import Box from './modules/Box';
import Button from './modules/Button';
import Screen from './modules/Screen';
import Text from './modules/Text';

const NotFound = () => {
	const navigate = useNavigate();
	const navigateToHome = () => {
		navigate('/collections');
	};
	return (
		<Screen className='not-found flex-center font-sans bg-[#353535] text-[#dddddd] not-found_perspective-1200'>
			<Text className='not-found_header'>404</Text>
			<Box className='fixed-0 overflow-hidden'>
				<Box className='centered-axis-xy h-[250vmax] w-[250vmax]'>
					<Box className='h-full w-full not-found_cloak'></Box>
				</Box>
			</Box>
			<Box className='not-found_info'>
				<h2>We can't find that page</h2>
				<p>
					We're fairly sure that page used to be here, but seems to have gone missing. We do
					apologise on it's behalf.
				</p>
				<Button
					onClick={navigateToHome}
					className='bg-[#b3b3b3] px-16 py-4 rounded-full text-sm tracking-wider'
				>
					<Text className='uppercase text-[#0a0a0a] '>Home</Text>
				</Button>
			</Box>
		</Screen>
	);
};

export default NotFound;
