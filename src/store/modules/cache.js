let url_feeCodes = '/api/feeCodes';
const state = {
	feeCodes: null,
}

const getters = {
	feeCodesOptions (state) {
		if(!state.feeCodes) return [];
		return state.feeCodes.map(_=>({amount: _.amount - 0, id: _.id - 0, name: _.name}));
	}
}

const mutations = {
	setFeeCodes (state, d) {
		state.feeCodes = d;
	}
}

const actions = {
	refreshFeeCodes ({commit, rootState, state}) {
		if(state.feeCodes != null) return;

		let url = rootState.status ? url_feeCodes.replace(/\/api/, '') : url_feeCodes; 
		commit('setFeeCodes', []);
		rootState.axios.get(url)
			.then(({data})=>{
				if(data.status) {
					commit('setFeeCodes', data.codes);
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