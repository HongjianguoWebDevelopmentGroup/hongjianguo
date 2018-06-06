let url = '/api/abbr';
const state = {
  data: undefined,
}

const getters = {
	abbrOptions: state=>{
		let d = state.data;
		if(d) {
			d = d.map( d=>{return {id: d.abbr, name: d.abbr} } );
		}
		return d;
	},
}

const mutations = {
	setAbbr (state, abbrs) {
		state.data = abbrs;
	}
}

const actions = {
	refreshAbbr ({commit, rootState}) {
		url = rootState.status ? url.replace(/\/api/, '') : url;
		rootState.axios
		.get(url)
		.then(response=>{
			const d = response.data;
			if(d.status){
				commit('setAbbr', d.data);
			}else {
				// alert('请求标签数据失败');
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