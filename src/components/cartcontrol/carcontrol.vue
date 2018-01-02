<template>
	<div class="cartcontrol">
		<transition name="roll" appear>
			<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCount">
				<i class="icon-remove_circle_outline"></i>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
		<div class="cart-add" @click.stop.prevent="addCart">
			<i class="icon-add_circle"></i>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	export default{
		props: {
			food:{
				type: Object
			}
		},
		mounted(){
			// console.log(this.food)
		},
		methods:{
			addCart(event){
				if(!event._constructed){
					return
				}
				if(!this.food.count){
					Vue.set(this.food, 'count', 1);
				}else{
					this.food.count++
				}
				this.$emit('add',event.target);
			},
			decreaseCount(){
				if(!event._constructed){
					return
				}
				if(this.food.count){
					this.food.count--
				}
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	.roll-enter-active, .roll-leave-active
		transition: all .3s linear
	.roll-enter
		transform: translateX(24px)
	.roll-enter-to
		transform: rotate(180deg)
	.roll-leave-to
		transform: translateX(24px) rotate(180deg)



	.cartcontrol
		font-size: 0
		.cart-decrease, .cart-add
			display: inline-block
			padding: 6px
			font-size: 24px
			line-height: 24px
			color: rgb(0, 160, 220)
		.cart-count
			display: inline-block
			vertical-align: top
			width: 12px
			height: 12px
			padding-top: 6px
			line-height: 24px
			text-align: center
			font-size: 10px
			color: rgb(147, 153, 159)
</style>