<template>
	<div>
		<div class="goods">
			<div class="menu-wrapper" ref="menuWrapper">
				<ul>
					<li v-for="(good,index) in goods" class="menu-item" :class="{ 'current': index=== currentIndex }" @click="chooseMenu(index,$event)">
						<span class="text border-1px">
						<span v-if="good.type > 0" class="icon" :class="classMap[good.type]"></span>{{ good.name}}</span>
					</li>
				</ul>
			</div>
			<div class="foods-wrapper" ref="foodWrapper">
				<ul>
					<li v-for="good in goods" class="good-list border-1px good-list-hook">
						<h1 class="title">{{ good.name }}</h1>
						<ul>
							<li v-for="food in good.foods" class="food-item" @click="showMsg(food,$event)">
								<div class="icon">
									<img width="57" height="57" :src="food.icon">
								</div>
								<div class="content">
									<h2 class="name">{{ food.name }}</h2>
									<p class="desc" v-if="food.description">{{ food.description }}</p>
									<div class="extra">
										<span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}%</span>
									</div>
									<div class="price">
										<span class="now">￥{{ food.price }}</span><span class="old" v-if="food.oldPrice">￥{{ food.oldPrice }}</span>
									</div>
									<div class="cartcontrol-wrapper">
										<v-cartcontrol @add="addFood" :food="food"></v-cartcontrol>
									</div>								
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<v-shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :selectFoods="selectFoods"></v-shopcart>
		</div>
		<v-food :food="selectedFood" @add="addFood" ref="selectedFood"></v-food>
	</div>
</template>
<script>
import Bscroll from "better-scroll"
import vShopcart from "../shopcart/shopcart.vue"
import vCartcontrol from "../cartcontrol/carcontrol.vue"
import vFood from "../food/food.vue"

const ERR_OK = 0;

	export default{
		components:{
			vShopcart,
			vCartcontrol,
			vFood
		},
		props:{
			seller:{
				type:Object
			}
		},
		data(){
			return{
				classMap: ['decrease','discount','special','invoice','guarantee'],				
				goods: [],
				listHeight: [],
				scrollY: 0,
				selectedFood:{}
			}
		},
		computed:{
			currentIndex(){
				for(let i = 0; i < this.listHeight.length; i++){
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
						return i
					}
				}
					return 0
			},
			selectFoods(){
				let foods = [];
				this.goods.forEach((good)=>{
					good.foods.forEach((food)=>{
						if(food.count){
							foods.push(food);
						}
					})
				})
				return foods;
			}
		},
		mounted(){
			this.getGoods();
		},
		methods:{
			chooseMenu(index,event){
				if(!event._constructed){
					return
				}
				let goodList = this.$refs.foodWrapper.getElementsByClassName('good-list-hook');
				let el = goodList[index];
				this.foodScroll.scrollToElement(el,300);
			},
			getGoods(){
				this.$http.get('/api/goods').then((res)=>{
					if( res.data.errno === ERR_OK ){
						this.goods = res.data.data;
						this.$nextTick(()=>{
							this._initScroll()
							this._calculateHeight();
						});
					}
				})
			},
			_initScroll(){
				this.menuScroll = new Bscroll(this.$refs.menuWrapper, {
					click : true
				});
				this.foodScroll = new Bscroll(this.$refs.foodWrapper, {
					probeType: 3,
					click : true
				});

				this.foodScroll.on('scroll',(pos)=>{
					this.scrollY = Math.abs( Math.round(pos.y) );
				})
			},
			_calculateHeight(){
				let goodList = this.$refs.foodWrapper.getElementsByClassName('good-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for(let i = 0; i < goodList.length; i ++){
					height += goodList[i].clientHeight;
					this.listHeight.push(height);
				}
			},
			addFood(target){
				this.$nextTick(()=>{
					this._drop(target);
				})
			},
			_drop(target){
				this.$refs.shopcart.drop(target);
			},
			showMsg(food, event){
				if(!event._constructed) return
				this.selectedFood = food;
				this.$refs.selectedFood.taggleFlag();
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scopde>
	@import "../../common/stylus/index.styl"
	.goods
		display : flex
		position:absolute
		top:174px
		bottom:46px
		width:100%
		overflow:hidden
		.menu-wrapper
			flex: 0 0 80px
			width : 80px
			background : #f3f5f7
			.menu-item
				display:table
				height : 54px
				weight:56px
				line-height : 14px
				padding : 0 12px
				&.current
					position: relative
					z-index: 10
					margin-top: -1px
					background: #fff
					font-weight: 700
					.text
						boder-none()
				.icon
					display : inline-block
					vertical-align: top
					width : 12px
					height : 12px
					margin-right : 2px
					background-size : 12px 12px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
				.text
					display : table-cell
					width : 54px
					vertical-align: middle
					border-1px(rgba(7,17,27,.1))
					font-size : 12px
		.foods-wrapper
			flex : 1
			.title
				padding-left:14px
				height: 26px
				line-height:26px
				border-left: 2px solid #d9dde1
				font-size: 12px
				color:rgb(147,153,159)
				background: #f3f5f7
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px
				border-1px(rgba(7,17,27,.1))
				&:last-child
					border-none()
					margin-bottom:0
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					flex: 1
					.name
						margin: 2px 0px 8px 0px
						line-height: 14px
						font-size: 14px
						color: rgb(7, 17, 27)
					.decs
						line-height: 12px
					.extra
						line-height: 10px
					.desc, .extra
						margin-bottom: 8px
						font-size: 10px
						color: rgb(147, 153, 159)
						.count
							margin-right: 12px
					.price
						font-weight: 700
						line-height: 24px
						.now
							font-size: 14px
							color: rgb(240, 20, 20)
							margin-right: 12px
						.old
							text-decoration: line-through
							font-size: 10px
							color: rgb(147, 153, 159)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 12px
</style>