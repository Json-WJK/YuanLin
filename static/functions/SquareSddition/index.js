// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = // collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结果
  async (event, context) => db
  .collection('SquareSddition')
  .doc(event._id)
  .update({
    data:{
      viewcount: _.inc(1)
    }
  })