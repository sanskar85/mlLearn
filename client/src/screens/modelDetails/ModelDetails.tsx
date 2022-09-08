import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GEOMETRIC_LINES } from '../../assets/Images';
import DarkModeToggle from '../../components/DarkModeToggle';
import Box from '../../components/modules/Box';
import Image from '../../components/modules/Image';
import Screen from '../../components/modules/Screen';
import Text from '../../components/modules/Text';
import SpotBackground from '../../components/SpotBackground';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, StoreNames } from '../../store/store';
import { FetchModelDetails as fetchModelDetails } from '../../api/CollectionsHelper';
import { toast } from 'react-toastify';
import Lottie from 'lottie-react';
import { notFound, reset, setDetails, toggleView } from '../../store/reducers/ModelDetailsReducer';
import { LOADING_LOTTIE } from '../../assets/Lottie';
import MatrixChart from './components/MatrixChart';
import Button from '../../components/modules/Button';
import PerformanceMatrix from './components/PerformanceMatrix';
import HomeIcon from '../../components/HomeIcon';

const ModelDetails: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const state = useSelector((state: RootState) => state[StoreNames.MODEL_DETAILS]);
	const dispatch = useDispatch();

	const FetchModelDetails = React.useCallback(
		(id: string) => {
			fetchModelDetails(id)
				.then((res) => {
					dispatch(setDetails(res));
				})
				.catch((err) => {
					toast.error(err);
				});
		},
		[dispatch]
	);

	React.useEffect(() => {
		dispatch(reset());
		if (!id) {
			dispatch(notFound());
		} else {
			FetchModelDetails(id);
		}
	}, [dispatch, FetchModelDetails, id]);

	const predictHandler = () => {
		navigate('/collections/' + id + '/predict');
	};
	const editHandler = () => {
		navigate('/collections/' + id + '/edit');
	};

	return (
		<Screen background={<SpotBackground />} backgroundBlur='md'>
			<Image
				src={GEOMETRIC_LINES}
				className='h-screen w-full md:w-3/4 -z-10 object-cover absolute top-0 right-0 dark:invert invert-0 opacity-75'
			/>

			<Box
				className={`centered-axis-xy w-[200px]  flex-center mt-2  ${
					state.loading ? 'visible' : 'invisible'
				}`}
			>
				<Lottie animationData={LOADING_LOTTIE} loop={true} />;
			</Box>

			<Box
				className={`w-full h-full overflow-y-scroll  ${!state.loading ? 'visible' : 'invisible'}`}
			>
				<Box className=' mt-6 px-6 justify-center relative'>
					<Box horizontal className='justify-between items-center'>
						<Box horizontal>
							<HomeIcon className='relative !left-0 !top-1.5 mr-3' />
							<Box>
								<Text className='text-orange-500 font-bold text-3xl'>{state.name}</Text>
								<Text className='text-dark dark:text-light font-medium text-xl'>
									{state.author ? 'by ' + state.author : ''}
								</Text>
							</Box>
						</Box>

						{state.owner && (
							<Button
								onClick={editHandler}
								className='h-min bg-dark/70 dark:bg-light  hover:bg-orange-500  dark:hover:bg-orange-500  group cursor-pointer py-2 w-[150px] flex-center rounded-md transition-all'
							>
								<Text className='text-orange-500 group-hover:text-light tracking-wider font-bold'>
									Edit
								</Text>
							</Button>
						)}
					</Box>

					<Box className='overflow-y-scroll md:overflow-y-hidden relative flex-col md:flex-row-reverse my-3 p-3 w-full h-[80vh] rounded-md bg-light/90 dark:bg-dark/90 border border-dark/30 dark:border-light/30 '>
						{/* Toggle Right Pane View  */}
						<Button
							className='text-center md:absolute right-2 bottom-2 cursor-pointer shadow-md opacity-80 hover:opacity-100 '
							onClick={() => {
								dispatch(toggleView());
							}}
						>
							<Text className=' text-orange-500'>
								{state.detailsView ? 'Performance Matrix' : 'Model Details'}
							</Text>
						</Button>

						{/* Model Details */}
						<Box
							className={`w-full md:w-1/2  md:overflow-y-scroll ${!state.detailsView && 'hidden'}`}
						>
							<Text className='text-dark dark:text-light font-medium text-xl'>Summary</Text>
							<Text className=' text-dark/80 dark:text-light/80 ml-2'>{state.summary}</Text>
							<Text className='mt-6 text-dark dark:text-light font-medium text-xl'>
								Description
							</Text>
							<Text className=' text-dark/80 dark:text-light/80 ml-2'>{state.description}</Text>
						</Box>

						{/* Performance Matrix */}
						<Box
							className={`w-full md:w-1/2 mt-5 md:overflow-y-scroll ${
								state.detailsView && 'hidden'
							}`}
						>
							<PerformanceMatrix />
						</Box>

						<Box className='w-full md:w-1/2 flex-center md:overflow-y-scroll'>
							<MatrixChart />
							<Button
								className='w-1/3 flex-center py-2 rounded-md  '
								ripple
								rippleProps={{
									backgroundColor: ['bg-orange-500/70'],
									activeColor: ['bg-orange-500'],
									hoverColor: ['bg-orange-500/90'],
									focusColor: ['bg-orange-500/90'],
								}}
								onClick={predictHandler}
							>
								<Text className='text-white text-center font-bold  uppercase tracking-wider'>
									Predict
								</Text>
							</Button>
						</Box>
					</Box>
				</Box>
			</Box>

			<DarkModeToggle />
		</Screen>
	);
};

export default ModelDetails;
