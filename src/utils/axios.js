import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:64405';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export default {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete
}