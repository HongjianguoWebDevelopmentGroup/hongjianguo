let url_feeCodes = '/api/feeCodes';
let url_roeData = '/api/roe'
const state = {
	feeCodes: null,
	roeData: null,
}

const getters = {
	feeCodesOptions (state) {
		if(!state.feeCodes) return [];
		return state.feeCodes.map(_=>({amount: _.amount - 0, id: _.id - 0, name: _.name}));
	},
	roeData: state=> state.roeData == null ? {} : state.roeData, 
}

const mutations = {
	setFeeCodes (state, d) {
		state.feeCodes = d;
	},
	setRoeData (state, d) {
		state.roeData = d;
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
	},
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