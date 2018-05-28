let url = '/configs';//extend
const state = {
	data: null,
}

const getters = {
	configsData: state=>state.data ? state.data : [],
}

const mutations = {
	setConfigs (state, d) {
		state.data = d;
	}
}

const actions = {
	refreshConfigs ({commit,  rootState, state}) {
		url = rootState.status ? url.replace(/\/api/, '') : url;

		rootState.axios.get(url)
			.then(_=>{
				const d = _.data;
				if(d.status){
					commit('setConfigs', d.configs);
				}else {
					alert('请求系统配置数据失败');
				}
			})
			.catch(error=>{
				console.log(error);
			});

		// rootState.axios
		// 	.get(url)
		// 	.then(response=>{
		// 		const d = response.data;
		// 		if(d.status){
		// 			commit('setConfigs', d.configs);
		// 		}else {
		// 			alert('请求系统配置数据失败');
		// 		}
		// 	})
		// 	.catch(error=>{console.log(error);});
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}