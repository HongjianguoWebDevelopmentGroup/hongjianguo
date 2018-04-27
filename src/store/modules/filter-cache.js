const state = {
	screen: [],
	shortcut: [],
	custom: [],
}

const getters = {
	screen: state=>state.screen,
	screen_label: state=>{
		const screen = state.screen;
    	const arr = [];
    
    for(let s of screen) {
      arr.push(s["name"] + "：" + s["items"].map(item=>item.label).join("、"));
    }

    return arr;
	},
	listFilterLabel: state => {
		return state.custom.map(v => ({key: v.key.label, value: v.value.label}));
	},
	listFilterValue: state => {
		return state.custom.map(v => ({key: v.key.value, value: v.value.value})); 
	},
	screen_value: state=>{
		const screen = state.screen;
		const map = new Map();

		for(let s of screen) {
			map.set(s['key'], s['items'].map(item=>item.value));
		}

		return map;
	},
	screen_control: state=>{
		const screen = state.screen;
		const map = new Map();
		
		for(let a of screen) {
			if(a['key']) {
				map.set(a['key'], true);
			}
		}
		return map;
	},
	screen_obj: state=>{
		const screen = state.screen;
		const o = {};

		for(let s of screen) {
			o[s['key']] = s['items'][0]['value'];
		}

		return o;
	}
}

const mutations = {
	clearScreen: (state)=>{
		state.screen.splice(0,state.screen.length);
	},
	addScreen: (state, {name,key,items})=>{
		state.screen.push({name,key,items});
	},
	removeScreen: (state, index)=>{
		state.screen.splice(index, 1);
	},
	addListFilter (state, item) {
		state.custom = [...state.custom, item];
	},
	editListFilter (state, {index, item}) {
		state.custom.splice(index, 1, item);
	},
	removeListFilter (state, index) {
		state.custom.splice(index, 1);
	}
}

const actions = {
	addListFilter ({commit}, item) {
		if(!item) return;
		commit('addListFilter', item);
	},
	removeListFilter ({commit}, index) {
		if(typeof index != 'number') return;
		commit('removeListFilter', index);
	},
	editListFilter({state, commit}, {key, item}={}) {
		if(!key || !item) return;
		if(typeof key != 'string') return;
		let index = '';
		state.custom.forEach((v, i) => {
			if(v.key.value == key) {
				index = i;
			}
		})

		if(index === '') return;
		commit('editListFilter', {index, item});
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}