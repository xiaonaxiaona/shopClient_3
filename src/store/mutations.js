import {RECEIVE_ADDRESS, 
        RECEIVE_CATEGORYS, 
        RECEIVE_SHOPS, 
        RECEIVE_USER,
        RESET_USER} from './mutation_types'

export default {
  [RECEIVE_ADDRESS](state, address){//address是要传过来的参数
    state.address = address  //是传过来的参数
    //state是状态，其中的address是他的属性
  },
  [RECEIVE_CATEGORYS](state, categorys){
    state.categorys = categorys
  },
  [RECEIVE_SHOPS](state, shops){
    state.shops = shops
  },
  [RECEIVE_USER](state,{user}){
    state.user = user
  },
  [RESET_USER](state){
    state.user = {}
  }
}