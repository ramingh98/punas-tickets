import axios from 'axios';

const panelUrl = axios.create({ baseURL: 'https://panelticket.punas.ir', headers: { common: { 'X-Requested-With': 'XMLHttpRequest', 'Authorization': `Bearer ${localStorage.getItem('token')}` } } })
const weblUrl = axios.create({ baseURL: 'https://punas.ir', headers: { common: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } } })

export default {
	panelUrl,
	weblUrl,
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete
}