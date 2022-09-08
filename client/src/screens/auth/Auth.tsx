import React from 'react';
import { Outlet } from 'react-router-dom';
import { GEOMETRIC_LINES } from '../../assets/Images';
import DarkModeToggle from '../../components/DarkModeToggle';
import Box from '../../components/modules/Box';
import Image from '../../components/modules/Image';
import Screen from '../../components/modules/Screen';
import SpotBackground from '../../components/SpotBackground';

const Auth = () => {
	return (
		<Screen background={<SpotBackground />} backgroundBlur='md'>
			<Image
				src={GEOMETRIC_LINES}
				className='h-screen w-full md:w-3/4 -z-10 object-cover absolute top-0 right-0 dark:invert invert-0 opacity-75'
			/>

			<Box className='w-full h-full flex-center'>
				<Outlet />
			</Box>

			<DarkModeToggle />
		</Screen>
	);
};

export default Auth;
