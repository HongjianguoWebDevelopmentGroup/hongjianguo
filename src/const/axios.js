import axios from 'axios'
//请求参数配置 参照npm axios API
export default axios.create({
  baseURL: '/api', //打包的时候需要注释
});