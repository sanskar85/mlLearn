import React from 'react';
import { GEOMETRIC_LINES } from '../../assets/Images';
import DarkModeToggle from '../../components/DarkModeToggle';
import HomeIcon from '../../components/HomeIcon';
import Box from '../../components/modules/Box';
import Image from '../../components/modules/Image';
import Screen from '../../components/modules/Screen';
import SpotBackground from '../../components/SpotBackground';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, StoreNames } from '../../store/store';
import {
	CREATE_STAGE,
	setStage,
	reset,
	setID,
	setDetails,
} from '../../store/reducers/CreateModelReducer';
import ModelDetails from './components/ModelDetails';
import ManipulateDataset from './components/ManipulateDataset';
import Text from '../../components/modules/Text';
import Finalize from './components/Finalize';
import { useNavigate, useParams } from 'react-router-dom';
import { FetchModelEditDetails as fetchModelDetails } from '../../api/CollectionsHelper';
import { BOUNCE_LOADING_LOTTIE } from '../../assets/Lottie';
import Lottie from 'lottie-react';

const EditModel: React.FC = () => {
	const { stage } = useSelector((state: RootState) => state[StoreNames.CREATE_MODEL]);
	const [loading, setLoading] = React.useState(true);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();

	React.useEffect(() => {
		if (!id) return navigate('/not-found');
		dispatch(setID(id));
		fetchModelDetails(id)
			.then((res) => {
				dispatch(setDetails(res));
				setLoading(false);
			})
			.catch(() => navigate('/not-found'));
	}, [id, navigate, dispatch]);

	React.useEffect(() => {
		dispatch(reset());
		dispatch(setStage(CREATE_STAGE.DETAILS));
	}, [dispatch]);

	if (loading) {
		return (
			<Screen className='flex-center  bg-dark dark:bg-light '>
				<Box className='w-[150px]'>
					<Lottie animationData={BOUNCE_LOADING_LOTTIE} loop={true} />;
				</Box>
			</Screen>
		);
	}

	return (
		<Screen background={<SpotBackground />} backgroundBlur='md'>
			<HomeIcon />
			<Box className='top-3 left-12 absolute'>
				<Text className='font-bold text-orange-600 text-2xl'>
					{stage === CREATE_STAGE.DETAILS && 'Model Details'}
					{stage === CREATE_STAGE.MANIPULATE_DATASET && 'Dataset Details'}
				</Text>
			</Box>
			<Image
				src={GEOMETRIC_LINES}
				className='h-screen w-full md:w-3/4 -z-10 object-cover absolute top-0 right-0 dark:invert invert-0 opacity-75'
			/>

			<Box className='h-full rounded-md mx-6 my-12 md:m-12 p-2 bg-light/80 dark:bg-dark/80 border border-dark/50 dark:border-light/50 overflow-y-scroll'>
				{stage === CREATE_STAGE.DETAILS && <ModelDetails />}
				{stage === CREATE_STAGE.MANIPULATE_DATASET && <ManipulateDataset />}
				{stage === CREATE_STAGE.FINALIZE && <Finalize />}
			</Box>

			<DarkModeToggle />
		</Screen>
	);
};

export default EditModel;
