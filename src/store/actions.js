import {reqAddress, reqCategorys, reqShops} from '../api'
import {RECEIVE_ADDRESS, RECEIVE_CATEGORYS, RECEIVE_SHOPS, 
         RECEIVE_USER,RESET_USER} from './mutation_types'

import Cookies from 'js-cookie'

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
    localStorage.setItem('token_key',user.token)

    commit(RECEIVE_USER,user)
  },

  //5. 退出登录-----a.清除state中的user b.清除local中的token_key c.清除cookies 
  logout({commit}){
    commit(RESET_USER)

    localStorage.removeItem('token_key')
    
    Cookies.remove('user_id')
  }
}