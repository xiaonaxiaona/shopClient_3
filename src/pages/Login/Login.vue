<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:isLoginType}" @click="isLoginType = true">短信登录</a>
          <a href="javascript:;" :class="{on:!isLoginType}" @click="isLoginType = false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{on:isLoginType}">
            <section class="login_message">
              <!-- <input type="tel" maxlength="11" placeholder="手机号" v-model="phone" name="phone" v-validate="{required: true,regex: /^1\d{10}$/}"/> -->
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone" name="phone" v-validate="'required|mobile'"/>
              <span style="color: red;" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
              <button
                :disabled="!isRightPhone || sendTime >0 "
                class="get_verification"
                :class="{right_phone_number:isRightPhone}"
                @click.prevent="sendCode"
              >{{sendTime > 0 ?`已发送验证码${sendTime}s`:'获取验证码'}}</button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code"/>
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:!isLoginType}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name" name="name" v-validate="'required'"/>
                <span style="color: red;" v-show="errors.has('name')">{{ errors.first('name') }}</span>             
              </section>
              <section class="login_verification">
                <input :type="isShowPwd? 'text':'password'" maxlength="8" placeholder="密码" v-model="pwd" name="pwd" v-validate="'required'"/>
                <span style="color: red;" v-show="errors.has('pwd')">{{ errors.first('pwd') }}</span>
                
                <div
                  class="switch_button"
                  :class="isShowPwd? 'on':'off'"
                  @click="isShowPwd = !isShowPwd"
                >
                  <div class="switch_circle" :class="{right:isShowPwd}"></div>
                  <span class="switch_text">{{isShowPwd?'abc':'...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha"/>
                <img class="get_verification" src="http://localhost:5000/captcha" alt="captcha" 
                ref="myCodeImage" @click.prevent="updataImage"/>
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back('/profile')">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
//import { setInterval, clearInterval } from 'timers';
import { reqSendCode, reqPwdLogin, reqSmsLogin } from '../../api'


export default {
  data() {
    return {
      isLoginType: true, //登录的类型  true: 短信登陆, false: 密码登陆
      phone: "", //手机号
      code:"", //验证码

      name: "",
      pwd : "",
      captcha: "",

      sendTime: 0, // 计时剩余的时间, 为0时没有计时了
      isShowPwd: false // 是否显示密码, 默认不显示
    };
  },
  computed: {
    isRightPhone() {
      //判断手机号是否正确
      return /^1\d{10}$/.test(this.phone);
    }
  },
  methods: {
    //1. 点击获取验证码的
    async sendCode() {
      //倒计时时间
      this.sendTime = 5;

      const timeId = setInterval(() => {
        this.sendTime--;
        if (this.sendTime === 0) {
          clearInterval(timeId);
        }
      }, 1000);

      //发送验证码 ajax请求
      const result = await reqSendCode(this.phone)
      if(result.code === 0){
        alert('短信验证码已发送')
      }else{
        alert(result.msg)
      }

    },

    //2. 一次性获取图形验证码  [？后面的名字随便起，时间戳不会被解析]
    updataImage(){
      // 给img指定一个新的src值, 携带一个时间戳的参数
      this.$refs.myCodeImage.src = 'http://localhost:5000/captcha?time=' + Date.now()
    },

    //3. 登录 用户名密码  手机号短信
    async login(){
      const { isLoginType, phone, code, name, pwd, captcha } = this
      let names
      if (isLoginType) { 
        names = ['phone', 'code']
      } else {
        names = ['name', 'pwd', 'captcha']
      }
      // 进行统一的前台表单验证
      const success = await this.$validator.validateAll(names)

      // 验证通过后发ajax请求
      if (success) {
        //alert('发送登陆的请求')      
        let result 
        if(isLoginType){  //短信登录
          result = await reqSmsLogin({ phone, code })
        }else{
          result = await reqPwdLogin({name, pwd, captcha})
        }

         //登录成功时
        if(result.code === 0){
          //1.保存用户信息到state中，2.跳转到个人中心界面
          const user = result.data
          this.$store.dispatch('recodeUser',user)

          // 2.跳转到个人中心界面
          this.$router.replace('/profile')
        }else{
          alert(result.msg)
        }
        
      }
      
     
    }

  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';

.loginContainer {
  width: 100%;
  height: 100%;
  background: #fff;

  .loginInner {
    padding-top: 60px;
    width: 80%;
    margin: 0 auto;

    .login_header {
      .login_logo {
        font-size: 40px;
        font-weight: bold;
        color: #02a774;
        text-align: center;
      }

      .login_header_title {
        padding-top: 40px;
        text-align: center;

        >a {
          color: #333;
          font-size: 14px;
          padding-bottom: 4px;

          &:first-child {
            margin-right: 40px;
          }

          &.on {
            color: #02a774;
            font-weight: 700;
            border-bottom: 2px solid #02a774;
          }
        }
      }
    }

    .login_content {
      >form {
        >div {
          display: none;

          &.on {
            display: block;
          }

          input {
            width: 100%;
            height: 100%;
            padding-left: 10px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 4px;
            outline: 0;
            font: 400 14px Arial;

            &:focus {
              border: 1px solid #02a774;
            }
          }

          .login_message {
            position: relative;
            margin-top: 16px;
            height: 48px;
            font-size: 14px;
            background: #fff;

            .get_verification {
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%);
              border: 0;
              color: #ccc;
              font-size: 14px;
              background: transparent;

              &.right_phone_number {
                color: black;
              }
            }
          }

          .login_verification {
            position: relative;
            margin-top: 16px;
            height: 48px;
            font-size: 14px;
            background: #fff;

            .switch_button {
              font-size: 12px;
              border: 1px solid #ddd;
              border-radius: 8px;
              transition: background-color 0.3s, border-color 0.3s;
              padding: 0 6px;
              width: 30px;
              height: 16px;
              line-height: 16px;
              color: #fff;
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%);

              &.off {
                background: #fff;

                .switch_text {
                  float: right;
                  color: #ddd;
                }
              }

              &.on {
                background: #02a774;
              }

              >.switch_circle {
                // transform translateX(27px)
                position: absolute;
                top: -1px;
                left: -1px;
                width: 16px;
                height: 16px;
                border: 1px solid #ddd;
                border-radius: 50%;
                background: #fff;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
                transition: transform 0.3s;

                &.right {
                  transform: translateX(27px);
                }
              }
            }
          }

          .login_hint {
            margin-top: 12px;
            color: #999;
            font-size: 14px;
            line-height: 20px;

            >a {
              color: #02a774;
            }
          }
        }

        .login_submit {
          display: block;
          width: 100%;
          height: 42px;
          margin-top: 30px;
          border-radius: 4px;
          background: #4cd96f;
          color: #fff;
          text-align: center;
          font-size: 16px;
          line-height: 42px;
          border: 0;
        }
      }

      .about_us {
        display: block;
        font-size: 12px;
        margin-top: 20px;
        text-align: center;
        color: #999;
      }
    }

    .go_back {
      position: absolute;
      top: 5px;
      left: 5px;
      width: 30px;
      height: 30px;

      >.iconfont {
        font-size: 20px;
        color: #999;
      }
    }
  }
}
</style>
