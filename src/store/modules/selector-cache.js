const state = {
	config: [
	  ['agency_scope', {
	    placeholder: '请选择代理机构业务范围',
	    options: [
	      { name: '国内新申请', id: '国内新申请'},
	      { name: '国外新申请', id: '国外新申请'},
	      { name: '国内无效诉讼', id: '国内无效诉讼'},
	      { name: '国外无效诉讼', id: '国外无效诉讼'},
	      { name: '分析', id: '分析'},
	    ]
	  }],
	  ['ipr', {
	    placeholder: '请选择IPR',
	    options: 'iprOptions',
	    refresh: 'refreshIpr',
	  }],
	  ['case_type', {
	    placeholder: '请选择案件类型',
	    options: [
	      { id: 0, name: '提案' },
	      { id: 1, name: '专利' },
	      { id: 2, name: '商标' },
	      { id: 3, name: '版权' },
	    ]
	  }],
	  ['patent_type', {
	    placeholder: '请选择专利类型',
	    options: [
	      { name: '发明专利', id: 1 },
	      { name: '实用新型', id: 2 },
	      { name: '外观设计', id: 3 },
	      { name: '发明+新型', id: 4 },
	    ]
	  }],
	  ['patent_type_strainer', {
	    placeholder: '请选择专利类型',
	    options: [
	      { name: '发明专利', id: 1 },
	      { name: '实用新型', id: 2 },
	      { name: '外观设计', id: 3 },
	    ]
	  }],
	  ['product_relevance', {
	    placeholder: '请选择产品相关',
	    options: [
	      { name: '是', id: 1 },
	      { name: '否', id: 0 },
	      { name: '预研阶段', id: 2 },
	    ]
	  }],
	  ['agency_type', {
	    placeholder: '请选择代理类型',
	    options: [
	      {id:1, name:"申请及OA阶段"},
	      {id:2, name:"OA阶段"},
	      {id:3, name:"复审阶段"},
	      {id:4, name:"无效阶段"},
	      {id:5, name:"被无效答复"},
	      {id:6,name:"分析"}
	    ]
	  }],
	  ['file_type', {
	    placeholder: '请选择文件类型',
	    url: '/api/fileTypes',
	  }],
	  ['file_type_patent', {
	    placeholder: '请选择专利文件类型',
	    url: '/api/fileTypes?category=1',
	  }],
	  ['file_type_copyright', {
	    placeholder: '请选择版权文件类型',
	    url: '/api/fileTypes?category=3',
	  }],
	  ['group', {
	    placeholder: '请选择用户组',
	    options: 'groupOptions',
	  }],
	  ['mail', {
	    placeholder: '请输入邮箱地址',
	    url: '/api/mailAddress',
	    handle (data) {
	      return data.list.map(_=>{return {id: _.value, name: _.label}});
	    },
	    allowCreate: true,
	    defaultFirstOption: true,
	  }],
	  ['tag', {
	    placeholder: '请输入或选择标签',
	    url: '/api/tags',
	    handle (data) {
	      return data.tags.map(_=>{return {id: _.tag, name: _.tag}});
	    },
	    allowCreate: true,
	    defaultFirstOption: true,
	  }],
	  ['area', {
	    placeholder: '请选择地区',
	    options: 'areaData',
	  }],
	  ['flow_node', {
	    placeholder: '请选择流程节点',
	    url: '/api/flownodes',
	    handle: _=>_.flownodes,
	  }],
	  ['fee_code', {
	    placeholder: '请选择费用代码',
	    options: 'feeCodes'
	  }],
	  ['fee_target_income', {
	    placeholder: '请选择收入对象',
	    url: '/api/feeTargets',
	    params: {
	      debit: 1,
	    },
	  }],
	  ['fee_target_expenditure', {
	    placeholder: '请选择支出对象',
	    url: '/api/feeTargets',
	    params: {
	      debit: 0,
	    }
	  }],
	  ['progress', {
	    placeholder: '请选择当前进度',
	    url: '/api/progress',
	  }],
	  ['branch', {
	    placeholder: '请选择部门',
	    options: 'branchOptions',
	  }],
	  ['copyright_type', {
	    placeholder: '请选择版权类型',
	    options: [
	      { name: '计算机软件著作权', id: 1 },
	      { name: '文字作品著作权', id: 2 },
	      { name: '美术作品著作权', id: 3 },
	      { name: '影视作品著作权', id: 4 },
	    ]
	  }]
	],
	cache: new Map(),//数据缓存存储集
	cacheMap: new Map(),
}

const getters = {
	staticSelectorMap (state) {
		return new Map(state.config);
	},
	staticSelectorCacheMap (state) {
		return state.cache;
	},
	staticSelectorCacheMap (state) {
		return state.cacheMap;
	}
}

const mutations = {
	setSelectorCache (state, {type, value}) {
		state.cache.set(type, value);
		const map = new Map();
		value.forEach(_=>{map.set(_.id, _)});
		state.cacheMap.set(type, map);
	}
}

const actions = {
	initializeSelectorCache ({commit, rootState, state, getters}, {type, func, flag=false}) {
		//类型参数不存在 退出
		if(type == undefined) return;
		//该类型不在选择器配置地图中 退出
		const config = getters.staticSelectorMap.get(type);
		if(config == undefined) return;
		//该选择器数据已存在 执行回掉函数 退出(当FLAG为True时强制刷新)
		const data = state.cache.get(type);
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