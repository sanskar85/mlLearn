import React, { FC } from 'react';

export interface ButtonPropsWithoutRipple {
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
}

export interface ButtonPropsWithRipple {
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
	ripple: true;
	rippleProps: {
		backgroundColor: string[];
		activeColor: string[];
		hoverColor: string[];
		focusColor: string[];
	};
}

const Button: FC<ButtonPropsWithRipple | ButtonPropsWithoutRipple> = (props) => {
	const rippleClass = React.useMemo(() => parseRippleProps(props), [props]);

	return (
		<button className={`transition-all ${props.className} ${rippleClass}`} onClick={props.onClick}>
			{props.children}
		</button>
	);
};

Button.defaultProps = {
	className: '',
	children: null,
	onClick: () => {},
};

const parseRippleProps = (props: ButtonPropsWithoutRipple | ButtonPropsWithRipple) => {
	if (!('ripple' in props)) {
		return '';
	}
	let rippleClass =
		'hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out';

	let { backgroundColor, activeColor, hoverColor, focusColor } = props.rippleProps;

	const _backgroundColor = backgroundColor.reduce((prev, color) => prev + ' ' + color, '');
	const _activeColor = activeColor.reduce((prev, color) => prev + ' active:' + color, '');
	const _hoverColor = hoverColor.reduce((prev, color) => prev + ' hover:' + color, '');
	const _focusColor = focusColor.reduce((prev, color) => prev + ' focus:' + color, '');
	return (
		rippleClass +
		' ' +
		_backgroundColor +
		' ' +
		_activeColor +
		' ' +
		_hoverColor +
		' ' +
		_focusColor
	);
};

export default Button;
