<template>
  <section class="msite">
    <!--首页头部 全局组件-->
    <Header :title="address.name || '正在定位中'">
      <span class="header_search" slot="left">
        <i class="iconfont icon-sousuo"></i>
      </span>
      
      <span class="header_login" slot="right">
        <span class="header_login_text">登录|注册</span>
      </span>
    </Header>
    <!--首页导航-->
    <nav class="msite_nav">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(categorys,index) in categorysArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(c,index) in categorys" :key="index">
              <div class="food_container">
                <img :src="'https://fuss10.elemecdn.com' + c.image_url ">
              </div>
              <span>{{c.title}}</span>
            </a>
            
          </div>
          
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
    </nav>
    <!--首页附近商家-->
    <ShopList />
  </section>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex'
  import ShopList from '../../components/ShopList/ShopList.vue'
  import Swiper from 'swiper'
  import "swiper/dist/css/swiper.min.css"
  
  // var mySwiper = new Swiper ('.swiper-container', {   
  //     loop: true, // 循环模式选项    
  //     // 如果需要分页器
  //     pagination: {
  //       el: '.swiper-pagination',
  //     },   
  // }) 
  export default {
    computed:{
      ...mapState(['address','categorys']),

      //根据食品分类的一维数组，生成二维数组：轮播中的每一页都是1个数组，每一页中的列表也是1个数组
      //数组套着数组，二维数组
      categorysArr(){
        //1. 取出相关数据
        const bigArr = []
        let smallArr = []
        const {categorys} = this
        
        //2. 计算产生相关结果
        categorys.forEach(c => {
          if(smallArr.length === 0){
            bigArr.push(smallArr)           
          }

          smallArr.push(c)

          if(smallArr.length === 8){
            smallArr = []
          }
        });

        //3. 返回结果
        return bigArr
      }
    },
    // 轮播的 方式1 ---- watch + nextTick

    // watch:{  // 更新状态数据 ==> 立即同步调用监视的回调函数 ==> 异步更新界面        
    //   categorys(){
    //     this.$nextTick(()=>{  //$nextTick  回调函数在界面更新之后执行
    //       new Swiper('.swiper-container', {   
    //         loop: true, // 循环模式选项    
    //         // 如果需要分页器
    //         pagination: {
    //           el: '.swiper-pagination',
    //         }, 

    //       })
    //     })
    //   }
    // },

    async mounted(){      //---是在页面列表显示之后进行分页轮播
      // 静态页面轮播正常运行时，位置
      // var mySwiper = new Swiper('.swiper-container', {   
      //   loop: true, // 循环模式选项    
      //   // 如果需要分页器
      //   pagination: {
      //     el: '.swiper-pagination',
      //   }, 

      // })
      //1. 分发地址信息  【分发触发actions中方法的操作，在哪个组件中都可以使用，其他组件都可以读取到】
      this.$store.dispatch('getAddress') 
     
      //2. 分发商家列表
      this.$store.dispatch('getShops')

      //3. 分发食品分类列表  
      // this.$store.dispatch('getCategorys')   //与轮播方式1一起用

      //轮播的方式2 -----callback + nextTick()
      //  this.$store.dispatch("getCategorys", () => { // categorys状态数据更新了
      //   // 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
      //   this.$nextTick(() => { // 回调函数在界面更新之后执行
      //     new Swiper ('.swiper-container', {
      //       // direction: 'vertical', // 垂直切换选项
      //       loop: true, // 循环模式选项
      //       // 如果需要分页器
      //       pagination: {
      //         el: '.swiper-pagination',
      //       },
      //     })
      //   })
      // })  
      
      //轮播的方式3 ---- dispatch() 返回的是promise 
      await this.$store.dispatch('getCategorys')  
      new Swiper('.swiper-container', {   //方式3中的 await
        loop: true, // 循环模式选项    
        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
        }, 

      })

      


      /* 
        解决创建swiper对象之后不能正常轮播
        原因: 创建对象的时机太早(必须在列表显示之后)
        解决: 【状态数据变化 + 列表显示之后】
          1. watch + nextTick()
          2. callback + nextTick()
          3. 利用dispatch()返回的promise
      */

    },

    components:{
      ShopList
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl'

  .msite  //首页
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
</style>
