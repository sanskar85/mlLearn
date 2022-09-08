import { Router } from 'express';

import {
	ModelTrained as modelTrained,
	ErrorModelTraining as errorModelTraining,
} from '../controllers/Models';

const modelsRouter = Router();

modelsRouter.route('/trained').post(modelTrained);
modelsRouter.route('/error-training').post(errorModelTraining);

export default modelsRouter;
