import { Router } from 'express';

import {
	Collections as getCollections,
	CollectionsByUser as collectionsByUser,
	CreateCollection as createCollection,
	Details as details,
	EditDetails as editDetails,
	UpdateDetails as setDetails,
	Delete as deleteCollection,
	PredictionFields as predictionFields,
	PredictData as predictData,
} from '../controllers/Collections';
import UserPresent from '../middleware/UserPresent';
import VerifyUser from '../middleware/VerifyUser';

const collectionsRouter = Router();

collectionsRouter.route('/all').get(getCollections);
collectionsRouter.route('/my-collections').all(VerifyUser).get(collectionsByUser);
collectionsRouter.route('/create').all(VerifyUser).post(createCollection);
collectionsRouter.route('/details/:id').all(UserPresent).get(details);
collectionsRouter.route('/edit-details/:id').all(VerifyUser).get(editDetails);
collectionsRouter.route('/edit-details/:id').all(VerifyUser).post(setDetails);
collectionsRouter.route('/delete/:id').all(VerifyUser).post(deleteCollection);

collectionsRouter.route('/prediction-fields/:id').get(predictionFields);
collectionsRouter.route('/predict-data/:id').post(predictData);

export default collectionsRouter;
