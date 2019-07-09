<template>
  <div>
    <FooterGuide v-if="$route.meta.isShowFooter"/>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import FooterGuide from './components/FooterGuide/FooterGuide.vue'

  export default {
    components:{
      FooterGuide
    },
    //实现自动登录，当自动登录 / 刷新时，还会显示名字或者手机号
    mounted(){
      this.$store.dispatch('autoLogin')
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

  
</style>

