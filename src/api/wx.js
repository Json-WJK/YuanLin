wx.cloud.init()
const db = () => wx.cloud.database()
const _ = db().command
const openid = () => wx.getStorageSync('openid')
const nickName = () => JSON.parse(wx.getStorageSync('userInfo')).nickName

//获取用户Openid
const getOpenid = () => {
	return wx.cloud.callFunction({ name: "user" })
	.then(res => res)
	.catch(err => console.error(err));
}




/*********************   用户   ************************** */
//登录后保存用户信息
const saveUserData = (data) => {
	return db().collection('User_Info').doc(openid())
	.set({
		data
	})
	.then(res => res )
}
//登录后更新用户信息
const upUserData = (data) => {
	return db().collection('User_Info').doc(openid())
	.update({
		data
	})
	.then(res => res )
}

//登录页面录播图
const getLoginSwiper = () =>{
	return db().collection('login_imgs')
	.get()
	.then(res => res )
}

//登录修改用户签名
const setUserData = (signature) =>{
	return db().collection('User_Info').doc(openid())
	.update({
		data:{
			openid : openid(),
			signature : signature,
			
		}
	})
	.then(res => res )
}

//获取用户信息
const getUserData = () =>{
	// console.log(openid(),"数据")
	return db().collection('User_Info').where({
		openid:openid()
	})
	.get()
	.then(res => res )
	.catch(Error => Error)
}

//个人中心 瞬间
const getUserMoment = () => {
	return db().collection('friend_share').where({
		_openid:openid()
	}).orderBy('date','desc')
	.get()
	.then(res => res.data)
}

/******************   广场   **************** */

//朋友分享内容获取
const getFriendContent = () =>{
	return db().collection('friend_share').orderBy('date','desc')
	.get()
	.then(res => res.data)
}
//广场分享附加属性获取
const getSquareSddition = (_id) =>{
	return db().collection('SquareSddition').where({_id})
	.get()
	.then(res => res.data)
}
//朋友确认发布
const addFriendContent = (content) =>{
	let data = JSON.parse(wx.getStorageSync('userInfo'))
	data.content = content
	data.content.openid = openid()
	data.date = new Date()
	return db().collection('friend_share')
	.add({
		data
	})
	.then(res => res)
}
//确认发布附加属性
const addSquareSddition = (_id) =>{
	let data = {
		_id,
		viewcount:0,
		like:0,
		// comment:[],
	}
	return db().collection('SquareSddition')
	.add({
		data
	})
	.then(res => res)
}

//广场上传图片
const UpImages = (url) =>{
	return wx.cloud.uploadFile({
		cloudPath: '776a-wjk-json/默认图片/发表界面图片/', // 上传至云端的路径
		filePath: url, // 小程序临时文件路径
		success: res => {
			// 返回文件 ID
			// console.log(res.fileID)
		}
	})
	.then( res => res.data )
}

//广场浏览次数 
const ViewCount = (_id) =>{
	return wx.cloud.callFunction({
			name: 'SquareSddition',
			data: {
				_id
			}
	}).then(res => res)
}

//删除广场某条动态
const deleteState = (_id) =>{
	return db().collection('friend_share').doc(_id)
	.remove()
	.then(res => res)
}

//朋友圈点赞
const clickPraise = (_id,operate) => {
	return wx.cloud.callFunction({
		name: 'clickPraise',
		data: {
			_id,
			operate,
			users:{
				openid:openid(),
				nickName:nickName()
			}
		}
	}).then(res => res) 
}
export {
	getOpenid,
	saveUserData,
	getLoginSwiper,
	setUserData,
	getUserData,
	upUserData,
	getFriendContent,
	addFriendContent,
	UpImages,
	ViewCount,
	addSquareSddition,
	getSquareSddition,
	getUserMoment,
	deleteState,
	clickPraise
}