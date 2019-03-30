<script>
import { getOpenid } from "@/api/wx";
export default {
  created() {
    this.extConfig = wx.getExtConfigSync();
    // console.log('ext中的数据===',this.extConfig);
    console.log("远邻欢迎您！");
    wx.cloud.init({
      traceUser: true,
      env: "wjk-json"
    });
    let openid = wx.getStorageSync("openid");
    if (!openid) {
      getOpenid().then(res => {
        if (res.errMsg == "cloud.callFunction:ok")
          wx.setStorageSync("openid", res.result.event.userInfo.openId);
      });
    }
    // wx.getUserInfo({
    //     // withCredentials: false,
    //     success: res => {
    //         console.log("登录接口",res)
    //     },
    //     fail: res => {console.log("登录接口",res)},
    //     complete: res => {console.log("登录接口",res)}
    // });
  }
};
</script>

<style lang="scss">
page {
  background-color: #f2f2f2;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
}
button::after {
  border: none;
}
</style>
