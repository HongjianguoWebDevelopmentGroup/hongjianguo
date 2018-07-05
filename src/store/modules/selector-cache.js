import configData from '@/const/selectConfig'

const state = {
	config: configData,
	cache: {},//数据缓存存储集
	cacheMap: new Map(),
}

const getters = {
	staticSelectorMap (state) {
		return new Map(state.config);
	},
	staticSelectorCache (state) {
		return state.cache;
	},
	staticSelectorCacheMap (state) {
		return state.cacheMap;
	}
}

const mutations = {
	setSelectorCache (state, {type, value}) {
		state.cache = {...state.cache, [type]: value};
		const map = new Map();
		value.forEach(_=>{map.set(_.id, _)});
		state.cacheMap.set(type, map);
	}
}

const actions = {
	initializeSelectorCache ({commit, rootState, state, getters}, {type, func, flag=false}) {
		console.log(type)
		//类型参数不存在 退出
		if(type == undefined) return;
		//该类型不在选择器配置地图中 退出
		const config = getters.staticSelectorMap.get(type);
		if(config == undefined) return;
		//该选择器数据已存在 执行回掉函数 退出(当FLAG为True时强制刷新)
		const data = state.cache[type];
		if(data != undefined && !flag) {
			if(func) func(data);
			return;
		}
		//若存在请求地址 请求数据 执行回掉函数 并缓存数据 		
    if(config.url) {
      const url = config.url;
      const params = config.params ? config.params : {};
      const success = _=>{
        const handle = config.handle;
        const value = handle ? handle(_) : _.list;

        if(func) func(value);
        commit('setSelectorCache',{type, value});
      }
      rootState.axios.get(url, {params})
				.then(response=>{
					const d = response.data;
					if(d.status){
						success(d);
					}else {
						console.log(response);
					}
				})
				.catch(error=>{console.log(error)});
    }
        
	},

}

export default {
	state,
	getters,
	mutations,
	actions,
}