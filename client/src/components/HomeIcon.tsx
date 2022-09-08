import React from 'react';
import { Link } from 'react-router-dom';
import { HOME } from '../assets/Images';
import Image from './modules/Image';

interface HomeIconProps {
	className?: string;
}

const HomeIcon: React.FC<HomeIconProps> = ({ className }) => {
	return (
		<Link to='/collections' className={`absolute left-4 top-4 ${className}`}>
			<Image src={HOME} className='h-6 w-6 ' />
		</Link>
	);
};

export default HomeIcon;
