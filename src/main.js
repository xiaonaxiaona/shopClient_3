import Vue from 'vue'
import App from './App.vue'
import { Button } from 'mint-ui'

import router from './router'
import Header from './components/Header/Header.vue'
import store from './store'
import Star from './components/Star/Star.vue'
import './validate'  //时时验证的
import './mock/mockServe'   //在入口文件中引入

Vue.component(Button.name, Button)  // 在标签中写这个 mt-button

//注册全局组件  引号中的为组件标签名
Vue.component('Header', Header)
Vue.component('Star', Star)

/* eslint-disable no-new */  
// ---配置这个并且只在当前文件下做检查， 防止报创建一个对象，但是没有定义与用的错误
new Vue({
  el: '#app',
  render: h => h(App),
  router , // 配置路由器
  store
})
