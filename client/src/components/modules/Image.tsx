import React, { FC } from 'react';

export interface ImageProps {
	src: string;
	alt?: string;
	className?: string;
	resizeMode?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const Image: FC<ImageProps> = ({ src, alt, className, resizeMode }) => {
	return <img src={src} className={`${className} object-${resizeMode}`} alt={alt} />;
};

Image.defaultProps = {
	src: '',
	alt: '',
	className: '',
	resizeMode: 'contain',
};

export default Image;
