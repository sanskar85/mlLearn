import React, { FC } from 'react';

export interface TextProps {
	children: React.ReactNode;
	className?: string;
}

const Text: FC<TextProps> = (props) => {
	return <p className={`${props.className}`}>{props.children}</p>;
};

export default Text;
