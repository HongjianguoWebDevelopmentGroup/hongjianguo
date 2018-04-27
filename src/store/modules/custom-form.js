const urlMap = new Map([
	['patent',''],
	['trademark',''],
	['copyright',''],
	['test', '/api/form?form_type=patent'],
])
const state = {
	patent: null,
	trademark: null,
	copyright: null,
	test: null,

}

const getVisible = (arr) => {
	if(!arr) arr = [];
	const map = {};
	arr
		.filter(v => v.base_type == 1)
		.forEach(v => { map[v['prop']] = v['label'] });
	
	return map;
}

const getCustom = (arr) => {
	if(!arr) arr = [];
	const map = {};

	arr
		.filter(v => v.base_type == 2 && v.type)
		.sort((a,b) => a['sort'] - b['sort'])
		.forEach(v => {
			let arr = map[v.group];
			arr ? arr.push(v) : map[v.group] = [v];
		})

	return map;
}

const getters = {
	
	patentFormSource: state => state.patent,
	patentFormVisible: state => getVisible(state.patent), 
	patentFormCustom:  state => getCustom(state.patent),
	
	trademarkFormVisible: state => getVisible(state.trademark), 
	trademarkFormCustom:  state => getCustom(state.trademark),
	
	copyrightFormVisible: state => getVisible(state.copyright), 
	copyrightFormCustom:  state => getCustom(state.copyright), 

	testFormSource: state => state.test,
	testFormVisible: state => getVisible(state.test), 
	testFormCustom:  state => getCustom(state.test), 
}

const mutations = {
	setCustomFormData(state, {type, data}) {
		state[type] = data.filter( v => v.is_visible == '1' );
	}
}

const actions = {
	async getCustomFormSource ({ commit, state, rootState }, {type, func, flag}={}) {
		
		//当前已请求过该类型表单数据 同时没有强制要求请求
		if(state[type] != null && !flag) {
			if(func) {
				func(state[type]);
			}
			return;
		}

		try {
			const url = urlMap.get(type);
			const d = await rootState.axios.request({
				url,
				methos: 'get',
			});
			const data = d.data;
			if(data.status) {
				commit('setCustomFormData', {type, data: data.data});
			}
			if(func) {
				func(data);
			}
		}catch (e) {
			console.log(e);
		}
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}