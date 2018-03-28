let url = '/api/taskDefs';
const state = {
	data: null,
}

const getters = {
	taskDefsData: state=>state.data ? state.data : [],
}

const mutations = {
	setTaskDefs (state, d) {
		state.data = d;
	}
}

const actions = {
	refreshTaskDefs ({commit, rootState, state}, flag = false) {
		url = rootState.status ? url.replace(/\/api/, '') : url;
		if(!flag && state.data != null)	return;
		rootState.axios
			.get(url)
			.then(response=>{
				const d = response.data;
				if(d.status) {
					commit('setTaskDefs', d.list);
				}
			})
			.catch(error=>{console.log(error)});
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}