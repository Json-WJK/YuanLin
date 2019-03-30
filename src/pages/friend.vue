<template>
  <div class="friend">
    <div :class="showOpen ? 'contentShow content' : 'content'">
      <!-- 内容区域 -->
      <div class="each" v-for="(item,index) in contents" :key="index">
        <!-- 每一个  -->
        <div class="Avatar">
          <img :src="item.avatarUrl" alt>
        </div>
        <div class="box">
          <ul>
            <li class="name">
              <span>{{item.nickName}}</span>
              <span class="delete" v-if="item._openid === openid" @click="change(index)">
                <iconx type="xiala-copy" size="55"></iconx>
                <div class="delete_lis" v-if="delete_at == index">
                  <div>编辑</div>
                  <div @click.stop="stateDelete(item._id,index)">删除</div>
                </div>
              </span>
            </li>
            <li class="date">{{item.date}}</li>
            <li class="imgsa">
              <img
                :src="el"
                alt
                v-for="(el,at) in item.content.imgsUrl"
                :key="at"
                :style="{
									width:item.content.imgsUrl.length > 1 ? '180rpx' : '280rpx',
									height:item.content.imgsUrl.length > 1 ? '180rpx' : '280rpx'
								}"
                lazy-load
                mode="aspectFill"
                @click="LookImage(el,index)"
              >
            </li>
            <li class="text">{{item.content.text}}</li>
            <li class="button">
              <div>浏览{{item.viewcount}}次</div>
              <div>
                <span>
                  <iconx type="dianzan" size="55"></iconx>
                </span>
                <span>
                  <iconx type="liaotian" size="55"></iconx>
                </span>
                <span>
                  <iconx type="fenxiang" size="55"></iconx>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="share" @click="redact">
      <span>
        <iconx type="share" color="#2fbc6f" size="45"></iconx>
      </span>
    </div>
  </div>
</template>
<script>
import iconx from "../components/iconx";
import {
  getFriendContent,
  ViewCount,
  getSquareSddition,
  deleteState
} from "@/api/wx";
import { setTimeout } from "timers";
export default {
  components: {
    iconx
  },
  data() {
    return {
      openid: wx.getStorageSync("openid"),
      contents: [],  //朋友圈内容
      showOpen: false,
      delete_at: null //编辑 删除 当前点击的位置
    };
  },
  methods: {
    getContent() {
      //广场返回数据
      getFriendContent().then(res => {
        this.dateF(res); //时间预格式化
        let proAll = [];
        for (let item of res) {
          ViewCount(item._id).then(add => {
            //浏览次数增加
            console.log(add, "浏览次数");
          });
          let pro = new Promise((resolve, reject) => {
            getSquareSddition(item._id).then(get => {
              //附加属性获取
              console.log(
                res,
                "广场返回数据",
                item,
                "遍历数据",
                get,
                "附加属性"
              );
              item.viewcount = get[0].viewcount;
              console.log(get[0].viewcount);
              resolve(true);
              // this.contents = res
            });
          });
          proAll.push(pro);
        }
        Promise.all(proAll).then(aa => {
          this.contents = res;
          this.showOpen = true;
					wx.hideLoading()
					wx.stopPullDownRefresh()
        });
      });
    },
    change(at) {
			//编辑 删除功能
			if (this.delete_at == at) {
				this.delete_at = null
				return
			}
      this.delete_at = at;
    },
    stateDelete(_id,index) {
			//删除朋友圈某条动态
			wx.showModal({
				title: '确认删除', //提示的标题,
				content: '删除后数据将无法恢复', //提示的内容,
				showCancel: true, //是否显示取消按钮,
				cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
				cancelColor: '#000000', //取消按钮的文字颜色,
				confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
				confirmColor: '#3CC51F', //确定按钮的文字颜色,
				success: res => {
					if (res.confirm) {
						deleteState(_id).then( res=> {
							if (res.errMsg === "document.remove:ok") {
								wx.showToast({
									title: '删除成功', //提示的内容,
									icon: 'none', //图标,
									duration: 1500, //延迟时间,
									mask: true, //显示透明蒙层，防止触摸穿透,
								});
								this.contents.splice(index,1)
								this.delete_at = null
							}
						})
					} else if (res.cancel) {
					}
				}
			});
    },
    dateF(res) {
      //时间预格式化
      for (let item of res) {
        var time = new Date(item.date);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        if (h < 10) h = "0" + h;
        if (mm < 10) mm = "0" + mm;
        item.date = y + "年" + m + "月" + d + "日 " + h + ":" + mm;
      }
    },
    redact() {
      //发布
      this.$router.push("/packageA/redact");
    },
    LookImage(el, index) {
      //查看图片大图
      console.log(el, "图片信息");
      wx.previewImage({
        current: el,
        urls: this.contents[index].content.imgsUrl
      });
    }
  },
  created() {
    wx.showLoading({
      title: "加载中...", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透,
    });
    this.getContent();
  },
  onShow() {
    if (wx.getStorageSync("refresh")) {
      //刷新
      wx.removeStorageSync("refresh");
      Object.assign(this, this.$options.data());
      this.getContent();
    }
  },
  onPullDownRefresh() {
		Object.assign(this, this.$options.data()); 
		this.getContent();
	}
};
</script>
<style lang="scss">
.friend {
  .contentShow {
    opacity: 1 !important;
  }
  .content {
    opacity: 0;
    transition: 3s;
    .each {
      width: 95%;
      display: flex;
      justify-content: space-evenly;
      box-sizing: border-box;
      padding: 30rpx 0;
      margin: 15rpx auto;
      background: #fff;
      box-shadow: rgb(180, 180, 180) 0rpx 0rpx 40rpx;
      border-radius: 10rpx;
      .Avatar {
        width: 100rpx;
        img {
          width: 70rpx;
          height: 70rpx;
          border-radius: 50%;
          margin-left: 15rpx;
        }
      }
      .box {
        width: 650rpx;
        .name {
          line-height: 35rpx;
          .delete {
            float: right;
            margin-right: 10rpx;
            position: relative;
            .delete_lis {
              position: absolute;
              right: 0;
              width: 100rpx;
              border: 1rpx solid #eee;
              font-size: 24rpx;
              text-align: center;
              div:not(:first-child) {
                border-top: 1rpx solid #eee;
              }
            }
          }
        }
        .date {
          line-height: 50rpx;
          font-size: 24rpx;
          color: #555;
          margin-bottom: 20rpx;
        }
        .imgsa {
          display: flex;
          flex-wrap: wrap;
          img {
            width: 280rpx;
            height: 280rpx;
            margin-right: 10rpx;
            padding: none;
            border-radius: 10rpx;
            margin-bottom: 10rpx;
          }
        }
        .text {
          box-sizing: border-box;
          padding: 15rpx 25rpx 15rpx 0;
        }
        .button {
          div:first-child {
            font-size: 24rpx;
            color: #555;
          }
          display: flex;
          justify-content: space-between;
          height: 60rpx;
          line-height: 60rpx;
          box-sizing: border-box;
          padding-right: 30rpx;
        }
      }
    }
  }
  .share {
    position: fixed;
    bottom: 30rpx;
    right: 30rpx;
    background: #fff;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
    line-height: 80rpx;
    box-shadow: rgb(200, 200, 200) 0rpx 0rpx 30rpx;
  }
}
</style>