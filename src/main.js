import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import MpvueRouterPatch from 'mpvue-router-patch'

Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
wx.cloud.init({
  traceUser: true,
  env: 'wjk-json'
})
const app = new Vue({
  mpType: 'app',
  store,
  ...App
})
app.$mount()
