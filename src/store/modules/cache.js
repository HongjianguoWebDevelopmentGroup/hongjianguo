
let url_roeData = '/api/roe'
const state = {
	roeData: null,
}

const getters = {
	roeData: state=> state.roeData == null ? {} : state.roeData, 
}

const mutations = {
	setRoeData (state, d) {
		state.roeData = d;
	}
}

const actions = {

	refreshRoeData({commit, rootState, state}) {
		if(state.roeData != null) return;

		let url = rootState.status ? url_roeData.replace(/\/api/, '') : url_roeData;
		rootState.axios.get(url)
			.then(({data})=>{
				if(data.status) {
					commit('setRoeData', data.list);
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