<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{ seller.score }}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{ seller.rankRate }}%</div>
				</div>
				<div class="overview-right">
					<div class="star-wrapper">
						<span class="title">服务态度</span>
						<v-star :score="seller.serviceScore" :size="36"></v-star>
						<span class="score">{{ seller. serviceScore}}</span>
					</div>
					<div class="star-wrapper">
						<span class="title">商品评分</span>
						<v-star :score="seller.foodScore" :size="36"></v-star>
						<span class="score">{{ seller. foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery-time">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<v-hr></v-hr>
			<v-selected @changeOnly="changeOnlyType" @changType="selectTypeChange" :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc"></v-selected>
			<ul class="ratings-wrapper">
				<li v-for="(rating, index) in ratings" class="rating-item" v-show="itemShow(rating.text,rating.rateType)">
					<div class="avatar">
						<img :src="rating.avatar" width="28" height="28">
					</div>
					<div class="content">
						<h1 class="name">{{rating.username }}</h1>
						<div class="star-detail">
							<v-star :size="24" :score="rating.score"></v-star>
							<span class="delivery-time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
						</div>
						<p class="text">{{ rating.text }}</p>
						<div class="recommend-wrapper">
							<i :class="{'icon-thumb_down':rating.rateType===1,'icon-thumb_up':rating.rateType===0}"></i>
							<span class="recommend-item" v-for="item in rating.recommend">{{ item }}</span>
						</div>
						<div class="time">
							{{ rating.rateTime | formateDate }}
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import Bscroll from "better-scroll"
	import vStar from "../../components/star/star.vue"
	import vHr from "../../components/split/spilt.vue"
	import vSelected from "../../components/ratingselected/ratingselected.vue"

	import {formatBasicDate} from "../../common/js/formateBasicDate.js"

	const ERR_OK = 0

	export default{
		props:{
			seller:{
				type: Object,
				default(){
					return{}
				}
			}
		},
		data(){
			return{
				ratings:[],
				onlyContent: true,
				selectType: 2,
				desc: {
					'all': '全部',
					'positive': '满意',
					'negative': '不满意'
				}
			}
		},
		components:{
			vStar,
			vHr,
			vSelected
		},
		methods:{
			getData(){
				this.$http.get('/api/ratings').then((res)=>{
					if(res.data.errno === ERR_OK){
						this.ratings = res.data.data;
					}
					this.ratingsScroll = new Bscroll(this.$refs.ratings,{
						click: true
					})
				})
			},
			selectTypeChange(index){
				this.selectType = index;
				this.$nextTick(()=>{
					this.ratingsScroll.refresh()
				})
			},
			changeOnlyType(){
				this.onlyContent = !this.onlyContent;
				this.$nextTick(()=>{
					this.ratingsScroll.refresh()
				})
			},
			itemShow(text,type){
				if(this.onlyContent && !text){
					return false;
				} 
				if(this.selectType === 2){
					return true
				}else{
					return this.selectType === type
				}
			}
		},
		mounted(){
			this.getData()
		},
		filters:{
			formateDate(date){
				let dateNormal = new Date(date);
				return formatBasicDate(dateNormal, 'yyyy-MM-dd hh:mm')
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scopde>
		.ratings
			position: absolute
			left: 0
			top: 174px
			bottom: 0
			width: 100%
			overflow: hidden
			.overview
				display: flex
				padding: 18px 0
				.overview-left
					flex: 0 0 137px
					width: 137px
					padding: 6px 0
					border-right: 1px solid rgba(7, 17, 27, 0.1)
					text-align: center
					.score
						margin-bottom: 6px
						font-size: 24px
						line-height: 28px
						color: rgb(255, 153, 0)
					.title
						margin-bottom: 8px
						font-size: 12px
						line-height: 12px
						color: rgb(7, 17, 27)
					.rank
						font-size: 10px
						line-height: 10px
						color: rgb(147, 153, 159)
				.overview-right
					flex: 1
					padding: 6px 0px 6px 24px
					.star-wrapper
						margin-bottom: 8px
						font-size: 0
						.title
							display: inline-block
							vertical-align: top
							font-size: 12px
							line-height: 18px
							color: rgb(7, 17, 27)
						.stars
							display: inline-block
							margin: 0 12px
							vertical-align: top
						.score
							display: inline-block
							vertical-align: top
							font-size: 12px
							line-height: 18px
							color: rgb(255, 153, 0)
					.delivery-wrapper
						font-size: 0
						.title, .delivery-time
							font-size: 12px
							line-height: 18px
						.title
							color: rgb(7, 17, 27)
							margin-right: 12px
						.delivery-time
							color; rgb(255, 153, 0)
			.ratings-wrapper
				padding: 0 18px
				.rating-item
					display: flex
					padding: 18px 0
					border-bottom: 1px solid rgba(7, 17, 27, .1)
					.avatar
						flex: 0 0 28px
						width: 28px
						padding-right: 12px
						img
							border-radius: 50%
					.content
						flex: 1
						position: relative
						.name
							margin-bottom: 4px
							font-size: 10px
							line-height: 12px
							color: rgb(7, 17, 27)
						.star-detail
							margin-bottom: 6px
							font-size: 0
							.stars
								display: inline-block
								vertical-align: top
								margin-right: 6px
							.delivery-time
								display: inline-block
								vertical-align: top
								font-size: 10px
								font-weight: 200
								line-height: 12px
								color: rgb(147, 153, 159)
						.text
							margin-bottom: 8px
							font-size: 12px 
							line-height: 18px
							color: rbg(7, 17, 27)
						.recommend-wrapper
							font-size: 0
							.icon-thumb_down, .icon-thumb_up
								display: inline-block
								vertical-align: top
								font-size: 12px
								line-height: 16px
								color: rgb(183, 187, 191)
								margin-right: 8px
							.icon-thumb_up
								color: rgb(0, 160, 240)
							.recommend-item
								display: inline-block
								vertical-align: top
								padding: 0 6px
								border: 1px solid rgba(7, 17, 27, .1)
								border-radius: 1px
								font-size: 9px
								line-height: 16px
								color: rgb(147, 153, 159)
								margin-right: 8px
						.time
							position: absolute
							right: 0
							top: 0
							font-size: 10px
							line-height: 12px
							color: rbg(147, 153, 159)

									
</style>	