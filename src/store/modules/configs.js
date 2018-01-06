let url = '/api/extend';
const state = {
	data: null,
}

const getters = {
	configsData: state=>state.data ? state.data : [],
	configsMap: (state, getters)=>{
		const d = getters.configsData;
		const map = {};
		d.forEach(_=>{
			_.configs.forEach(item=>{
				map[item.name] = item.config_value;
			})
		});

		return map;
	},
	configsExtends1: (state, getters)=>state.data ? getters.configsMap['EXTEND_ONE'] : '',
	configsExtends2: (state, getters)=>state.data ? getters.configsMap['EXTEND_TWO'] : '',
	configsExtends3: (state, getters)=>state.data ? getters.configsMap['EXTEND_THREE'] : '',
}

const mutations = {
	setConfigs (state, d) {
		state.data = d;
	}
}

const actions = {
	refreshConfigs ({commit, rootState, state}, async=true) {
		url = rootState.status ? url.replace(/\/api/, '') : url;

		$.ajax({
			type: 'GET',
			url,
			async,
			success (d) {
				if(d.status){
					commit('setConfigs', d.configs);
				}else {
					alert('请求系统配置数据失败');
				}
			},
			error (error) {
				console.log(error);
			}
		})

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