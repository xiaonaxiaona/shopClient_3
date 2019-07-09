import {reqAddress, 
        reqCategorys, 
        reqShops,
        reqAutoLogin,
        reqGoods,
        reqRatings,
        reqInfo
      } from '../api'
import {
        RECEIVE_ADDRESS, 
        RECEIVE_CATEGORYS, 
        RECEIVE_SHOPS, 
        RECEIVE_USER,
        RESET_USER,
        RECEIVE_TOKEN,
        RESET_TOKEN,
        RECEIVE_INFO,
        RECEIVE_RATINGS,
        RECEIVE_GOODS
      } from './mutation_types'

//import Cookies from 'js-cookie'

//action中是发ajax请求的
export default {
  //1. 根据经纬度获取位置详情
  async getAddress({commit,state}){
    const {latitude, longitude} = state
    const result = await reqAddress(longitude, latitude)
    if(result.code === 0){
      const address = result.data
      commit(RECEIVE_ADDRESS, address)
    }
  },

  //2. 获取食品分类列表
  async getCategorys({commit}, callback){
    const result = await reqCategorys()
    if(result.code === 0){
      const categorys = result.data
      commit(RECEIVE_CATEGORYS, categorys)
      //在状态数据更新完毕后，执行callback  方式2 中的callback
      typeof callback === 'function' && callback()  //发通知
    }
  },

  //3. 根据经纬度获取商铺列表
  async getShops({commit,state}){
    const {latitude, longitude} = state
    const result = await reqShops({latitude, longitude})
    if(result.code === 0){
      const shops = result.data
      commit(RECEIVE_SHOPS, shops)
    }
  },

  //4. 持久化保存token，与在state中保存user
  recodeUser({commit},user){
    //1. 保存到localstorage中
    localStorage.setItem('token_key',user.token)  

    //2. 保存state中的token
    commit(RECEIVE_TOKEN,{token: user.token})

    //3. 保存user内容
    delete user.token   //user中不需要再保存token，所以将这一属性删除
    commit(RECEIVE_USER, {user})
  },

  //5. 退出登录-----a.清除state中的user b.清除local中的token_key c.清除cookies 
  // 不需要发请求，所以在actions中没有
  logout({commit}){
    commit(RESET_USER)

    localStorage.removeItem('token_key')

    commit(RESET_TOKEN)
    
    //Cookies.remove('user_id')
  },

  //6. 有token时，自动登录的请求,刷新的时候，还会有名字或者手机号
   // 如果有token, 就发自动登陆的请求获取user
  async autoLogin({commit, state}){
    const token = state.token
    if(token){
      const result = await reqAutoLogin()
      if(result.code === 0){
        const user = result.data
        commit(RECEIVE_USER,{user})
      }
    }
  },

  //7. 获取商家信息info
  async getInfo({commit}){
    const result = await reqInfo()
    if(result.code === 0){
      const info = result.data
      commit(RECEIVE_INFO,{info})
    }
  },
  //8. 获取食物列表goods
  async getGoods({commit}){
    const result = await reqGoods()
    if(result.code === 0){
      const goods = result.data
      commit(RECEIVE_GOODS,{goods})
    }
  },
  //9. 获取评分ratings
  async getRatings({commit}){
    const result = await reqRatings()
    if(result.code === 0){
      const ratings = result.data
      commit(RECEIVE_RATINGS,{ratings})
    }
  }
  
}