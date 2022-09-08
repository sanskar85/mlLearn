import React from 'react';
import { Navigate } from 'react-router-dom';
import { BOUNCE_LOADING_LOTTIE } from '../assets/Lottie';
import Screen from './modules/Screen';
import Lottie from 'lottie-react';
import Box from './modules/Box';
import { RefreshToken } from '../api/Axios';

interface PrivateRouteProps {
	children: React.ReactElement;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		(async () => {
			const res = await RefreshToken();

			setIsAuthenticated(res);
			setIsLoading(false);
		})();
	}, []);

	if (isLoading) {
		return (
			<Screen className='flex-center  bg-dark dark:bg-light '>
				<Box className='w-[150px]'>
					<Lottie animationData={BOUNCE_LOADING_LOTTIE} loop={true} />;
				</Box>
			</Screen>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to='/auth/login' replace />;
	}

	return <> {children} </>;
};

export default PrivateRoute;
