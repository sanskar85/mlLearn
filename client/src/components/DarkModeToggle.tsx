import React from 'react';
import useDarkMode from '../hooks/DarkMode';
import Button from './modules/Button';
import { FaMoon } from 'react-icons/fa';
import { IoSunny } from 'react-icons/io5';

const DarkModeToggle = () => {
	const { isDarkMode, toggleDarkMode } = useDarkMode();
	return (
		<Button
			className='aspect-square fixed left-4 bottom-4 p-2 flex-center rounded-full  '
			ripple
			rippleProps={{
				backgroundColor: ['bg-dark/60', 'dark:bg-light/60'],
				activeColor: ['bg-dark/90', 'dark:bg-light/90'],
				hoverColor: ['bg-dark/80', 'dark:bg-light/80'],
				focusColor: ['bg-dark/80', 'dark:bg-light/80'],
			}}
			onClick={toggleDarkMode}
		>
			{isDarkMode ? <FaMoon /> : <IoSunny className='invert' />}
		</Button>
	);
};

export default DarkModeToggle;
