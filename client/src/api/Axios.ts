import axios from 'axios';
import { toast } from 'react-toastify';
// import { setLoading } from '../store/reducers/Utils';
// import store from '../store/store';

const ServerURL = 'http://localhost:9000/';

const Axios = axios.create({
	baseURL: ServerURL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

// Axios.interceptors.request.use((request) => {
// 	// store.dispatch(setLoading(true));
// 	console.log(request);

// 	return request;
// });

Axios.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		// store.dispatch(setLoading(false));
		if (!error.response && error.code === 'ERR_INTERNET_DISCONNECTED') {
			toast.error('No internet connection. Please check your internet connection.');
			return Promise.reject(error);
		}
		const originalRequest = error.config;
		if (error && error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const res = await RefreshToken();
			if (res) return Axios(originalRequest);
			else {
				window.location.assign('/auth/login');
			}
		}

		if (error && error.response && error.response.status === 404) {
			window.location.assign('/not-found');
		}

		return Promise.reject(error);
	}
);

const RefreshToken = async () => {
	try {
		const { data } = await Axios.post(`/auth/is-logged`);
		return data.success;
	} catch (err) {
		return false;
	}
};

export default Axios;
export { ServerURL, RefreshToken };
