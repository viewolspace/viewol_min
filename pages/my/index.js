// pages/my/index.js
const app = getApp()
const appData = app.globalData
const http = app.globalData.http
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
   uid:'',
   info:'',
   globaluserinfo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that= this
    that.setData({
      uid:appData.uid,
      globaluserinfo: appData.userInfo
    },function(){
      that.getFuser()
    })
  },

  //获取个人信息
  getFuser: function () {
    var that = this
    app.t1("加载中..", "loading")
    wx.request({
      url: http + '/fuser/getFuser',
      data: {
        userId: that.data.uid,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("获取用户信息")
        console.log(res)
        var re = JSON.parse(res.data)
        if (re.result != null) {
          that.setData({
            info: re.result,
          })
        }
      }
    })
  },
})