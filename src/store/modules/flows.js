let url = '/flows';
const state = {
	data: null,
}

const getters = {
	flowsData: state=>state.data ? state.data : [],
}

const mutations = {
	setFlows (state, d) {
		state.data = d;
	}
}

const actions = {
	refreshFlows ({commit, rootState, state}, flag = false) {		
		url = rootState.status ? url.replace(/\/api/, '') : url;
		if(!flag && state.data != null) return;
		rootState.axios
			.get(url)
			.then(response=>{
				const d = response.data;
				if(d.status) {
					commit('setFlows', d.flows);	
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