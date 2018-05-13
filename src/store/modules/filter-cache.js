import {map as setting} from '@/const/filterConfig'
import {fieldExceptMap} from '@/const/fieldConfig'
// console.log(setting);
const state = {
	shortcut: [],
	shortcutVisible: false,
	custom: [],
	type: '',
	lock: false,
}

const getters = {
	screen: state => state.shortcut, //快捷筛选项
	screenVisible: state => state.shortcutVisible, //快捷筛选项面板显示控制
	screenLabel: state => { //快捷筛选项显示
		return state.shortcut.map((v, i) => ({
			type: 'screen',
			label: `${v['name']}：${v['items'].map(item=>item.label).join("、")}`,
			index: i,
		}));
	},
	screenControl: state => { //已选关键字映射
		const screen = state.shortcut;
		const map = new Map();
		
		for(let a of screen) {
			if(a['key']) {
				map.set(a['key'], true);
			}
		}
		return map;
	},
	screenValue: state => { //快捷筛选项请求参数值
		const screen = state.shortcut;
		const form = {};

		screen.forEach(item => {
			form[item['key']] = item['items'][0]['value'];
		});

		
		return form;
	},
	listFilter: state => state.custom, //自定义筛选项
	listFilterLabel: state => { //自定义筛选项显示
		// console.log('---------listFilterLabel---------');
		const data = state.custom.map((v, i) => ({
			type: 'listFilter',
			label: `${v['name']}：${v['label']}`,
			index: i,
		}));
		return data;
	},
	listFilterValue: (state, getters, rootState) => { //自定义筛选项请求参数值
		// console.log('---------listFilterValue---------');
		const listFilter = state.custom;
		const form = {};
		listFilter.forEach(item => {
			let value = item['value'];
			if(Array.isArray(value)) {
				if(value.length == 2 && (value[0] instanceof Date || value[1] instanceof Date )) value = value.map(v => rootState.tool.getDate(v));
				value = value.join(',');
			}
			form[item['key']] = value;
		})
		return form;
	},
	filterLock: state => state.lock, //刷新数据锁,需要在watch函数中使用(TableComponent)
	navLabel: (state,getters) => { //合并显示
		// console.log('---------navlabel---------');
		return [...getters.screenLabel, ...getters.listFilterLabel];
	},
	filterForm: (stata, getters) => { //合并上传参数
		console.log('---------filterForm---------')
		const form = Object.assign({}, getters.screenValue, getters.listFilterValue);
		console.log(form);
		return form;
	},
	filterSetting: (state, getters) => { //自定义筛选配置项
		let data = setting.get(state.type);
		data = data ? data : [];
		const exceptName = fieldExceptMap.get(state.type);
		if(exceptName) {
			const except = getters[exceptName];
			console.log(except);
			if(except) {
				const exceptMap = new Map(except.map(v => ([v, true])));
				data = data.filter(v => !exceptMap.get(v.id));
				console.log(data);
			}
		}
		return data; 
	},
	filterSettingMap: (state, getters) => { //自定义筛选配置项映射
		const map = new Map();
		getters.filterSetting.forEach(v => {
			map.set(v.id, v);
		})
		return map;
	}

}

const mutations = {
	setFilterType (state, type) {
		state.type = type;
	},
	setScreenVisible (state, val) {
		state.shortcutVisible = val;
	},
	addScreen (state, item) {
		state.shortcut = [...state.shortcut, item];
	},
	removeScreen (state, index) {
		state.shortcut.splice(index, 1);
	},
	setListFilter (state, data) {
		state.custom = data;
	},
	addListFilter (state, item) {
		state.custom = [...state.custom, item];
	},
	editListFilter (state, {index, item}) {
		state.custom.splice(index, 1, item);
	},
	removeListFilter (state, index) {
		state.custom.splice(index, 1);
	},
	setFilterLock (state, bool) {
		state.lock = bool;
	},
	clearFilter () {
		state.shortcut = [];
		state.custom = [];
	}
}

const actions = {
	setFilterType ({commit}, type='') {
		if(typeof type != 'string' && !type) return;
		commit('setFilterType', type);
	},
	//清空筛选项
	//flag用于控制清空筛选项时,是否刷新列表(默认不刷新)
	clearFilter ({commit, state}, flag=false) {
		console.log('---------clearFilter---------');
		if(!flag) {
			commit('setFilterLock', true);
		}

		commit('clearFilter');

		if (state.lock) {
			window.setTimeout(() => {
				commit('setFilterLock', false);
			}, 0);
		}		
	},
	//设置快捷筛选面板是否显示
	setScreenVisible ({commit}, item) {
		if(typeof item != 'boolean') return;
		commit('setScreenVisible', item);
	},
	//添加快捷筛选项
	addScreen ({commit}, item) {
		if(!item) return;
		commit('addScreen', item);
	},
	//移除快捷筛选项
	removeScreen ({commit}, index) {
		if(typeof index != 'number') return;
		commit('removeScreen', index);
	},
	setListFilter ({commit}, data) {
		console.log('--------setListFilter-------')
		if(!Array.isArray(data)) return;
		commit('setListFilter', data);
	},
	//添加列表筛选项
	addListFilter ({commit}, item) {
		if(!item) return;
		commit('addListFilter', item);
	},
	//移除列表筛选项
	removeListFilter ({commit}, index) {
		if(typeof index != 'number') return;
		commit('removeListFilter', index);
	},
	//编辑列表筛选项
	editListFilter({state, commit}, {key, item}={}) {
		if(!key || !item) return;
		
		let index = '';
		if(typeof key == 'string') {
			state.custom.forEach((v, i) => {
				if(v.key == key) {
					index = i;
				}
			})
		}else if(typeof key == 'number') {
			index = key;
		}
		if(index === '') return;
		
		commit('editListFilter', {index, item});
	},
	//关闭筛选标签
	closeTag ({state, commit, dispatch}, item) {
		if(item.type == 'screen') {
      dispatch('removeScreen', item.index);
    }else if(item.type == 'listFilter') {
      dispatch('removeListFilter', item.index);
    }
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}