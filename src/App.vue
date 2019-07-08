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
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

  
</style>

