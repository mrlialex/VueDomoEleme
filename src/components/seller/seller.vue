<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{ seller.name }}</h1>
				<div class="detail border-1px">
					<v-star :size="36" :score="seller.score"></v-star>
					<span class="rank">({{ seller.ratingCount }})</span>
					<span class="count">月售{{ seller.sellCount }}单</span>
				</div>
				<ul class="price-wrapper">
					<li class="price-item">
						<h2 class="title">起送价</h2>
						<span class="price"><span class="price-num">{{ seller.minPrice }}</span>元</span>
					</li>
					<li class="price-item">
						<h2 class="title">商家配送</h2>
						<span class="price"><span class="price-num">{{ seller.deliveryPrice }}</span>元</span>
					</li>
					<li class="price-item">
						<h2 class="title">平均配送时间</h2>
						<span class="price"><span class="price-num">{{ seller.deliveryTime }}</span>分钟</span>
					</li>
				</ul>
				<div class="favorite" @click="toggleFavoriteFlag">
					<i class="icon-favorite" :class="{'on' : favoriteFlag}"></i>
					<span class="text">{{ favoriteText }}</span>
				</div>
			</div>
			<v-hr></v-hr>
			<div class="bulletin">
				<h2 class="title">公告与活动</h2>
				<div class="content-wrapper border-1px">
					<p class="content">
						{{ seller.bulletin }}
					</p>
				</div>
				<ul v-if="seller.supports" class="supports">
						<li v-for="(support,index) in seller.supports" class="support-item border-1px">
							<span class="icon" :class="classMap[seller.supports[index].type]"></span>
							<span class="text">{{ seller.supports[index].description }}</span>
						</li>
					</ul>
			</div>
			<v-hr></v-hr>
			<div class="sellerpic">
				<h2 class="title">商家实景</h2>
				<div class="pics-wrapper" ref="pic">
				<ul class="pics-box" ref="picList">
					<li class="pic" v-for="pic in seller.pics">
						<img :src="pic" width="120" height="90">
					</li>
				</ul>
			</div>
			</div>
			<v-hr></v-hr>
			<div class="info">
				<h2 class="title border-1px">商家信息</h2>
				<ul class="info-box">
					<li class="info-item border-1px" v-for="info in seller.infos">{{ info }}</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import vStar from "../../components/star/star.vue"
	import vHr from "../../components/split/spilt.vue"

	import Bscroll from "better-scroll"

	import { saveToLocal, loadFromLocal } from "../../common/js/store.js"

	export default{
		props:{
			seller:{
				type: Object
			}
		},
		mounted(){
			this._sellerScroll();
			this._picScroll();
		},
		methods:{
			_sellerScroll(){
				if(!this.sellerScroll){
				this.sellerScroll = new Bscroll(this.$refs.seller,{
					click: true
				})
				}else{
				this.sellerScroll.refresh()
				}
			},
			_picScroll(){
				if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new Bscroll(this.$refs.pic, {
                scrollX: true,
                eventPassthrough: 'vertical'
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      },
      toggleFavoriteFlag(){
      	this.favoriteFlag = !this.favoriteFlag;
      	saveToLocal(this.seller.id, 'favorite', this.favoriteFlag);
      }
		},
		watch:{
			'seller'(){
				this._sellerScroll();
				this._picScroll();
			}
		},
		data(){
			return{
				classMap: ['decrease','discount','special','invoice','guarantee'],
				favoriteFlag: (()=>{
					return loadFromLocal(this.seller.id, 'favorite', false);
				})()
			}
		},
		computed:{
			favoriteText(){
				return this.favoriteFlag? '已收藏' : '收藏' ;
			}
		},
		components:{
			vStar,
			vHr
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scopde>
@import "../../common/stylus/index.styl"
	.seller
		position: absolute
		top: 174px
		bottom: 0px
		width: 100%
		overflow: hidden
		.overview
			position: relative
			padding: 18px 18px 0 18px
			.title
				font-size: 14px
				font-weight: 500
				line-height: 14px
				color: rgb(7, 17, 27)
				margin-bottom: 8px
			.detail
				padding-bottom: 18px
				border-1px(rgba(7, 17, 27, .1))
				font-size: 0
				.stars, .rank, .count
					display: inline-block
					vertical-align: top
				.stars
					margin-right: 8px
				.rank, .count
					font-size: 10px
					line-height: 18px
					color: rgb(77, 85, 93)
					margin-right: 12px
			.price-wrapper
				display: flex
				padding: 18px 0
				.price-item
					flex: 1
					display: block
					text-align: center
					border-right: 1px solid rgba(7, 17, 27, .1)
					&:last-child
						border: none
					.title
						font-size: 10px
						line-height: 10px
						color: rgb(147, 153, 159)
						margin-bottom: 4px
					.price
						font-size: 10px
						color: rgb(7, 17, 27)
						line-height: 24px
						.price-num
							font-size: 24px
			.favorite
				position: absolute
				width: 30px
				top: 21px
				right: 18px
				.icon-favorite
					display: block
					font-size: 24px
					line-height: 24px
					text-align: center
					color: #d4d6d9
					margin-bottom: 4px
					&.on
						color: rgb(240, 20, 20)
				.text
					display: block
					font-size: 10px
					line-height: 10px
					color: rgb(77, 85, 93)
					text-align: center


		.bulletin
			padding: 18px 18px 0 18px
			.title
				font-size: 14px 
				font-weight: 500
				line-height: 14px 
				color: rgb(7, 17, 27)
				margin-bottom: 8px
			.content-wrapper
				padding: 0px 12px 16px 12px
				border-1px(rgba(7,17,27,.1))
				.content
					font-size: 12px
					line-height: 24px
					font-weight: 200
					color: rgb(240, 20, 20)
			.support-item
				padding: 16px 12px
				border-1px(rgba(7,17,27,.1))
				&:last-child
					border-none()
				.icon
					display:inline-block
					width:16px
					height:16px
					vertical-align: top
					margin-right:6px
					background-size : 16px 16px
					background-repeat:no-repeat
					&.decrease
						bg-image('decrease_4')
					&.discount
						bg-image('discount_4')
					&.guarantee
						bg-image('guarantee_4')
					&.invoice
						bg-image('invoice_4')
					&.special
						bg-image('special_4')
				.text
					line-height:16px
					font-size:12px	
					color: rgb(7,17,27)
		.sellerpic
			padding: 18px
			.title
				font-size: 14px 
				font-weight: 500
				line-height: 14px 
				color: rgb(7, 17, 27)
				margin-bottom: 12px
			.pics-wrapper
				width: 100%
				overflow: hidden
				white-space: nowrap
				.pics-box
					font-size: 0
					.pic
						display: inline-block
						margin-right: 6px
						width: 120px
						height: 90px
						&:last-child
							margin: 0
		.info
			padding: 18px 18px 0 18px
			.title
				padding-bottom: 12px
				font-size: 14px 
				font-weight: 500
				line-height: 14px 
				color: rgb(7, 17, 27)
				margin-bottom: 8px
				border-1px(rgba(7,17,27,.1))
			.info-item
				padding: 16px 12px
				border-1px(rgba(7,17,27,.1))
				font-size: 12px
				line-height: 16px
				font-weight: 200
				color: rgb(7, 17, 27)
</style>