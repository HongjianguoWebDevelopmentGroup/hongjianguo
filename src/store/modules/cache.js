let url_feecodes = '/api/feeCodes';
const state = {
	feeCodes: null,
}

const getters = {
	feeCodes: state=>state.feeCodes ? state.feeCodes : [],
}

const mutations = {
	setFeeCodes (state, d) {
		state.feeCodes = d;
	}
}

const actions = {
	refreshFeeCodes ({commit, rootState, state}) {
		if(state.feeCodes == null) {
			let url = rootState.status ? url_feecodes.replace(/\/api/, '') : url_feecodes;
			rootState
				.axios
				.get(url)
				.then(response=>{
					commit('setFeeCodes', response.data.codes);
				});
		}
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}