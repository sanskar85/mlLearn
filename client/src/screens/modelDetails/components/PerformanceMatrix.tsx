import React from 'react';

import { useSelector } from 'react-redux';
import { RootState, StoreNames } from '../../../store/store';
import Box from '../../../components/modules/Box';

const PerformanceMatrix: React.FC = () => {
	const { models } = useSelector((state: RootState) => state[StoreNames.MODEL_DETAILS]);

	return (
		<>
			<Box
				horizontal
				className=' h-[50px] text-dark dark:text-light rounded-t-md bg-dark/20 dark:bg-light/20 font-medium text-lg'
			>
				<Box className='w-1/5 border border-dark/70 dark:border-light/70 rounded-tl-lg flex-center'>
					Classifier
				</Box>
				<Box className='w-1/5 border border-dark/70 dark:border-light/70 flex-center'>Accuracy</Box>
				<Box className='w-1/5 border border-dark/70 dark:border-light/70 flex-center'>
					Precision
				</Box>
				<Box className='w-1/5 border border-dark/70 dark:border-light/70 flex-center'>
					Recall Score
				</Box>
				<Box className='w-1/5 border border-dark/70 dark:border-light/70 rounded-tr-lg flex-center'>
					F1 Score
				</Box>
			</Box>
			{models.map((model, index) => (
				<Box key={index} horizontal className='text-center text-dark dark:text-light '>
					<Box className='w-1/5 border border-dark/70 dark:border-light/70 flex-center'>
						{model.name}
					</Box>
					<Box className='w-1/5 border border-dark/70 dark:border-light/70 flex-center'>
						{model.accuracy}
					</Box>
					<Box className='w-1/5 border border-dark/70 dark:border-light/70 flex-center'>
						{model.precision}
					</Box>
					<Box className='w-1/5 border border-dark/70 dark:border-light/70 flex-center'>
						{model.recall}
					</Box>
					<Box className='w-1/5 border border-dark/70 dark:border-light/70 flex-center'>
						{model.f1_score}
					</Box>
				</Box>
			))}
		</>
	);
};

export default PerformanceMatrix;
