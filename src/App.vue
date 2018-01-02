<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods" active-class="active">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" active-class="active">评价</router-link>        
      </div>
      <div class="tab-item">
        <router-link to="/seller" active-class="active">商家</router-link>        
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import vHeader from "./components/header/header.vue"
import { urlParse } from "./common/js/util.js"
const ERR_OK = 0;

export default {
  components:{
    vHeader
  },
  data(){
    return{
     seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
      }
    }
  },
  mounted(){
    this.getData()
  },
  methods:{
    getData(){
      this.$http.get('/api/seller?id='+this.seller.id).then((res)=>{
        if( res.data.errno === ERR_OK ){
          this.seller = Object.assign({}, this.seller, res.data.data)
        }
      })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/index"
  @import "./common/stylus/style.css"
  #app
    .tab
      display: flex
      width : 100%
      height : 40px
      line-height: 40px
      border-1px(rgba(7 , 17 , 27 , .1))
      .tab-item
        flex : 1
        text-align: center
        & > a
          display : block
          width : inherit
          height : inherit
          font-size : 14px
          color: rgb(77 , 85 ,93)
        .active
          color: rgb(240 , 20 ,20)

</style>
