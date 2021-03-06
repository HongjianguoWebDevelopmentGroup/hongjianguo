import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/const/axios'
import filter from '@/store/modules/filter-cache.js'
import detail from '@/store/modules/common-detail.js'
import tags from '@/store/modules/tags.js'
import product from '@/store/modules/product.js'
import classification from '@/store/modules/classification.js'
import branch from '@/store/modules/branch.js'
import ipr from '@/store/modules/ipr.js'
import area from '@/store/modules/area.js'
import city from '@/store/modules/city.js'
import invoiceEntity from '@/store/modules/invoice-entity.js'
import userGroup from '@/store/modules/user-group.js'
import flows from '@/store/modules/flows.js'
import taskDef from '@/store/modules/task-def.js'
import currentUser from '@/store/modules/current-user.js'
import sysmesg from '@/store/modules/sysmesg.js'
import configs from '@/store/modules/configs.js'
import extendFields from '@/store/modules/extend-fields.js'
import cache from '@/store/modules/cache.js'
import selectorCache from '@/store/modules/selector-cache.js'
import tableCache from '@/store/modules/table-cache.js'
import menuCache from '@/store/modules/menu-cache.js'
import customForm from '@/store/modules/custom-form.js'
import tool from '@/const/tool.js'

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true,
  state: {
    dragId: null,
    axios,
    tool,
    status: 0,
    loading: false,
    loadingText: '',
    view_loading: false,
    view_loading_text: '',
    shrinkLoading: false,
    shrinkLoadingText: '',
    inner_height: 0,
    inner_width: 0,
    leftNavVisible: true,
    agencyLoadVisible: false,
    importLoading: false,
  },
  modules: {
    filter,
    detail,
    tags,
    product,
    classification,
    branch,
    ipr,
    area,
    city,
    invoiceEntity,
    userGroup,
    flows,
    taskDef,
    currentUser,
    sysmesg,
    configs,
    extendFields,
    cache,
    selectorCache,
    tableCache,
    menuCache,
    customForm,
  },
  getters: {
    getDragId: state => state.dragId,
    loading: state => state.loading,
    loadingText: state => state.loadingText,
    viewLoading: state => state.view_loading,
    viewLoadingText: state => state.view_loading_text,
    shrinkLoading: state => state.shrinkLoading,
    shrinkLoadingText: state => state.shrinkLoadingText,
    windowHeight: state => state.inner_height, 
    windowWidth: state => state.inner_width,
    innerHeight: state => state.inner_height - 50,
    innerWidth: state => state.leftNavVisible ? state.inner_width - 200 : state.inner_width,
    shrinkHeight: state => state.inner_height - 132,
    getInnerWidth: state => state.leftNavVisible ? state.inner_width - 200 : state.inner_width, 
    leftVisible: state => state.leftNavVisible,
    agencyLoadVisible: state => state.agencyLoadVisible,
    importLoading: state => state.importLoading,
  },
  mutations: {
    setDragId (state, id) {
      state.dragId = id;
    },
    toggleLeftVisible (state) {
      state.leftNavVisible = !state.leftNavVisible;
    },
    AXIOS_FAILURE () {
      alert('网络错误');
    },
    setViewLoading(state, {loading=false, text="加载中..."}) {
      state.loading = loading;
      state.loadingText = text;
    },
    onLoading (state, text="加载中...") {
      state.loadingText = text;
      state.loading = true;
    },
    cancelLoading (state) {
      state.loading = false;
    },
    setInnerHeight (state, number) {
      state.inner_height = number;
    },
    setInnerWidth (state, number) {
      state.inner_width = number;
    },
    setShrinkLoading(state, boolean) {
      state.shrinkLoading = boolean;
    },
    setShrinkLoadingText(state, text) {
      state.shrinkLoadingText = text;
    },
    setAgencyLoadVisible(state, boolean) {
      state.agencyLoadVisible = boolean;
    },
    showAgencyLoad(state) {
      state.agencyLoadVisible = true;
    },
    setImportLoading(state, boolean) {
      state.importLoading = boolean;
    },
  },
  actions: {
    onShrinkLoading({state, commit},text="加载中...") {
      commit('setShrinkLoadingText', text);
      commit('setShrinkLoading', true);
      // state.shrinkLoadingText = text;
      // state.shrinkLoading = true;
    },
    offShrinkLoading({state, commit}) {
      commit('setShrinkLoadingText', '');
      commit('setShrinkLoading', false);
      // state.shrinkLoadingText = '';
      // state.shrinkLoading = false;
    }
  }
});

export default store;