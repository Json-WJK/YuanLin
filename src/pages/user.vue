<template>
  <div class="user">
    <!-- 上部分 -->
    <div class="top_background">
      <img src="cloud://wjk-json.776a-wjk-json/默认图片/用户界面图片/用户默认背景.jpeg" alt>
    </div>
    <div class="user_data">
      <div class="box">
        <open-data type="userAvatarUrl" class="Avatar"></open-data>
        <open-data type="userNickName" class="NickName">
          <span></span>
        </open-data>
        <div class="signature" @click="config" v-if="signature">{{signature}}</div>
        <div class="signature" @click="config" v-else>点击设置个性签名</div>
      </div>
    </div>
    <!-- 瞬间    收藏 -->
    <div class="ifys">
      <div 
        class="ifys_refresh" 
        :style="{
          color:swiper_index_tab == 0 ? '#2cbf64' : ''
        }"
        @click="ifytab(0)"
        >瞬间</div>
      <div class="partition"></div>
      <div
        :style="{
          color:swiper_index_tab == 1 ? '#2cbf64' : ''
        }"
        @click="ifytab(1)"
      >收藏</div>
    </div>
    <!-- 内容 -->
    <swiper 
      :style="{
        height:H*2+'rpx',
        opacity:1
      }" 
      :current="swiper_index"
      @change="tabindex"
      :class="H ? 'swiper swiper_transition' : 'swiper'"
    >
      <swiper-item class="swiper_item" style="overflow :visible">
        <div class="content" id="content_a">
          <div class="box" v-if="Moment.length">    <!-- 时间轴 -->
            <div class="everya every" v-for="(item,index) in Moment" :key="index">    <!-- 每一条 -->
              <span class="sjz"><iconx type="shijianzhou32" color="#2cbf64" size="45"></iconx></span>
              <div class="text">{{item.content.text}}</div>
              <div class="image">
                <img  
                v-for="(el,i) in item.content.imgsUrl" :key="i"
                :src="el" 
                :style="{
                  width:item.content.imgsUrl.length > 1 ? '190rpx' : '280rpx',
                  height:item.content.imgsUrl.length > 1 ? '190rpx' : '280rpx'
                  }" 
                lazy-load
								mode="aspectFill"
                @click="LookImage(el,index)"
                alt >
              </div>
              <div class="date">
                <span>{{item.date}}</span>
              </div>
            </div>
          </div>
        </div>
      </swiper-item>
      <swiper-item class="swiper_item" style="overflow :visible">
        <div class="content" id="content_a">
          <div class="box" v-if="collect.length">    <!-- 时间轴 -->
            <div class="everyb every" v-for="(item,index) in collect" :key="index">    <!-- 每一条 -->
              <span class="sjz"><iconx type="shijianzhou32" color="#2cbf64" size="45"></iconx></span>
              <div class="text">{{item.content.text}}</div>
              <div class="image">
                <img 
                v-for="(el,i) in item.content.imgsUrl" :key="i"
                :src="el" 
                :style="{
                  width:item.content.imgsUrl.length > 1 ? '180rpx' : '280rpx',
                  height:item.content.imgsUrl.length > 1 ? '180rpx' : '280rpx'
                  }"
                lazy-load
								mode="aspectFill"
                @click="LookImage(el,index)"
                alt >
              </div>
              <div class="date">
                <span>{{item.date}}</span>
              </div>
            </div>
          </div>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>
<script>
import iconx from "../components/iconx";
import { getUserData,getUserMoment } from "@/api/wx";
import { setTimeout } from 'timers';
export default {
  components:{
    iconx
  },
  data() {
    return {
      signature: null,
      Moment: [], //瞬间
      collect:[], //收藏
      H:0, //高度
      swiper_index:0, //swiper当前位置
      swiper_index_tab:0, //tab栏当前位置
      swiper_open:true,
    }
  },
  methods: {
    config() {    //修改签名
      this.$router.push({ path: "/packageA/signature" });
    },
    getData() {    
      getUserData().then(users => { //用户信息
        this.signature = users.data[0].signature;
      });
      getUserMoment().then(refresh => {//用户瞬间
      // console.log(refresh,"用户瞬间")
        this.dateF(refresh)  //时间预格式化
        this.Moment = refresh
        // console.log(refresh,"用户瞬间")
        let every = wx.createSelectorQuery().selectAll('.everya')
        setTimeout(()=>{
          this.querys(every)   //获取高度
        },1000)
      })
    },
    LookImage(el,index){  //查看图片
			// console.log(el,"图片信息")
			wx.previewImage({
				current: el, 
				urls: this.Moment[index].content.imgsUrl 
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
    querys(every){   //节点选择 
      this.H = 60
      every.boundingClientRect(rects => {
        rects.forEach(rect => {
          this.H += rect.height 
          // console.log(this,this.H)
        })
      }).exec()
    },
    tabindex(){ //swiper切换事件
      if(!this.swiper_open) return
      // console.log(this.swiper_index)
      if(this.swiper_index){
        this.swiper_index = 0
        this.swiper_index_tab = 0
      }
      else{
        this.swiper_index = 1
        this.swiper_index_tab = 1
      }
      // console.log(this.swiper_index_tab)
      // if(this.swiper_index_tab && this.swiper_open){
      //   this.swiper_open = false
      // }
      // else if(this.swiper_open){
      //   this.swiper_open = false
      //   this.swiper_index_tab = 1
      // }
      // setTimeout(() => {
      //   this.swiper_open = true
      // },500)
    },
    ifytab(at){  //点击tab切换
      if(this.swiper_index == at) return
      this.swiper_index = at
      this.swiper_index_tab = at
      this.swiper_open = false
      setTimeout(() => {
        this.swiper_open = true
      },500)
    }
  },
  created() {
    
  },
  onShow() {
    Object.assign(this, this.$options.data());
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.user {
  .top_background {
    width: 100%;
    height: 200rpx;
    background: #d2dae5;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .user_data {
    width: 100%;
    height: 200rpx;
    background: #fff;
    position: relative;
    .box {
      position: absolute;
      top: -80rpx;
      width: 100%;
      height: 100%;
      .Avatar {
        display: block;
        width: 150rpx;
        height: 150rpx;
        margin: 0 auto;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 20rpx;
      }
      .NickName {
        display: block;
        margin: 0 auto;
        text-align: center;
        font-size: 30rpx;
        margin-bottom: 20rpx;
      }
      .signature {
        display: block;
        margin: 0 auto;
        text-align: center;
        font-size: 30rpx;
      }
    }
  }

  .ifys {
    display: flex;
    height: 80rpx;
    background: #fff;
    box-shadow:rgb(180,180,180) 0rpx 0rpx 40rpx;
    div {
      width: 49.5%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
    }
    .partition {
      width: 2rpx;
      height: 50rpx;
      margin-top: 15rpx;
      background: #eee;
    }
  }
  .swiper{
    height:0;
    opacity: 0;
  }
  .swiper_transition{
    transition: 1s;
  }
  .swiper_item{
    .content {
      height: auto;
      width: 100%;
      .box {
        width: 95%;
        margin-left: 5%;
        border-left: 4rpx solid #2cbf64;
        box-sizing: border-box;
        padding: 30rpx;
        .every {
          background: #fff;
          box-sizing: border-box;
          padding: 20rpx;
          border-radius: 15rpx;
          position: relative;
          margin-bottom:15rpx;
          box-shadow:rgb(180,180,180) 0rpx 0rpx 40rpx;
          .sjz{
            position: absolute;
            width: 50rpx;
            height: 50rpx;
            top:30rpx;left: -52.5rpx;
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
          }
        }
      }
    }
  }
  
}
</style>