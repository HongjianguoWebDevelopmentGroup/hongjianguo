import menu from '@/const/menuConst'

const sources = menu.source; 
const types = sources.map(_ => _.key);

const state = {
	type: '',
	source: [],
}

const getters = {
	menuType: state => state.type ? state.type  : '',
	menuSource: state => state.source ? state.source : [],
	noMenu: state => !state.source || state.source.length == 0,
}

const mutations = {
	setMenuType (state, type) {
		state.type = type;
	},
	setMenuSource (state, type) {
		const arr = sources.filter(v => type === v.key );
		const source = !arr[0] ? [] : arr[0]['menu'] ? arr[0]['menu'] : [];
		state.source = source;  
	}
}	

const actions = {
	changeMenuType ({commit}, type = '') {
		if(types.indexOf(type) < 0) return;

		commit('setMenuType', type);
		commit('setMenuSource', type);
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}