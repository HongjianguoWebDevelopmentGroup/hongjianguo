/*对应select和date组件筛选数据*/
const state = {
  data: {},
  URL: {},
  DATA_KEY: {},
}
const getters = {
  filterData: state=>state.data,
  getUrl: state=>state.URL,
  data_key: state=>state.DATA_KEY,
}

const mutations = {
  setFilterData (state, {key,value}) {
   state.data = {...state.data,[key]:value}
  },
  setUrl (state, {key,url}) {
    state.URL = {...state.URL,[key]:url};
  },
  setDataKey (state, {key,data_key}) {
    state.DATA_KEY = {...state.DATA_KEY,[key]:data_key};
  },
}

const actions = {
  refreshFilterData ({commit, rootState, state,getters},{success,key}={}) {
    console.log(getters.data_key);
    if(key == undefined) return;
    // if(getters.getUrl === '' && getters.data_key === '') return false; 
    const url = rootState.status ? getters.getUrl[key].replace(/\/api/, '') : getters.getUrl[key];
    rootState.axios
      .get(url)
      .then(response=>{
        const d = response.data;
        const DATA_KEY = getters.data_key[key];
        const value = d[DATA_KEY].data!=undefined?d[DATA_KEY].data:d[DATA_KEY];
        if(d.status){
          commit('setFilterData', {key,value});
          if (success) {success(d)};
        }else {}
      })
      .catch(error=>{console.log(error)});
  },
  setUrl({commit,rootState,state},{key,url}={}) {
    if(url){
      commit('setUrl',{key,url});
    }
  },

}

export default {
  state,
  getters,
  mutations,
  actions,
}