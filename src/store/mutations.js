import {RECEIVE_ADDRESS, RECEIVE_CATEGORYS, RECEIVE_SHOPS} from './mutation_types'

export default {
  [RECEIVE_ADDRESS](state, address){//address是要传过来的参数
    state.address = address  //是传过来的参数
  },
  [RECEIVE_CATEGORYS](state, categorys){
    state.categorys = categorys
  },
  [RECEIVE_SHOPS](state, shops){
    state.shops = shops
  },
}