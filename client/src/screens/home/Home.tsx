import React from 'react';
import { GEOMETRIC_LINES } from '../../assets/Images';
import Box from '../../components/modules/Box';
import Image from '../../components/modules/Image';
import Screen from '../../components/modules/Screen';
import Text from '../../components/modules/Text';
import SpotBackground from '../../components/SpotBackground';
import Button from '../../components/modules/Button';
import { Link } from 'react-router-dom';
import DarkModeToggle from '../../components/DarkModeToggle';
const Home = () => {
	return (
		<>
			<Screen background={<SpotBackground />} backgroundBlur='md'>
				<Image
					src={GEOMETRIC_LINES}
					className='h-screen w-full md:w-3/4 -z-10 object-cover absolute top-0 right-0 dark:invert invert-0 opacity-75'
				/>
				<Box className='h-full  flex-center  w-full md:w-2/5 text-dark dark:text-light'>
					<Box className='flex-center py-6 w-max bg-light/70 dark:bg-dark/70  rounded-lg md:bg-transparent md:dark:bg-transparent'>
						<Text className=' font-bold text-center md:text-left text-3xl md:text-7xl '>
							mlLearn.in
						</Text>
						<Text className='w-full mx-auto md:mx-0 font-medium text-lg text-center md:text-left'>
							Addressing world problems through <br /> Machine Learning.
						</Text>

						<Box className='w-full items-center md:items-start'>
							<Link to='/collections'>
								<Button className='group px-4 py-2 mt-3 rounded-full w-max bg-dark dark:bg-light '>
									<Text className='group-hover:text-orange-500 text-light dark:text-dark font-semibold'>
										Get Started
									</Text>
								</Button>
							</Link>
						</Box>
					</Box>
				</Box>

				<DarkModeToggle />
			</Screen>
		</>
	);
};

export default Home;
