import React, { FC } from 'react';
export interface ScreenProps {
	backgroundBlur?: 'none' | 'sm' | 'normal' | 'md' | 'lg';
	children: React.ReactNode;
	background?: React.ReactNode;
	className?: string;
}

const BackgroundBlur = {
	none: '',
	sm: 'backdrop-blur-sm',
	normal: 'backdrop-blur',
	md: 'backdrop-blur-md',
	lg: 'backdrop-blur-lg',
};

const Screen: FC<ScreenProps> = (props) => {
	const backgroundBlurClass: string = BackgroundBlur[props.backgroundBlur || 'none'];

	return (
		<section className='relative !overflow-hidden'>
			{props.background && (
				<div className={` h-screen w-screen !overflow-hidden absolute-0 -z-10`}>
					{props.background}
				</div>
			)}
			<div
				className={`flex flex-col  h-screen w-screen overflow-hidden ${props.className} ${backgroundBlurClass}`}
			>
				{props.children}
			</div>
		</section>
	);
};

Screen.defaultProps = {
	children: null,
	backgroundBlur: 'none',
	background: null,
	className: '',
};

export default Screen;
