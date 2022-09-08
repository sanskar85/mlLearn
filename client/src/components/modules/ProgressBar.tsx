import React from 'react';
import Box from './Box';
import Text from './Text';
import $ from 'jquery';

interface ProgressBarProps {
	label?: string;
}

export interface ProgressBarHandle {
	setProgress: (progress: number) => void;
}

const ProgressBar = React.forwardRef<ProgressBarHandle, ProgressBarProps>((props, forwardRef) => {
	const ref = React.useRef<HTMLDivElement>(null);

	React.useImperativeHandle(forwardRef, () => ({
		setProgress: (progress: number) => {
			_setProgress(progress);
		},
	}));

	const _setProgress = (progress: number) => {
		if (!ref.current) return;

		$(ref.current).css('width', `${progress}%`);
	};

	return (
		<Box className='h-full  border border-dashed  rounded-md m-2 md:m-6 p-2 flex-center '>
			<Box className='w-[200px] md:w-[400px] h-[20px] px-2 rounded-md border border-dark/80 dark:border-light/80 justify-center'>
				<div ref={ref} className='w-[0%]  h-[5px] bg-orange-500 rounded-md transition-all'>
					&nbsp;
				</div>
			</Box>
			<Text className='text-dark dark:text-light opacity-75 mt-2 font-bold'>
				{props.label} Please wait <span className='animate-pulse'>...</span>
			</Text>
		</Box>
	);
});

export default ProgressBar;
