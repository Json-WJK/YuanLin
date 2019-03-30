<template>
  <div class="index">
    <swiper autoplay circular class="swiper">
        <block v-for="(item,index) in imgs" :key="index">
            <swiper-item>
                <img lazy-load :src="item.url" alt="">
            </swiper-item>
        </block>
    </swiper>
    <button open-type="getUserInfo" @getuserinfo="UserInfo">
      欢迎
    </button>
  </div>
</template>
<script>
import { getLoginSwiper,saveUserData,upUserData,getUserData } from '@/api/wx'
export default {
  data() {
    return {
      imgs:null,
    };
  },
  components: {},
  methods: {
    getSwiper(){ //轮播图
      getLoginSwiper().then(res => {
        this.imgs = res.data
      })
    },
    UserInfo(){  //用户授权 && （保存 || 更新）数据
      wx.getSetting({   //授权
        success(res) {
          // console.log(res)
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({    //获取信息
              success: res => {
                // console.log(res.userInfo)
                wx.setStorageSync('userInfo',JSON.stringify(res.userInfo))
                let pro = new Promise((resolve,reject) => {
                  getUserData().then( prores => {   //查询用户
                    // console.log(prores,"查询结果")
                    if(prores.data.length){
                      // console.log(prores.data.openid,"该用户已经注册")
                      resolve(prores)  
                    }else {
                      // console.log(prores,"该用户未注册")
                      reject(prores)
                    }
                  })
                })
                pro.then(resolveRes => {
                  upUserData(res.userInfo).then(user => {
                    // console.log(user,"更新用户信息")
                  })
                }).catch(rejectRes => {
                  res.userInfo.openid = wx.getStorageSync('openid');
                  saveUserData(res.userInfo).then(user => {
                    // console.log(user,'保存用户信息')
                  })
                })
                wx.switchTab({ url: '/pages/user' });
              }
            })
          }
        }
      })
    }
  },
  created() {
    this.getSwiper()
  }
}
</script>

<style scoped lang="scss">
.index {
  position: fixed;
  background: #FA7F59;
  width: 100%;
  height: 100%;
  .swiper{
    position: fixed;
    width:100%;
    height:100%;
      img{
        height:100%;
        width:100%;
      }
  }
  button{
    position: absolute;
    bottom: 40%;left: 50%;
    width:300rpx;
    margin:-150rpx;
    background: #FA7F59;
    color:#fff;
    box-shadow:rgb(87, 40, 24) 0rpx 0rpx 30rpx;
  }
}
</style>
