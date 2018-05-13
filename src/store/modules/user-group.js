let url = '/groups';
const state = {
	data: null,
	loading: false,
}

const getters = {
	groupOptions: state => state.data ? state.data : [],
	groupMap: state => {
		const map = new Map();

		if(state.data) {			
			for(let d of state.data) {
				map.set(d.id, d);
			}
		}

		return map;
	},
	groupLoading: state => state.loading,
}

const mutations = {
	setGroup (state, d) {
		state.data = d;
	},
	setGroupLoading (state, bool) {
		state.loading = bool;
	}
}

const actions = {
	refreshGroup ({state, commit, rootState, getters}, flag=false) {
		if(!flag && state.data !== null) return false;
		const promise = rootState.axios.get(url);
		commit('setGroupLoading', true);
		promise.then(response=>{
			commit('setGroupLoading', false);
			const d = response.data;
			if(d.status){
				commit('setGroup', d.groups);
			}else {
				console.log(d);
				// alert('请求用户组数据失败');
			}
		})
		.catch(error => {
			commit('setGroupLoading', false);
			console.log(error);
		});
		return promise;
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}