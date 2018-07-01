let url = '/api/userinfo'

const state = {
	data: null,
	loading: false,
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
	useridentity: state=>{
		const user = state.data;
		const i = user ? user.identity : '';
		return i;
	},
	userrole: state=>{
		const user = state.data;
		const i = user ? user.role : '';
		return i;
	},
	usergroups: state => {
		const user = state.data;
		let groups = [];
		if(user && user.groups) {
			groups = user.groups.map(v => v.id);
		}
		return groups;
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
	allTaskCount: state=>{
		const user = state.data;
		const count = user ? user.allTaskCount : 0;
		return count;
	},
	finishedTaskCount: state=>{
		const user = state.data;
		const count = user ? user.finishedTaskCount : 0;
		return count;
	},
	expiredTaskCount: state=>{
		const user = state.data;
		const count = user ? user.expiredTaskCount : 0;
		return count;
	},
	weekTaskCount: state=>{
		const user = state.data;
		const count = user ? user.weekTaskCount : 0;
		return count;
	},
	nextWeekTaskCount: state=>{
		const user = state.data;
		const count = user ? user.nextWeekTaskCount : 0;
		return count;
	},
	monthTaskCount: state=>{
		const user = state.data;
		const count = user ? user.monthTaskCount : 0;
		return count;
	},
	nextMonthTaskCount: state=>{
		const user = state.data;
		const count = user ? user.nextMonthTaskCount : 0;
		return count;
	},
	laterTaskCount: state=>{
		const user = state.data;
		const count = user ? user.laterTaskCount : 0;
		return count;
	},
	applicationTaskCount: state=>{
		const user = state.data;
		const count = user ? user.applicationTaskCount : 0;
		return count;
	},
	oaTaskCount: state=>{
		const user = state.data;
		const count = user ? user.oaTaskCount : 0;
		return count;
	},
	reexamTaskCount: state=>{
		const user = state.data;
		const count = user ? user.reexamTaskCount : 0;
		return count;
	},
	grantTaskCount: state=>{
		const user = state.data;
		const count = user ? user.grantTaskCount : 0;
		return count;
	},
	invalidTaskCount: state=>{
		const user = state.data;
		const count = user ? user.invalidTaskCount : 0;
		return count;
	},
	annualFeeTaskCount: state=>{
		const user = state.data;
		const count = user ? user.annualFeeTaskCount : 0;
		return count;
	},
	litigationTaskCount: state=>{
		const user = state.data;
		const count = user ? user.litigationTaskCount : 0;
		return count;
	},
	proposalTaskCount: state=>{
		const user = state.data;
		const count = user ? user.proposalTaskCount : 0;
		return count;
	},
	patentTaskCount: state=>{
		const user = state.data;
		const count = user ? user.patentTaskCount : 0;
		return count;
	},
	copyrightTaskCount: state=>{
		const user = state.data;
		const count = user ? user.copyrightTaskCount : 0;
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
		state.data = d;
	},
	setUserLoading (state, boolean) {
		state.loading = boolean;
	},
}

const actions = {
	refreshUser ({commit, rootState, state}) {
		url = rootState.status ? url.replace(/\/api/, '') : url;
		const params = {};
		commit('setUserLoading', true);
		const next = rootState.axios.get(url, { params });

		next
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