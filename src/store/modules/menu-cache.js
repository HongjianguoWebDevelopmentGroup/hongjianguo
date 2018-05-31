import menu from '@/const/menuConst'

const sources = menu.source;
const types = sources.map(_ => _.key);

const state = {
	type: '',
	source: [],
}

const getters = {
	noMenu: state => !state.source || state.source.length == 0,
	menuType: state => state.type ? state.type  : '',
	menuSource: state => state.source,
}

const mutations = {
	setMenuType (state, type) {
		const arr = sources.filter(v => type === v.key );
		const source = !arr[0] ? [] : arr[0]['menu'] ? arr[0]['menu'] : [];
		state.source = source;
		state.type = type;
	},
}	

const actions = {
	changeMenuType ({commit}, type = '') {
		if(types.indexOf(type) < 0) return;
		commit('setMenuType', type);
	},
}

export default {
	state,
	getters,
	mutations,
	actions,
}