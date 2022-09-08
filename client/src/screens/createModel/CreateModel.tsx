import React from 'react';
import { GEOMETRIC_LINES } from '../../assets/Images';
import DarkModeToggle from '../../components/DarkModeToggle';
import HomeIcon from '../../components/HomeIcon';
import Box from '../../components/modules/Box';
import Image from '../../components/modules/Image';
import Screen from '../../components/modules/Screen';
import SpotBackground from '../../components/SpotBackground';
import UploadFile from './components/UploadFile';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, StoreNames } from '../../store/store';
import { CREATE_STAGE, reset } from '../../store/reducers/CreateModelReducer';
import ModelDetails from './components/ModelDetails';
import ManipulateDataset from './components/ManipulateDataset';
import Text from '../../components/modules/Text';
import Finalize from './components/Finalize';

const CreateModel: React.FC = () => {
	const { stage } = useSelector((state: RootState) => state[StoreNames.CREATE_MODEL]);

	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(reset());
	}, [dispatch]);

	return (
		<Screen background={<SpotBackground />} backgroundBlur='md'>
			<HomeIcon />
			<Box className='top-3 left-12 absolute'>
				<Text className='font-bold text-orange-600 text-2xl'>
					{stage === CREATE_STAGE.UPLOAD_CSV && 'Upload CSV'}
					{stage === CREATE_STAGE.DETAILS && 'Model Details'}
					{stage === CREATE_STAGE.MANIPULATE_DATASET && 'Dataset Details'}
				</Text>
			</Box>
			<Image
				src={GEOMETRIC_LINES}
				className='h-screen w-full md:w-3/4 -z-10 object-cover absolute top-0 right-0 dark:invert invert-0 opacity-75'
			/>

			<Box className='h-full rounded-md mx-6 my-12 md:m-12 p-2 bg-light/80 dark:bg-dark/80 border border-dark/50 dark:border-light/50 overflow-y-scroll'>
				{stage === CREATE_STAGE.UPLOAD_CSV && <UploadFile />}
				{stage === CREATE_STAGE.DETAILS && <ModelDetails />}
				{stage === CREATE_STAGE.MANIPULATE_DATASET && <ManipulateDataset />}
				{stage === CREATE_STAGE.FINALIZE && <Finalize />}
			</Box>

			<DarkModeToggle />
		</Screen>
	);
};

export default CreateModel;
