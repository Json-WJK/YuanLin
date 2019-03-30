<template>
  <div class="redact">
    <!-- 顶部切换导航栏 -->
    <div class="navigation">
      <div class="cancel" @click="quit">取消</div>
      <div class="way">
        <span
          class="open"
          @click="ifyWay('open')"
          :style="{
					color:way == 0 ? 'rgb(255, 204, 63)' : '',
					borderBottom:way == 0 ?'1rpx solid rgb(255, 204, 63)' : ''
				}"
        >公开</span>
        <span
          class="secret"
          @click="ifyWay('secret')"
          :style="{
					color:way == 1 ? 'rgb(255, 204, 63)' : '',
					borderBottom:way == 1 ?'1rpx solid rgb(255, 204, 63)' : ''
				}"
        >私密</span>
      </div>
      <div class="publish" @click="affirm">发布</div>
    </div>
    <!-- 文本框 -->
    <textarea placeholder="记录这一刻，晒给懂你的人....." v-model="text"/>
    <!-- 上传视频或图片 -->
    <div class="up">
      <div v-for="(item,index) in UpImgs" :key="index">
        <img 
          :src="item" 
          lazy-load
					mode="aspectFill"
        alt>
      </div>
      <div class="tacitly" @click="up">
        <img 
          src="cloud://wjk-json.776a-wjk-json/默认图片/发表界面图片/添加图片.png" 
          lazy-load
          alt
        >
      </div>
    </div>
    <!-- 底部弹出层  选择图片或视频 -->
    <div class="popup" :style="{top:ispopup ? '0' : '100%'}" @click="QuitPopup($event)">
      <div>
        <ul>
          <li v-for="(item,index) in popup" :key="index">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { addFriendContent, UpImages , addSquareSddition } from "@/api/wx";
export default {
  data() {
    return {
      text: "", //文本框值
      way: 0, //顶部分类导航
      popup: ["选择图片", "选择视频", "取消"], //弹出层内容
      ispopup: false, //弹出层显示隐藏
      UpImgs: [], //上传的图片集
      UpVideos: [] //上传的视频集
    };
  },
  methods: {
    affirm() {
      //确认发布
      if (
        this.text == "" &&    //文字
        this.UpImgs.length == 0 &&   //图片
        this.UpVideos.length == 0   //视频
			)	return;
			wx.showLoading({
				title: '发布中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			let content = {};
			content.text = this.text;
      content.imgsUrl = []; //图片
			content.videoUrl = []; //视频
      let pro = new Promise((resolve,reject)=>{
				if(!this.UpImgs.length) resolve() //如果没有图片则跳过
				let n = 0
				for (let item of this.UpImgs) {
					let name = Math.random() * 1000000;  //随机生成图片名称
					let cloudPath = '默认图片/用户发表AV/' + name + item.match(/\.[^.]+?$/)[0];
					wx.cloud.uploadFile({
						//发表时上传
						cloudPath, // 上传至云端的路径
						filePath: item, // 小程序临时文件路径
						success: res => {
							content.imgsUrl.push(res.fileID)
							if(content.imgsUrl.length == this.UpImgs.length){
								resolve()
							}
						}
					});
				}
			}) 
      pro.then(() => {
				// console.log(content,"插入数据")
				addFriendContent(content).then(res => {   //发布
					if (res.errMsg == "collection.add:ok") {
            addSquareSddition(res._id).then( addition => {  //发布附加属性
              console.log(addition)
            })
            console.log(res._id,"发布成功")
						wx.showToast({
							title: '发布成功', //提示的内容,
							icon: 'success', //图标,
							duration: 1500, //延迟时间,
							mask: true, //显示透明蒙层，防止触摸穿透,
						})
					}else{
						wx.showToast({
							title: '发布失败', //提示的内容,
							icon: 'none', //图标,
							duration: 150, //延迟时间,
							mask: true, //显示透明蒙层，防止触摸穿透,
						});
					}
				});
        wx.hideLoading()
        wx.setStorageSync('refresh',true)
				Object.assign(this, this.$options.data());
				this.$router.push({ path: "/pages/friend", isTab: true });
			})
    },
    ifyWay(way) {
      //切换发表方式
      if (way == "open") {
        this.way = 0;
      }
      if (way == "secret") {
        this.way = 1;
      }
    },
    up(e) {
      //弹出层
      this.ispopup = true;
    },
    QuitPopup(e) {
      //退出弹出层
      let touch = new Date();
        // console.log(e.mp._relatedInfo.anchorTargetText, item);
      if (e.mp._relatedInfo.anchorTargetText === "选择视频") {
        wx.showModal({
          title: '抱歉', 
          content: '功能还没有开放哦！', 
          showCancel: false, 
          confirmText: '我知道了', 
          confirmColor: '#3CC51F', 
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        });
        return
        wx.chooseVideo({
          //视频
          sourceType: ["album", "camera"],
          maxDuration: 60,
          camera: "back",
          success: res => {
            this.UpVideos.push(...res.tempFilePath);
          }
        });
      } 
      if (e.mp._relatedInfo.anchorTargetText === "选择图片") {
        wx.chooseImage({
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"],
          success: res => {
            // tempFilePath可以作为img标签的src属性显示图片
            this.UpImgs.push(...res.tempFilePaths);
            // UpImages(res.tempFilePaths[0]).then(res => {
            // 	console.log(res,"上传图片")
            // })
            // console.log(this.UpImgs);
          }
        });
      }
      this.ispopup = false;
    },
    quit() {
      //取消 返回广场
      Object.assign(this, this.$options.data());
      // wx.setStorageSync('refresh',true)
      this.$router.push({ path: "/pages/friend", isTab: true });
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
.redact {
  background: #fff;
  .navigation {
    //顶部切换导航栏
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    display: flex;
    justify-content: space-evenly;
    background: #fff;
    text-align: center;
    position: relative;
    box-shadow: rgb(200, 200, 200) 0rpx 0rpx 30rpx;
    .way {
      width: 40%;
      span {
        display: inline-block;
        box-sizing: border-box;
        width: 30%;
      }
      .open {
        margin-right: 10rpx;
      }
      .secret {
        margin-left: 10rpx;
      }
    }
    .cancel {
      position: absolute;
      left: 20rpx;
    }
    .publish {
      position: absolute;
      right: 20rpx;
    }
  }
  textarea {
    //文本框
    width: 100%;
    padding: 10rpx;
  }
  .up {
    //上传图片和视频
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 0 35rpx;
    // background: red;
    div {
      width: 33%;
      height: 225rpx;
      // background: #555;
      margin-bottom: 10rpx;
      img {
        width: 100%;
        height: 225rpx;
      }
    }
    div:not(:nth-child(3n + 3)) {
      margin-right: 3rpx;
    }
    .tacitly {
      background: #eee;
      text-align: center;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .popup {
    //弹出层  选择图片或视频
    position: fixed;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
    transition: 0.1s;
    div {
      width: 100%;
      height: 100%;
      position: relative;
      ul {
        position: absolute;
        bottom: 0;
        width: 100%;
        li {
          width: 100%;
          height: 100rpx;
          line-height: 100rpx;
          font-size: 30rpx;
          text-align: center;
          background: #fff;
        }
        li:last-child {
          margin-top: 10rpx;
        }
      }
    }
  }
}
</style>