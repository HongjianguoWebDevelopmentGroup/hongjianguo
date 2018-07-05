let url = '/api/branches';
const state = {
	data: [],
	lastUpdate: '',
}

const getMap = (data) => {
	const map = new Map();
	a(data);
	return map;

	function a(arr) {
		for(let d of arr) {
			map.set(d.id, d);
			if(d.children && d.children.length) {
				a(d.children);
			}
		}
	}
}

const getters = {
	branchData: state=>state.data,
	branchMap: state=>{
		return getMap(state.data);
	},
	branchOptions: (state, getters)=>{
		const map = getMap(state.data);
		const arr = [...map.values()];

		return arr;		
	},
	branchUpdate: (state)=>{
		const d = state.lastUpdate; 
		return d ? d : ''; 
	}
}

const mutations = {
	setBranch (state, d) {
		state.data = d.branches;
		state.lastUpdate = d.last_update;
	},
}

const actions = {
	refreshBranch ({commit, rootState, state},{success}={}) {
		url = rootState.status ? url.replace(/\/api/, '') : url;
		rootState.axios
			.get(url)
			.then(response=>{
				console.log(response);
				const d = response.data;
				if(d.status){
					commit('setBranch', d);
					if(success) { success(d) };
				}else {
					// alert('请求部门数据失败');
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