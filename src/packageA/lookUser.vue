<template>
  <div class="lookUser">
    <div class="userData" v-if="userData">
      <img class="bg_img" :src="userData.avatarUrl" alt="">
      <img class="avatarUrl" :src="userData.avatarUrl" alt="">
      <div class="nickName">{{userData.nickName}}</div>
      <div class="signature">{{userData.signature? userData.signature: '这个人很懒，什么也没留下！'}}</div>
      <div class="fans">2关注丨2184粉丝</div>
      <div class="attention">
        <div><span>+</span>&nbsp;<span>关注</span></div>
        <div><iconx type="xinfeng" size="30"></iconx>&nbsp;<span>私信</span></div>
      </div>
    </div>
    <div class="announce" v-if="UserMoment">
      <div v-for="(item,index) in UserMoment" :key="index" class="announce_at">
        <div class="announce_user">
          <img class="avatarUrl" :src="item.avatarUrl" alt="">
          <span class="nickName">{{item.nickName}}</span>
        </div>
        <div class="image">
          <img  
          v-for="(el,i) in item.content.imgsUrl" :key="i"
          :src="el" 
          :style="{
            width:item.content.imgsUrl.length > 1 ? '220rpx' : '350rpx',
            height:item.content.imgsUrl.length > 1 ? '220rpx' : '350rpx'
            }" 
          lazy-load
          mode="aspectFill"
          @click="LookImage(el,index)"
          alt >
        </div>
        <div class="text">{{item.content.text}}</div>
        <div class="date">
          <span>{{item.date}}</span>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>
<script>
import { getUserData, getUserMoment } from '@/api/wx'
import iconx from "../components/iconx";
export default {
  components:{
    iconx
  },
  data() {
    return {
      _openid:null,
      userData:null,//用户信息
      UserMoment:[],//用户瞬间
    }
  },
  methods: {
    getUserDataF() {   //获取用户信息
      getUserData(this._openid).then(res => {
        if (res.errMsg == "collection.get:ok") {
          this.userData = res.data[0]
          wx.setNavigationBarTitle({
            title: this.userData.nickName
          })
          console.log(res.data[0],"用户信息")
        }
      })      
    },
    getUserMomentF() {   //获取用户瞬间
      getUserMoment(this._openid).then( res=> {
        this.dateF(res)  //时间预格式化
        this.UserMoment = res
        console.log(res,"用户瞬间")
      })
    },
    LookImage(el,index){  //查看图片
			// console.log(el,"图片信息")
			wx.previewImage({
				current: el, 
				urls: this.UserMoment[index].content.imgsUrl 
			})
		},
    dateF(refresh){   //时间预格式化
    // console.log(refresh,"传入数据")
			for(let item of refresh){
        var time = new Date(item.date);
        // console.log(time)
				var y = time.getFullYear();
				var m = time.getMonth()+1;
				var d = time.getDate();
				var h = time.getHours();
				var mm = time.getMinutes();
				var s = time.getSeconds();
				if(h < 10) h = '0' + h 
				if(mm < 10) mm = '0' + mm
				item.date = y+'年'+m+'月'+d+'日 '+h+':'+mm;
			}
    },
  },
  mounted() {
    if (this.$route.query._openid) {
      console.log(this.$route.query._openid)
      this._openid = this.$route.query._openid
      this.getUserDataF()
      this.getUserMomentF()
    }
  },
}
</script>
<style lang="scss" scoped>
.lookUser{
  .userData{
    text-align: center;
    position: relative;
    height: 500rpx;
    div{
      position: absolute;
      top:0;left: 0;
      z-index: 555;
      width:100%;
    }
    .bg_img{
      position: absolute;
      width: 100%;
      height: 100%;
      top:0;left: 0;
      -webkit-filter: blur(20rpx); /* Chrome, Safari, Opera */
      filter: blur(20rpx);
    }
    .avatarUrl{
      position: absolute;
      width: 130rpx;
      height: 130rpx;
      border-radius: 50%;
      top:40rpx;
      margin: 0 auto;
      margin-left:-65rpx;
      z-index: 555;
    }
    .nickName{
      font-size: 40rpx;
      top:190rpx;
    }
    .signature{
      font-size: 26rpx;
      top: 250rpx;
    }
    .fans{
      top:320rpx;
    }
    .attention{
      top:410rpx;
      width:100%;
      height: 50rpx;
      display:flex;
      justify-content: space-around;
      div{
        position:none;
        width: 100rpx;
        height:40rpx;
        line-height: 40rpx;
        border-radius: 15rpx;
        color:#F68787;
        border:1rpx solid #F68787;
      }
      div:first-child{
        margin-left:245rpx;
      }
      div:last-child{
        margin-left:405rpx;
      }
    }
  }
  .announce{
    .announce_at:not(:last-child){
      .date{
        border-bottom:1rpx solid #eee;
      }
    }
    .announce_at{
      background: #fff;
      box-sizing: border-box;
      padding:0 30rpx;
      margin-bottom:10rpx;
      box-shadow:rgb(180,180,180) 0rpx 0rpx 10rpx;
      .announce_user{
        padding:20rpx 0;
        .avatarUrl{
          width: 50rpx;
          height: 50rpx;
          border-radius: 50%;
          vertical-align: middle;
        }
        .nickName{
          display: inline-block;
          margin-left: 20rpx;
          height: 50rpx;
          line-height: 50rpx;
          box-sizing:border-box;
          vertical-align: middle;
        }
      }
      .text {
        margin-bottom: 15rpx;
      }
      .image {
        display: flex;
        flex-wrap: wrap;
        img {
          width:280rpx;
            height: 280rpx;
            margin-right: 10rpx;
            padding: none;
            border-radius: 10rpx;
            margin-bottom: 10rpx;
        }
      }
      .date {
        margin-top: 20rpx;
        color:#666;
        font-size: 26rpx;
        box-sizing: border-box;
        padding-bottom:20rpx;
      }
    }
  }
}
</style>