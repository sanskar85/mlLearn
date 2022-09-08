import React from 'react';
import { CIRCLE } from '../assets/Images';
import Image from './modules/Image';
import Screen from './modules/Screen';

const SpotBackground = () => {
	return (
		<Screen className=' bg-light dark:bg-dark'>
			<Image
				src={CIRCLE}
				resizeMode='cover'
				className='w-[200px] absolute left-[10%] top-[10%] blur-lg opacity-45'
			/>
			<Image
				src={CIRCLE}
				resizeMode='cover'
				className='w-[150px] absolute left-[50%] top-[15%] blur-lg opacity-45'
			/>
			<Image
				src={CIRCLE}
				resizeMode='cover'
				className='w-[125px] absolute left-[15%] top-[55%] blur-lg opacity-45'
			/>
			<Image
				src={CIRCLE}
				resizeMode='cover'
				className='w-[100px] absolute left-[50%] top-[70%] blur-lg opacity-45'
			/>
		</Screen>
	);
};

export default SpotBackground;
