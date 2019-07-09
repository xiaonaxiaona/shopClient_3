/* 
一个能发送ajax请求的函数
1. 统一处理请求异常
2. 异步请求成功的数据不是response, 而是response.data
3. 对post请求参数进行ulencode处理, 而不使用默认的json方式(后台接口不支持)
4. 配置请求超时的时间
*/
import axios from 'axios'
import qs from 'qs'
import store from '../store'
import router from '../router'
import { Toast } from 'mint-ui'


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

  // 第三天：如果浏览器有tokden, 就自动携带上token
  // const token = localStorage.getItem('token_key')
  // if(token){
  //   config.headers.Authorization = 'token ' + token
  // }

  //第四天：如果请求配置标识了需要携带token
  const { needToken } = config.headers
  if(needToken){
    //1.从state中取出token
    const token = store.state.token
    //console.log(token)
    //2.0 如果有值，添加到授权的头中
    if(token){
      config.headers.Authorization = token


    }else{
    // 2.1 如果没有值，则抛出异常
    //抛出异常, 直接进行错误处理流程(不发请求)
    const error = new Error('token不存在，不发请求')
    error.status = 401  //添加一个标识
    throw error
    }
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
  //alert('请求出错：'+error.message)
  if(!error.response){
    if(error.status === 401){
      //如果当前没有在登录界面，【统一处理其他请求没有在登录
      //界面的情况，只会跳一次，并且出一个弹框】
      if(router.currentRoute.path != '/login'){
        router.replace('/login')
        Toast(error.message)  //出现提示信息
      }else{
        console.log('没有token，已在login界面不需要再跳转')
      }
    }
  }else{
    const status = error.response.status
    const msg = error.message
    if(status===401){
      //退出登录
      store.dispatch('logout')
      router.replace('/login')
    }else if(status ===404){
      Toast('请求的资源不存在')
    }else{
      Toast('请求异常' + msg)
    }
  }
  

  return new Promise(() => {})   
  //统一处理请求失败的结果；中断promise链，让它返回的一直是pending的状态；防止走请求失败的回调中
});

export default axios