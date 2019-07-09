import Vue from 'vue'
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate)

//3). 提示信息本地化
//import zh_CN from 'vee-validate/dist/locale/zh_CN'
VeeValidate.Validator.localize('zh_CN', {
  messages: zh_CN.messages,
  attributes: {
    phone: '手机号',
    //code: '验证码',
    name: '用户名',
    pwd: '密码'
  }
})

//4). 自定义验证规则
//import VeeValidate from 'vee-validate'
VeeValidate.Validator.extend('mobile', {
  validate: value => {
    return /^1\d{10}$/.test(value)
  },
  getMessage: phone => phone + '必须是11位手机号码'
})
