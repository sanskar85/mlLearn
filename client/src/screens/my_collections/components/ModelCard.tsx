import React from 'react';
import Box from '../../../components/modules/Box';
import $ from 'jquery';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';
import Text from '../../../components/modules/Text';
import { COLORS } from '../../../utils/const';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { setSearchText } from '../../../store/reducers/CollectionsReducer';
import Button from '../../../components/modules/Button';
import Lottie from 'lottie-react';
import { MODEL_TRAINING_LOTTIE } from '../../../assets/Lottie';
import { toast } from 'react-toastify';
import { BiExpandAlt } from 'react-icons/bi';
interface ModelCardProps {
	id: string;
	name: string;
	author: string;
	models: Model[];
}

interface Model {
	name: string;
	accuracy: number;
	precision: number;
	recall: number;
	f1_score: number;
}

interface DataElement {
	label: string;
	[key: string]: number | string;
}

const ModelCard: React.FC<ModelCardProps> = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const wrapperRef = React.useRef<any>();
	const [dimension, setDimension] = React.useState({ width: 0, height: 0 });

	React.useEffect(() => {
		if (!wrapperRef.current) return;
		const handleResize = () => {
			const _dimension = {
				width: $(wrapperRef.current).width() || 0,
				height: $(wrapperRef.current).height() || 0,
			};
			setDimension(_dimension);
		};
		handleResize();

		$('.recharts-polygon').removeAttr('stroke');
		$('.angleAxis').removeAttr('stroke');
		$('.recharts-polar-grid-angle line').attr('stroke', '#ffffff90');
		$('.recharts-polar-grid-concentric path').attr('stroke', '#ffffff40');

		$(window).on('resize', handleResize);

		return () => {
			$(window).off('resize', handleResize);
		};
	}, [wrapperRef]);

	const { datasets, dataKey } = React.useMemo(() => {
		const dataKey: string[] = [];

		const array: DataElement[] = [
			{ label: 'Accuracy' },
			{ label: 'Precision' },
			{ label: 'Recall' },
			{ label: 'F1 Score' },
		];

		props.models.forEach((model) => {
			array[0][model.name] = model.accuracy;
			array[1][model.name] = model.precision;
			array[2][model.name] = model.recall;
			array[3][model.name] = model.f1_score;
			dataKey.push(model.name);
		});
		return { datasets: array, dataKey };
	}, [props.models]);

	const openCardHandler = () => {
		if (props.models.length === 0) {
			return toast.info('Model training is in progress. Please wait till completion.');
		}
		navigate(`/collections/${props.id}`);
	};
	const searchAuthor = () => {
		dispatch(setSearchText('author@' + props.author));
	};

	return (
		<Box className='bg-dark/50 dark:bg-light/50 border border-dark dark:border-light backdrop-blur rounded-md select-none opacity-90 hover:opacity-100 transition-all'>
			<div ref={wrapperRef} className='w-full h-[200px] z-[1]'>
				{props.models.length === 0 ? (
					<Box className='w-ful h-full relative bg-[#eaedf1]'>
						<Box className='h-[200px] centered-axis-xy'>
							<Lottie animationData={MODEL_TRAINING_LOTTIE} loop={true} />
							<Text className='absolute bottom-2 w-full text-center text-blue-600 font-medium'>
								Under Training
							</Text>
						</Box>
					</Box>
				) : (
					<RadarChart
						width={dimension.width}
						height={dimension.height}
						outerRadius='85%'
						data={datasets}
					>
						<PolarGrid />
						<PolarAngleAxis dataKey='label' fontSize='0.625rem' stroke='#FFFFFF' />
						<PolarRadiusAxis axisLine={false} domain={['auto', 'auto']} tick={false} />
						{dataKey.map((name, index) => (
							<Radar
								key={index}
								name={name}
								dataKey={name}
								stroke={COLORS[`_${index + 1}`]}
								fill={COLORS[`_${index + 1}`]}
								fillOpacity={0.4}
							/>
						))}
						<Tooltip position={isMobile ? { x: 50, y: 200 } : { x: 300, y: 50 }} />
					</RadarChart>
				)}
			</div>
			<Box className='bg-dark/50 py-2 dark:bg-light/50 border-t border-light/30 dark:border-dark/30 pl-2 relative select-text'>
				<Text className=' font-medium text-light dark:text-dark line-clamp-1'>{props.name}</Text>
				<Text className='text-sm text-left text-light dark:text-dark line-clamp-1'>
					by {props.author}
				</Text>
				<Button
					onClick={openCardHandler}
					className=' bg-dark dark:bg-light cursor-pointer rounded-full p-2 absolute right-2.5 centered-axis-y select-none'
				>
					<BiExpandAlt className='w-4 h-4 invert dark:invert-0' />
				</Button>
			</Box>
		</Box>
	);
};

export default ModelCard;
