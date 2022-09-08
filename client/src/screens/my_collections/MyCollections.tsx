import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GEOMETRIC_LINES } from '../../assets/Images';
import DarkModeToggle from '../../components/DarkModeToggle';
import Box from '../../components/modules/Box';
import Image from '../../components/modules/Image';
import Screen from '../../components/modules/Screen';
import Text from '../../components/modules/Text';
import SpotBackground from '../../components/SpotBackground';
import ModelCard from './components/ModelCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, StoreNames } from '../../store/store';
import { FetchMyCollections as fetchCollections } from '../../api/CollectionsHelper';
import { addToCollections, clearCollections } from '../../store/reducers/CollectionsReducer';
import { toast } from 'react-toastify';
import usePagination from '../../hooks/Pagination';
import Lottie from 'lottie-react';
import { LOADING_LOTTIE } from '../../assets/Lottie';
import HomeIcon from '../../components/HomeIcon';
import Button from '../../components/modules/Button';

const MyCollections: React.FC = () => {
	const navigate = useNavigate();

	const { collections, loading } = useSelector((state: RootState) => state[StoreNames.COLLECTIONS]);
	const dispatch = useDispatch();

	const loadingElementRef = React.useRef<HTMLDivElement | null>(null);

	usePagination(loadingElementRef, () => {
		FetchCollections();
	});

	const FetchCollections = React.useCallback(() => {
		fetchCollections()
			.then((res) => {
				dispatch(addToCollections(res));
			})
			.catch((err) => {
				toast.error(err);
			});
	}, [dispatch]);

	React.useEffect(() => {
		dispatch(clearCollections());

		FetchCollections();
	}, [FetchCollections, dispatch]);

	const handleCreateCollection = () => {
		navigate('/collections/create');
	};

	return (
		<Screen background={<SpotBackground />} backgroundBlur='md'>
			<Image
				src={GEOMETRIC_LINES}
				className='h-screen w-full md:w-3/4 -z-10 object-cover absolute top-0 right-0 dark:invert invert-0 opacity-75'
			/>

			<Box className='w-full h-full overflow-y-scroll'>
				<Box className=' md:flex-row  mt-6 px-6 justify-between items-center'>
					<Box horizontal>
						<HomeIcon className='relative !left-0 !top-1.5 mr-3' />
						<Text className='text-orange-500 font-bold text-3xl'>My Collections</Text>
					</Box>

					<Button
						onClick={handleCreateCollection}
						className='bg-dark/70 dark:bg-light  hover:bg-orange-500  dark:hover:bg-orange-500 mt-3 md:mt-0 group cursor-pointer py-2 w-[200px] flex-center rounded-md transition-all'
					>
						<Text className='text-orange-500 group-hover:text-light tracking-wider font-bold'>
							Create
						</Text>
					</Button>
				</Box>

				<Box>
					<Box className='w-5/6  grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto  pt-[30px] md:overflow-y-scroll'>
						{collections.map((item: ICollection, index: number) => (
							<ModelCard key={index} {...item} />
						))}
					</Box>
					<Box className={`w-full flex-center mt-2 ${loading ? 'visible' : 'invisible'}`}>
						<div ref={loadingElementRef} className='w-[200px]'>
							<Lottie animationData={LOADING_LOTTIE} loop={true} />
						</div>
					</Box>
				</Box>
			</Box>

			<DarkModeToggle />
		</Screen>
	);
};

export default MyCollections;
