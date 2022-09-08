import React from 'react';

import { useSelector } from 'react-redux';
import { RootState, StoreNames } from '../../../store/store';
import $ from 'jquery';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';
import { COLORS } from '../../../utils/const';
import { isMobile } from 'react-device-detect';
import useDarkMode from '../../../hooks/DarkMode';

interface DataElement {
	label: string;
	[key: string]: number | string;
}

const MatrixChart: React.FC = () => {
	const { isDarkMode } = useDarkMode();
	const wrapperRef = React.useRef<any>();
	const [dimension, setDimension] = React.useState({ width: 0, height: 0 });

	const { models } = useSelector((state: RootState) => state[StoreNames.MODEL_DETAILS]);

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

		models.forEach((model) => {
			array[0][model.name] = model.accuracy;
			array[1][model.name] = model.precision;
			array[2][model.name] = model.recall;
			array[3][model.name] = model.f1_score;
			dataKey.push(model.name);
		});
		return { datasets: array, dataKey };
	}, [models]);

	return (
		<div ref={wrapperRef} className='w-full aspect-square md:aspect-video z-[1]'>
			<RadarChart
				width={dimension.width}
				height={dimension.height}
				outerRadius={isMobile ? '70%' : '90%'}
				data={datasets}
			>
				<PolarGrid />
				<PolarAngleAxis
					dataKey='label'
					fontSize={isMobile ? '0.625rem' : '1rem'}
					stroke={isDarkMode ? '#FFFFFF' : '#000000'}
				/>
				<PolarRadiusAxis axisLine={false} domain={['auto', 'auto']} />
				{dataKey.map((name, index) => (
					<Radar
						key={index}
						name={name}
						dataKey={name}
						stroke={COLORS[`_${index + 1}`]}
						fill={COLORS[`_${index + 1}`]}
						fillOpacity={0.2}
					/>
				))}
			</RadarChart>
		</div>
	);
};

export default MatrixChart;
