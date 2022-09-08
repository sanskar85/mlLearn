import Axios from './Axios';
import axios from 'axios';
import store, { StoreNames } from '../store/store';
import { setLoading as collectionsLoading } from '../store/reducers/CollectionsReducer';
import { setLoading as modelDetailsLoading } from '../store/reducers/ModelDetailsReducer';

export const FetchCollections = (search: string) => {
	const { skip, limit, hasMore, loading } = store.getState()[StoreNames.COLLECTIONS];

	if (loading) {
		return Promise.reject();
	} else if (!hasMore) {
		return Promise.reject();
	}

	store.dispatch(collectionsLoading(true));
	return new Promise<void>((resolve, reject) => {
		Axios.get(`/collections/all?skip=${skip}&limit=${limit}&search=${search}`)
			.then(({ data }) => {
				store.dispatch(collectionsLoading(false));
				resolve(data);
			})
			.catch((e: Error) => {
				store.dispatch(collectionsLoading(false));
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					}
				} else {
					reject('Unable to verify your credentials. Please try again later.');
				}
			});
	});
};

export const FetchMyCollections = (search: string = '') => {
	const { skip, limit, hasMore, loading } = store.getState()[StoreNames.COLLECTIONS];

	if (loading) {
		return Promise.reject();
	} else if (!hasMore) {
		return Promise.reject();
	}

	store.dispatch(collectionsLoading(true));
	return new Promise<void>((resolve, reject) => {
		Axios.get(`/collections/my-collections?skip=${skip}&limit=${limit}&search=${search}`)
			.then(({ data }) => {
				store.dispatch(collectionsLoading(false));
				resolve(data);
			})
			.catch((e: Error) => {
				store.dispatch(collectionsLoading(false));
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					}
				} else {
					reject('Unable to verify your credentials. Please try again later.');
				}
			});
	});
};

export const FetchModelDetails = (id: string) => {
	if (!id) {
		return Promise.reject('Invalid Model ID');
	}
	store.dispatch(modelDetailsLoading(true));
	return new Promise<void>((resolve, reject) => {
		Axios.get(`/collections/details/${id}`)
			.then(({ data }) => {
				store.dispatch(modelDetailsLoading(false));
				resolve(data);
			})
			.catch((e: Error) => {
				store.dispatch(modelDetailsLoading(false));
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 404) {
						reject('Model not found.');
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					}
				} else {
					reject('Unable to verify your credentials. Please try again later.');
				}
			});
	});
};

export const FetchModelEditDetails = (id: string) => {
	if (!id) {
		return Promise.reject('Invalid Model ID');
	}
	store.dispatch(modelDetailsLoading(true));
	return new Promise<void>((resolve, reject) => {
		Axios.get(`/collections/edit-details/${id}`)
			.then(({ data }) => {
				store.dispatch(modelDetailsLoading(false));
				resolve(data);
			})
			.catch((e: Error) => {
				store.dispatch(modelDetailsLoading(false));
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 404) {
						reject('Model not found.');
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					}
				} else {
					reject('Unable to verify your credentials. Please try again later.');
				}
			});
	});
};

export const CreateModel = ({
	name,
	summary,
	description,
	file,
	labels,
	results_mapping,
}: {
	name: string;
	summary: string;
	description: string;
	file: File | null;
	labels: {
		[key: string]: string;
	};
	results_mapping: {
		[key: string]: string;
	};
}) => {
	if (!name || !summary || !description || !file) {
		return Promise.reject('Invalid Model Details');
	}

	const formData = new FormData();
	formData.append('name', name);
	formData.append('summary', summary);
	formData.append('description', description);
	formData.append('file', file);
	formData.append('labels', JSON.stringify(labels));
	formData.append('results_mapping', JSON.stringify(results_mapping));

	return new Promise<void>((resolve, reject) => {
		Axios.post(`/collections/create`, formData)
			.then(() => {
				resolve();
			})
			.catch((e: Error) => {
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 400) {
						reject(e.response.data);
					} else if (e.response.status === 401) {
						reject('Invalid credentials.');
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					}
				} else {
					reject('Unable to verify your credentials. Please try again later.');
				}
			});
	});
};

export const UpdateModel = ({
	id,
	name,
	summary,
	description,
	labels,
}: {
	id: string;
	name: string;
	summary: string;
	description: string;
	labels: {
		[key: string]: string;
	};
}) => {
	if (!id || !name || !summary || !description) {
		return Promise.reject('Invalid Model Details');
	}
	return new Promise<void>((resolve, reject) => {
		Axios.post(`/collections/edit-details/${id}`, {
			name,
			summary,
			description,
			labels: JSON.stringify(labels),
		})
			.then(() => {
				resolve();
			})
			.catch((e: Error) => {
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 400) {
						reject(e.response.data);
					} else if (e.response.status === 401) {
						reject('Invalid credentials.');
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					}
				} else {
					reject('Unable to verify your credentials. Please try again later.');
				}
			});
	});
};

export const DeleteModel = (id: string) => {
	if (!id) {
		return Promise.reject('Invalid Model ID');
	}
	return new Promise<void>((resolve, reject) => {
		Axios.post(`/collections/delete/${id}`)
			.then(() => {
				resolve();
			})
			.catch((e: Error) => {
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 400) {
						reject(e.response.data);
					} else if (e.response.status === 401) {
						reject('Invalid credentials.');
					} else if (e.response.status === 500) {
						reject('Internal server error. Please try again later.');
					}
				} else {
					reject('Unable to verify your credentials. Please try again later.');
				}
			});
	});
};

export const GetPredictionFields = (id: string) => {
	if (!id) {
		return Promise.reject('Invalid Model ID');
	}

	return new Promise<{ [key: string]: string }>((resolve, reject) => {
		Axios.get(`/collections/prediction-fields/${id}`)
			.then(({ data }) => resolve(data))
			.catch((e: Error) => {
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 400) {
						reject(e.response.data);
					} else {
						reject('Internal server error. Please try again later.');
					}
				} else {
					reject('Unable to verify your credentials. Please try again later.');
				}
			});
	});
};

export const PredictData = (id: string, values: string[]) => {
	if (!id) {
		return Promise.reject('Invalid Model ID');
	}

	return new Promise<{ [key: string]: string }>((resolve, reject) => {
		Axios.post(`/collections/predict-data/${id}`, {
			data: values,
		})
			.then(({ data }) => resolve(data))
			.catch((e: Error) => {
				if (axios.isAxiosError(e) && e.response) {
					if (e.response.status === 0) {
						reject('Unable to connect to server. Please try again later.');
					} else if (e.response.status === 400) {
						reject(e.response.data);
					} else {
						reject('Internal server error. Please try again later.');
					}
				} else {
					reject('Unable to verify your credentials. Please try again later.');
				}
			});
	});
};
