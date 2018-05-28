let url = '/extend';
const state = {
	data: null,
}

const getters = {
	extendsData: state=>state.data ? state.data : [],
	extendsMap: (state, getters)=>{
		const d = state.data ? state.data : [];
		const map = {};
		d.forEach(_=>{
			_.configs.forEach(item=>{
				map[item.name] = item.config_value;
			})
		});

		return map;
	},
	configsExtends1: (state, getters)=>state.data ? getters.extendsMap['EXTEND_ONE'] : '',
	configsExtends2: (state, getters)=>state.data ? getters.extendsMap['EXTEND_TWO'] : '',
	configsExtends3: (state, getters)=>state.data ? getters.extendsMap['EXTEND_THREE'] : '',
	hideProposal: (state, getters)=>state.data ? getters.extendsMap['HIDE_PROPOSAL'] : 1,
}

const mutations = {
	setExtends (state, d) {
		state.data = d;
	}
}

const actions = {
	refreshExtends ({commit, rootState, state}, async=true) {
		url = rootState.status ? url.replace(/\/api/, '') : url;

		$.ajax({
			type: 'POST',
			url,
			async,
			success (d) {
				if(d.status){
					commit('setExtends', d.configs);
				}else {
					alert('请求自定义字段失败');
				}
			},
			error (e) {
				console.log(e);
			}
		})
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}