import { useState, useEffect } from 'react';

const useDarkMode = () => {
	const [isDarkMode, setDarkMode] = useState(
		localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	);

	const toggleDarkMode = () => {
		setDarkMode((prev) => !prev);
	};

	useEffect(() => {
		localStorage.theme = isDarkMode ? 'dark' : 'light';
		if (isDarkMode) {
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
		}
	}, [isDarkMode]);

	return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;
