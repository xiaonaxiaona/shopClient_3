import ajax from './ajax.js'

const BASE = '/api'
//1. 根据经纬度获取位置详情
export const reqAddress = (longitude, latitude) => ajax.get(BASE+`position/${latitude},${longitude}`)

//2. 获取食品分类列表  
export const reqCategorys = () => ajax({
  // method: 'GET',  //axios默认就是get请求，所以可以不写
  url: BASE + '/index_category',
  headers:{
    needToken:true
  }
})

//3. 根据经纬度获取商铺列表
export const reqShops = ({latitude, longitude}) => ajax({
  method: 'GET',
  url: BASE + '/shops',
  params: { latitude, longitude },
  headers:{
    needToken:true
  }
})

//4. 发送短信验证码
export const reqSendCode = (phone) => ajax({
  method: 'GET',
  url:  BASE + '/sendcode',
  params: { phone }
})

//5. 用户名与密码登录
export const reqPwdLogin = ({ name, pwd, captcha }) =>  ajax({
  method: 'POST',
  url: BASE + '/login_pwd',
  data: { name, pwd, captcha }
})

//6. 手机号与验证码登录
export const reqSmsLogin = ({ phone, code }) =>ajax({
  method: 'POST',
  url: BASE + '/login_sms',
  data: { phone, code }
})

//7. 自动登录的请求
export const reqAutoLogin = () =>ajax({
  url:BASE + '/auto_login',
  headers:{
    needToken:true
  }
})

//8.Mock 模拟数据
export const reqInfo = () =>ajax('/goods')
export const reqRatings = () =>ajax('/ratings')
export const reqGoods = () =>ajax('/info')