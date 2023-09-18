import { createStore } from 'vuex'
import axios from "../utils/axios";

export default createStore({
	state: {
		userName: null,
		adminName: null
	},
	getters: {
	},
	mutations: {
		setUsername(state, userName) {
			state.userName = userName;
		},
		setAdminName(state, adminName) {
			state.adminName = adminName;
		},
	},
	actions: {
		getUserName: function (context) {
			axios.weblUrl.get('/api/Identities/User/GetUser').then(function (result) {
				context.commit('setUsername', result.data.Value)
			}).catch(function (result) {
				console.log(result);
			})
		},
		getAdminName: function (context) {
			axios.panelUrl.get('/api/Identities/User/GetUser').then(function (result) {
				context.commit('setAdminName', result.data.Value)
			}).catch(function (result) {
				console.log(result);
			})
		}
	},
	modules: {
	}
})
