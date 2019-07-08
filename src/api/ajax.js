/* 
一个能发送ajax请求的函数
1. 统一处理请求异常
2. 异步请求成功的数据不是response, 而是response.data
3. 对post请求参数进行ulencode处理, 而不使用默认的json方式(后台接口不支持)
4. 配置请求超时的时间
*/
import axios from 'axios'
import qs from 'qs'

//全局配置请求超时的【不能小于服务那边给的值，服务器给的是2000】
axios.defaults.timeout = 5000

//请求拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  const {method, data} = config
  if(method.toLowerCase ==='post' && data && typeof data ==='object'){ //判断data是对象形式,
                                                              //且将对象形式的数据转为incode编码的形式
    config.data = qs.stringify(data)  //将对象形式的数据转为  a='1'&b='2'
  }

  return config;
});

//响应拦截器
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response.data;
}, function (error) {
  // Do something with response error
  //return Promise.reject(error);-----走失败的回调里面
  alert('请求出错：'+error.message)
  return new Promise(() => {})   
  //统一处理请求失败的结果；中断promise链，让它返回的一直是pending的状态；防止走请求失败的回调中
});

export default axios