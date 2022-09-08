import React from 'react';

interface InputProps {
	type?: 'text' | 'password' | 'email' | 'number' | 'search';
	className?: string;
	placeholder?: string;
	value: string;
	multiline?: boolean;
	onChange: (text: string) => void;
}

const Input: React.FC<InputProps> = (props) => {
	if (props.multiline) {
		return (
			<textarea
				className={`outline-none border-none bg-transparent rounded-md resize-none ${props.className}`}
				placeholder={props.placeholder}
				value={props.value}
				onChange={(e) => props.onChange(e.target.value)}
			/>
		);
	}
	return (
		<input
			type={props.type}
			step='any'
			className={`outline-none border-none bg-transparent rounded-md ${props.className}`}
			placeholder={props.placeholder}
			value={props.value}
			onChange={(e) => props.onChange(e.target.value)}
		/>
	);
};

Input.defaultProps = {
	type: 'text',
	className: '',
	placeholder: '',
	value: '',
	multiline: false,
	onChange: (text) => {},
};

export default Input;
