import React from 'react';
import Box from './Box';
import Button from './Button';

interface CheckboxProps {
	isSelected: boolean;
	onClick?: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ isSelected, onClick }) => {
	return (
		<Button
			onClick={onClick}
			className='w-[20px] h-[20px] flex-center rounded-md border cursor-pointer select-none border-dark/50 dark:border-light/50'
		>
			<Box
				className={`w-[12px] h-[12px] bg-dark dark:bg-light rounded-full transition-all ${
					!isSelected && 'hidden'
				}`}
			>
				&nbsp;
			</Box>
		</Button>
	);
};

Checkbox.defaultProps = {
	isSelected: false,
	onClick: () => {},
};

export default Checkbox;
