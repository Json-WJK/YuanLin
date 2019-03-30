<template>
	<div class="signature">
		<input type="text" v-model="val" autofocus>
		<button @click="button">保存</button>
	</div>
</template>
<script>
import { setUserData,getUserData } from "@/api/wx"
export default {
	data(){
		return{
			val:''
		}
	},
	methods: {
		button(){
			// console.log(this.val)
			if(this.val == ''){
				wx.showModal({
					title: '确认', //提示的标题,
					content: '不想设置个性签名了吗？', //提示的内容,
					showCancel: true, //是否显示取消按钮,
					cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
					cancelColor: '#000000', //取消按钮的文字颜色,
					confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
					confirmColor: '#3CC51F', //确定按钮的文字颜色,
					success: res => {
						if (res.confirm) {
							this.$router.back()
						} else if (res.cancel) {
							
						}
					}
				});
			 return
			}
			setUserData(  //修改签名
				this.val
				).then( res => {
					wx.showToast({
						title: '更改成功', //提示的内容,
						icon: 'none', //图标,
						duration: 1000, //延迟时间,
						mask: true, //显示透明蒙层，防止触摸穿透,
						success: res => {}
					});
					setTimeout(() => {
						this.$router.back()
					}, 1000);
			})
		},
		getData(){
			getUserData().then(res => {  //获取当前签名
				this.val = res.data[0].signature
				// console.log("当前签名",res)
			})
		}
	},
	created() {
		this.getData()
	},
}
</script>
<style lang="scss">
	.signature{
		input{
			border-width:0;
			border-bottom:2rpx solid #D2DAE5;
			margin:10rpx auto 0;
			width: 95%;
			height:80rpx;
			padding:2rpx 10rpx 0;
			caret-color:#D2DAE5;
		}
		button{
			width:25%;
			height:70rpx;
			line-height:70rpx;
			text-align: center;
			margin: 15rpx auto 0;
			background: #D2DAE5;
			font-size: 28rpx;
		}
	}
</style>