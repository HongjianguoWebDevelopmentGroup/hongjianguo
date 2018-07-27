const state = {
	screen: [],
	lock: false,
}

const getters = {
	screen: state=>state.screen,
	screen_label: state=>{
		const screen = state.screen;
    	const arr = [];
    
    for(let s of screen) {
      arr.push({label:s["name"] + "：" + s["items"].map(item=>item.label).join("、"),type: 'screen'});
    }

    return arr;
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
	},
	filterLock: state => state.lock,
}

const mutations = {
	clearScreen: (state)=>{
		state.screen.splice(0,state.screen.length);
	},
	addScreen: (state, {name,key,items})=>{
		state.screen.push({name,key,items});
	},
	removeScreen: (state, index)=>{
		state.screen.splice(index,1);
	},
	setFilterLock (state, bool) {
		state.lock = bool;
	},
}

const actions = {
	clearFilter ({commit, state}, flag=false) {
		console.log('---------clearFilter---------');
		if(!flag) {
			commit('setFilterLock', true);
		}

		commit('clearScreen');

		if (state.lock) {
			window.setTimeout(() => {
				commit('setFilterLock', false);
			}, 0);
		}		
	},
}

export default {
	state,
	getters,
	mutations,
	actions,
}