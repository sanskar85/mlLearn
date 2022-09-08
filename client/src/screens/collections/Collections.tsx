import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GEOMETRIC_LINES, SEARCH } from '../../assets/Images';
import DarkModeToggle from '../../components/DarkModeToggle';
import Box from '../../components/modules/Box';
import Image from '../../components/modules/Image';
import Input from '../../components/modules/Input';
import Screen from '../../components/modules/Screen';
import Text from '../../components/modules/Text';
import SpotBackground from '../../components/SpotBackground';
import ModelCard from './components/ModelCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, StoreNames } from '../../store/store';
import { FetchCollections as fetchCollections } from '../../api/CollectionsHelper';
import {
	addToCollections,
	clearCollections,
	setSearchText,
} from '../../store/reducers/CollectionsReducer';
import { toast } from 'react-toastify';
import usePagination from '../../hooks/Pagination';
import Lottie from 'lottie-react';
import { LOADING_LOTTIE } from '../../assets/Lottie';
import { useDebounce } from 'use-debounce';
import HomeIcon from '../../components/HomeIcon';
import Button from '../../components/modules/Button';

const Collections: React.FC = () => {
	const navigate = useNavigate();

	const { collections, loading, hasMore, search_text } = useSelector(
		(state: RootState) => state[StoreNames.COLLECTIONS]
	);

	const dispatch = useDispatch();

	const loadingElementRef = React.useRef<HTMLDivElement | null>(null);

	usePagination(loadingElementRef, () => {
		if (!hasMore) return;
		FetchCollections(searchText);
	});

	const [searchText] = useDebounce(search_text, 1500);

	const FetchCollections = React.useCallback(
		(searchText: string) => {
			fetchCollections(searchText)
				.then((res) => {
					dispatch(addToCollections(res));
				})
				.catch((err) => {
					toast.error(err);
				});
		},
		[dispatch]
	);

	React.useEffect(() => {
		dispatch(clearCollections());

		FetchCollections(searchText);
	}, [FetchCollections, searchText, dispatch]);

	const openMyCollections = () => {
		navigate('/collections/my-collections');
	};

	return (
		<Screen background={<SpotBackground />} backgroundBlur='md'>
			<Image
				src={GEOMETRIC_LINES}
				className='h-screen w-full md:w-3/4 -z-10 object-cover absolute top-0 right-0 dark:invert invert-0 opacity-75'
			/>

			<Box className='w-full h-full overflow-y-scroll'>
				<Box className=' md:flex-row  mt-6 px-6 justify-between items-center'>
					<Text className='text-orange-500 font-bold text-3xl'>Collections</Text>

					<Box
						horizontal
						className='bg-dark/20 focus-within:bg-dark/50 focus-within:dark:bg-light/30 w-full md:w-1/3  px-2 py-1.5  mt-3 md:mt-0   rounded-md border border-dark/60 dark:border-light/60 backdrop-blur-[1px] items-center'
					>
						<Image src={SEARCH} className='w-5 h-5 ' />
						<Input
							type='search'
							className='ml-2 w-full  text-light   placeholder:text-light placeholder:font-medium '
							placeholder='Search'
							value={search_text}
							onChange={(text) => dispatch(setSearchText(text))}
						/>
					</Box>
					<Button
						onClick={openMyCollections}
						className='bg-dark/70 dark:bg-light  hover:bg-orange-500  dark:hover:bg-orange-500 mt-3 md:mt-0 group cursor-pointer py-2 w-[200px] flex-center rounded-md transition-all'
					>
						<Text className='text-orange-500 group-hover:text-light tracking-wider font-bold'>
							My Contributions
						</Text>
					</Button>
				</Box>

				<Box>
					<Box className='w-5/6  grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto  mt-[20px] pt-[30px] md:overflow-y-scroll'>
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

export default Collections;
