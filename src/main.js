// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router' 
import store from './store'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import VueQuillEditor from 'vue-quill-editor'
import MyAxios from '@/const/MyAxios'
import 'element-ui/lib/theme-chalk/index.css';
import './fonts/iconfont.css'
import axios from '@/const/axios'
import tool from './const/tool'
import App from './App'


// import '../static/jquery-3.2.1.js'

// import '../static/UE/ueditor.config.js'
// import '../static/UE/ueditor.all.min.js'
// import '../static/UE/lang/zh-cn/zh-cn.js'
// import '../static/UE/ueditor.parse.min.js'

Vue.prototype.$axios = axios;
Vue.prototype.$tool = tool;


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(VueQuillEditor);
Vue.use(MyAxios);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
