<template>
	<transition name="move">
		<div class="food" v-show="showFlag" ref="food">
			<div class="food-content">
				<div class="food-img">
					<img :src="food.image">
					<div class="back" @click="backFlag">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{ food.name }}</h1>
					<div class="detail">
						<span class="sellCount">月售{{ food.sellCount }}份</span><span class="rating">好评率{{ food.rating }}%</span>
					</div>
					<div class="price">
						<span class="nowPrice">￥{{ food.price }}</span><span class="oldPrice" v-if="food.oldPrice">￥{{ food.oldPrice }}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<v-cartcontrol @add="addCart" :food="food"></v-cartcontrol>
					</div>
					<transition name="buy">
						<div class="buy" @click="firstBuy" v-show="!food.count || food.count === 0">加入购物车</div>
					</transition>
				</div>
				<v-hr></v-hr>
				<div class="info">
					<h1 class="title">商品介绍</h1>
					<p class="desc">{{ food.info }}</p>
				</div>
				<v-hr></v-hr>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<v-ratingselected @changeOnly="changeOnlyType" @changType="selectTypeChange" :ratings="food.ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc"></v-ratingselected>
				</div>
				<div class="ratings-wrapper">
					<ul v-show="food.ratings && food.ratings.length">
						<li v-for="rating in food.ratings" class="rating-item" v-if="ratingShow(rating.text,rating.rateType)">
							<div class="user">
								<span class="name">{{rating.username}}</span>								
								<img :src="rating.avatar" width="12" height="12" class="avatar">
							</div>
							<div class="time">{{ rating.rateTime | formatDate }}</div>							
							<p class="text">
							<i :class="{'icon-thumb_down':rating.rateType===1,'icon-thumb_up':rating.rateType===0}"></i>	
							<span class="ratingText">{{ rating.text }}</span>
							</p>
						</li>
					</ul>
					<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评论</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import Vue from "vue"
import Bscroll from "better-scroll"
import vCartcontrol from "../../components/cartcontrol/carcontrol.vue"
import vHr from "../../components/split/spilt.vue"
import vRatingselected from "../../components/ratingselected/ratingselected.vue"

import {formatBasicDate} from "../../common/js/formateBasicDate.js"

	const ALL = 2
	const NEGATIVE = 1
	const POSITIVE = 0


	export default{
		props: {
			food: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: true,
				desc:{
					'all': '全部',
					'positive': '推荐',
					'negative': '吐槽'
				}
			}
		},
		methods: {
			taggleFlag() {
				this.showFlag = true;
				this.selectType = ALL;
				this.onlyContent = true;
				this.desc = {
					'all': '全部',
					'positive': '推荐',
					'negative': '吐槽'
				}
				this.$nextTick(()=>{
					if(!this.foodScroll){
						this.foodScroll = new Bscroll(this.$refs.food,{
							click: true
						})
					}else{
						this.foodScroll.refresh()
					}
					})
			},
			backFlag(){
				this.showFlag = false;
			},
			addCart(target){
				this.$emit('add',target);
			},
			firstBuy(event){
				if (!event._constructed) {
          return;
        }
        console.log('yo');
				Vue.set(this.food, 'count', 1);
				this.$emit('add',event.target);
			},
			selectTypeChange(index){
				this.selectType = index;
				this.$nextTick(()=>{
					this.foodScroll.refresh()
				})
			},
			changeOnlyType(){
				this.onlyContent = !this.onlyContent;
				this.$nextTick(()=>{
					this.foodScroll.refresh()
				})
			},
			ratingShow(text,type){
				if(this.onlyContent && !text){
					 return false
				}
				if(this.selectType === ALL ){
				 return true
				}else{
					return this.selectType === type
				}
			}
		},
		filters:{
			formatDate(date){
				let dateChange = new Date(date)
				return formatBasicDate(dateChange, 'yyyy-MM-dd hh:mm')
			}
		},
		components:{
			vCartcontrol,
			vHr,
			vRatingselected
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	.food
		position: fixed
		top: 0
		left: 0
		bottom: 48px
		z-index: 30
		width: 100%
		background: #fff
		&.move-enter-active, &.move-leave-active
			transition: all .2s linear
		&.move-enter, &.move-leave-to
			transform: translateX(100%)
		.food-content
			.food-img
				position: relative
				width: 100%
				height: 0
				padding-top: 100%
				img
					position: absolute
					top: 0
					left: 0
					width: 100%
					height: 100%
				.back
					position: absolute
					top: 5px
					left: 0
					padding: 10px
					.icon-arrow_lift
						font-size: 18px
						color: #fff
		.content
			position: relative
			padding: 18px
			font-weight: 700
			.title
				line-height: 14px
				font-size: 14px
				color: rgb(7, 17, 27)
				margin-bottom: 8px
			.detail
				margin-bottom: 18px
				line-height: 10px
				font-size: 10px
				color: rgb(147, 153, 159)
				.sellCount, .rating
					margin-right: 12px
					font-weight: 200
			.price
				line-height: 24px
				.nowPrice
					margin-right: 8px
					font-size: 14px
					color: rgb(240, 20, 20)
				.oldPrice
					font-size: 10px
					color: rgb(147, 153, 159)
					text-decoration: line-through
			.cartcontrol-wrapper
				position: absolute
				right: 12px
				bottom: 12px
			.buy
				position: absolute
				right: 18px
				bottom: 20px
				z-index: 10
				height: 24px
				line-height: 24px
				padding:0 12px
				border-radius: 12px
				font-size: 10px
				color: #fff
				background: rgb(0, 160, 220)
				&.buy-enter-active, &.buy-leave-active
					transition: all .1s ease
				&.buy-enter, &.buy-leave-to
					opacity: 0
		.info
			padding: 18px
			.title
				font-size: 14px
				font-weight: 700
				margin-bottom: 6px
				color: rgb(7, 17, 27)
			.desc
				padding: 0 6px
				font-size: 12px
				line-height: 24px
				font-weight: 200
				color: rgb(77, 85, 93)
		.rating
			padding-top: 18px
			.title
				font-size: 14px
				font-weight: 700
				margin-left: 18px
				color: rgb(7, 17, 27)
		.ratings-wrapper
			padding: 0 18px
			.rating-item
				position: relative
				padding: 16px 0px
				border-bottom: 1px solid rgba(7,17,27, .1)
				color: rgb(147, 153, 159)
				.user
					position: absolute
					top: 16px
					right: 0
					font-size: 0px
					.name
						display: inline-block
						vertical-align: top
						line-height: 12px
						font-size: 10px
						margin-right: 6px
					.avatar
						display: inline-block
						vertical-align: top
						width: 12px
						height: 12px
				.time
					line-height: 24px
					font-size: 10px
					margin-bottom: 6px
				.text
					line-height: 12px
					font-size: 0px
					.icon-thumb_down, .icon-thumb_up
						font-size: 12px
					.icon-thumb_up
						color: rgb(0, 160, 240)
					.ratingText
						font-size: 12px
						margin-left: 4px
			.no-rating
				padding: 16px 0
				font-size: 12px
				color: rgb(147, 153, 159)

</style>