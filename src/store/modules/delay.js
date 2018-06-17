let url = '/api/delayrecord';
const state = {
  data: null,
}

const getters = {
	taskDelayData: state=>state.data?state.data.data: [],
}

const mutations = {
	setDelayRecord (state, data) {
		state.data = data;
	}
}

const actions = {
	refreshTaskDelay ({commit, rootState},taskId) {
		url = rootState.status ? url.replace(/\/api/, '') : url;
		const params = {'task_id': taskId};
		rootState.axios
		.get(url,{params})
		.then(response=>{
			const d = response.data;
			if(d.status){
				commit('setDelayRecord', d.data);
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