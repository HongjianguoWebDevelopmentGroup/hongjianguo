const keys = new Map([
	['patent', 'patent'],
	['copyright', 'Copyright'],
	['trademark', 'trademark'],
]);

const state = {
	id:'',
	type: '',
	true_type: '',
	data: null,
	loading: false,
}

const getters = {
  detailId: state=>state.id,
  detail_type: state=>state.type,
  detailBase: state=>state.data ? state.data : {},
  detailBasePatent: state=>{
  	if(state.true_type == 'patent') {
  		return state.data; 
  	}else {
  		return null;
  	}
  },
  detailBaseCopyright: state=>{
  	if(state.true_type == 'copyright') {
  		return state.data; 
  	}else {
  		return null;
  	}
  },
  detailBaseTrademark: state=>{
  	if(state.true_type == 'trademark') {
  		return state.data;
  	}else {
  		return null;
  	}
  },
  detailTasks: state=>state.data ? state.data.tasks : [],
  detailNotices: state=>state.data ? state.data.notices : [],
  detailFees: state=>state.data ? state.data.fees : [],
  detailMails: state=>state.data ? state.data.mails : [],
  detailDocuments: state=>state.data ? state.data.documents : [],
  detailGroup: state=>state.data && state.data.group ? state.data.group : [],
  detailFamily: state=>state.data && state.data.family ? state.data.family : [],
  detailDefence: state=>state.data && state.data.defence ? state.data.defence : [],
  detailQuote: state=>state.data && state.data.quote ? state.data.quote : null,
  detailReview: state=>state.data && state.data.review ? state.data.review : [],
  detailFundings: state=>state.data && state.data.fees.funding ? state.data.fees.funding : {},
  detailOfficial: state=>state.data && state.data.fees.official ? state.data.fees.official : {},
  detailAgency: state=>state.data && state.data.fees.agency ? state.data.fees.agency : {},
  detailAnnual: state=>state.data && state.data.fees.annual ? state.data.fees.annual : {},
  detailAmendments: state=>state.data && state.data.amendments ? state.data.amendments : [],
  detailLoading: state=>state.loading,
}

const mutations = {
	setDetailType: (state, path)=>{
		const arr = ['patent', 'trademark', 'copyright'];
		for(let a of arr) {
			const reg = new RegExp(a);
			if(reg.test(path)) {
				state.type = a;
				break;
			}
		}
	},
	setDetailData: (state, data)=>{ state.data = data },
	setLoading(state, boolean) { state.loading = boolean },
	setId(state, id) { state.id = id },
	refreshTrueType(state) { state.true_type = state.type },
}

const actions = {
	refreshDetailData({ commit, state, rootState }, {id, func, type, error, next}={}) {
		if(type) {
			commit('setDetailType', type);
		}else {
			type = state.type;
		}
		if(id) {
			commit('setId', id);
		}else {
			id = state.id;
		}
    if(!id || !type) return;
		let url = `/api/${state.type}s`;
		url = rootState.status ? url.replace(/\/api/, '') : url;
    commit('setLoading', true);
    const n = rootState.axios.get(`${url}/${id}`)
    n
    .then(response=>{
      if(func) func();    
      
      const d = response.data;
      if( d.status ) {
        commit('setDetailData', JSON.parse(JSON.stringify(d[state.type])));
      }else {
      	commit('setDetailData', null);
      	if(error) error(response);
        // alert(d.info);
      }
      commit('setLoading', false);
      commit('refreshTrueType');
    })
    .catch(err=>{
    	if(error) error(err);
      if(func) func();
      commit('setDetailData', null);
      commit('setLoading', false);
      console.log(err);
    });

    if(next) {
    	next (n);
    }
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}