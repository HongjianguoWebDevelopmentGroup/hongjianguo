let url = '/api/flownodes';
const map = new Map([
	['patents',1],
	['trademarks',2],
	['copyrights',3],
	]);
const state = {
	data: undefined,
}

const getters = {
	flownodeData: state=>state.data,
}

const mutations = {
	setFlownodes (state, d) {
		state.data = d;
	}
}

const actions = {
	refreshFlownodes ({commit, rootState, state},type) {
		let category = ''
		if(!type){
			category = 1;
		}else {
			category = map.get(type);
		}		
		url = rootState.status ? url.replace(/\/api/, '') : url;
		rootState.axios
			.get(`${url}?category=${category}`)
			.then(response=>{
				const d = response.data;
				if(d.status) {
					commit('setFlownodes', d.flownodes);	
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