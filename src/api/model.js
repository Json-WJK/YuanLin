var model = false
wx.getSystemInfo({
      success:  res=>{
        // console.log('手机信息res'+res.model)
        let modelmes = res.model;
        console.log(res)
        if (modelmes.search('iPhone X') != -1) {
            model = true
        }
    }
})
export default model