/*对应select和date组件筛选数据*/
import {map as filterConfig} from '@/const/headerFilterConfig'
const filterSettingVuex = (type) => {
  const filterSetting = filterConfig.get(type);
  return filterSetting;
}
const state = {
  data: {},
  URL: '',
  DATA_KEY: '',
}

// const getMap = (data) => {
//   const map = new Map();
//   a(data);
//   return map;

//   function a(arr) {
//     for(let d of arr) {
//       map.set(d.id, d);
//       if(d.children && d.children.length) {
//         a(d.children);
//       }
//     }
//   }
// }

const getters = {
  filterData: state=>state.data,
  filterDataMap:state=>{

  },
  getUrl: state=>state.URL,
  data_key: state=>state.DATA_KEY,
}

const mutations = {
  setFilterData (state, d) {
   const data = state.data.
   return data;
  },
  setUrl (state, d) {
    state.URL = d;
  },
  setDataKey (state, d) {
    console.log(d);
    state.DATA_KEY = d;
  },
}

const actions = {
  refreshFilterData ({commit, rootState, state,getters},{success}={}) {
    console.log(getters.data_key);
    if(getters.getUrl === '' && getters.data_key === '') return false; 
    const url = rootState.status ? getters.getUrl.replace(/\/api/, '') : getters.getUrl;
    rootState.axios
      .get(url)
      .then(response=>{
        const d = response.data;
        if(d.status){
          commit('setFilterData', d[getters.data_key].data);
          if (success) {success(d)};
        }else {}
      })
      .catch(error=>{console.log(error)});
  },
  setUrl({commit,rootState,state},{url}={}) {
    if(url){
      commit('setUrl',url);
    }
  },

}

export default {
  state,
  getters,
  mutations,
  actions,
}