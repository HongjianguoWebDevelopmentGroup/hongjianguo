import axios from 'axios'
//请求参数配置 参照axios组件API
export default axios.create({
  baseURL: '/api',
});