let url = '';
const state = {
  data: [],
}

const getters = {
  customData : state =>state.data,
}

const mutations = {
  setCustom (state, d) {
  	state.data = d;
  }
}

const actions = {
  refreshCustom ({commit,rootState}) {
  	url = rootState.status ? url.replace(/\/api/, '') : url;
  	rootState.axios.get(url)
  	.then(res => {
  		const d = res.data;
  		if(d.status){
  		  commit('setCustom');
  		}
  	}).catch(error=> {
  		console.log(error);
  	})	
  }
}

export default {
	state,
	getters,
	mutations,
	actions
}