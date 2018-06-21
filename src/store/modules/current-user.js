let url = '/userinfo'

const state = {
	data: null,
	loading: true,
}

const getters = {
	getUser: state=>state.data,
	menusMap: state=>{

		if(state.data == null) return null;

		let map = new Map();
		const menus = state.data.menus ? state.data.menus : [];
		menus.forEach(_=>{map.set(_, true)});

		return map;
	},
	currentUser: state=>state.data,
	username: state=>{
	  const user = state.data;
       
    const name = user 
    							? user.name ? user.name : user.username
          				: '';
    return name;
	},
	userid: state=>{
		const user = state.data;
		const id = user ? user.id : '';
		return id; 
	},
	userrole: state=>{
		const user = state.data;
		const role = user ? user.role : '';
		return role;
	},
	useridentity: state=>{
		const user = state.data;
		const i = user ? user.identity : '';
		return i;
	},
	pendingTaskCount: state=>{
		const user = state.data;
		const count = user ? user.pendingTaskCount : 0;
		return count;
	},
	pausedTaskCount: state=>{
		const user = state.data;
		const count = user ? user.pausedTaskCount : 0;
		return count;
	},
	monitoredTaskCount: state=>{
		const user = state.data;
		const count = user ? user.monitoredTaskCount : 0;
		return count;
	},
	pendingTask: state=>{
		const user = state.data;
		const pendingTask = user && user.pendingTask ? user.pendingTask : null;
		return pendingTask;
	},
	userLinks: state => {
		const user = state.data;
		const links = user && user.links ? user.links : [];
		return links;
	},
	userReminders: state => {
		const user = state.data;
		const reminders = user && user.reminders ? user.reminders : [];
		return reminders;
	},
	userLoading: state=>state.loading,
}

const mutations = {
	setUser (state, d) {
		// console.log('------------setUser------------');
		state.data = d;
	},
	setUserLoading (state, boolean) {
		state.loading = boolean;
	}
}

const actions = {
	refreshUser ({commit, rootState, state}) {
		url = rootState.status ? url.replace(/\/api/, '') : url;
		const params = {};
		commit('setUserLoading', true);
		rootState.axios
			.get(url, { params })
			.then(response=>{
				const d = response.data;
				if(d.status){
					commit('setUser', d.member);
				}else {
					// alert('请求Ipr数据失败');
				}

				commit('setUserLoading', false);
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