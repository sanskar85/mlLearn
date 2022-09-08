import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Collections from './screens/collections/Collections';
import CreateModel from './screens/createModel/CreateModel';
import Home from './screens/home/Home';
import ModelDetails from './screens/modelDetails/ModelDetails';
import MyCollections from './screens/my_collections/MyCollections';
import PrivateRoute from './components/PrivateRoute';
import Login from './screens/auth/Login';
import Auth from './screens/auth/Auth';
import Register from './screens/auth/Register';
import ForgotPassword from './screens/auth/ForgotPassword';
import ResetPassword from './screens/auth/ResetPassword';
import EditModel from './screens/editModel/EditModel';
import Predict from './screens/predict/Predict';

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='auth' element={<Auth />}>
				<Route path='login' element={<Login />} />
				<Route path='register' element={<Register />} />
				<Route path='forgot-password' element={<ForgotPassword />} />
				<Route path='reset-password' element={<ResetPassword />} />
			</Route>
			<Route path='collections'>
				<Route index element={<Collections />} />
				<Route path='create' element={<CreateModel />} />
				<Route
					path='my-collections'
					element={
						<PrivateRoute>
							<MyCollections />
						</PrivateRoute>
					}
				/>
				<Route path=':id' element={<ModelDetails />} />
				<Route
					path=':id/edit'
					element={
						<PrivateRoute>
							<EditModel />
						</PrivateRoute>
					}
				/>
				<Route path=':id/Predict' element={<Predict />} />
			</Route>
		</Routes>
	</BrowserRouter>
);

export default App;
