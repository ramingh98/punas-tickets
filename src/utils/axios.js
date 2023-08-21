import axios from 'axios';

const panelUrl = axios.create({ baseURL: 'https://crm.punas.ir/', headers: { common: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } } })
const weblUrl = axios.create({ baseURL: 'http://localhost:64405', headers: { common: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } } })

export default {
	panelUrl,
	weblUrl,
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete
}