import React, { FC } from 'react';

export interface BoxProps {
	children?: React.ReactNode;
	className?: string;
	horizontal?: boolean;
	// onClick?: () => void;
}

const Box: FC<BoxProps> = (props) => {
	const alignmentClass = props.horizontal ? 'flex-row' : 'flex-col';

	return (
		<div
			className={`flex ${alignmentClass} ${props.className} transition-all`}
			// onClick={props.onClick}
		>
			{props.children}
		</div>
	);
};

Box.defaultProps = {
	className: '',
	horizontal: false,
	// onClick: () => {},
};

export default Box;
