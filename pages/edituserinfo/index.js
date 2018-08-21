// pages/edituserinfo/index.js
const app = getApp()
const http = app.globalData.http
const appData = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    info: '',
    globaluserinfo: '',
    path:'',
    action:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      uid: appData.uid,
      globaluserinfo: appData.userInfo,
      action: options.action
    }, function () {
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
        userId: appData.uid,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("获取用户信息")
        console.log(res)
        var re = JSON.parse(res.data)
        if (re.result != null) {
          var uid = that.data.uid
          var userName = re.result.userName == null ? '' : re.result.userName
          var age = re.result.age == null ? '' : re.result.age
          var company = re.result.company == null ? '' : re.result.company
          var position = re.result.position == null ? '' : re.result.position
          var phone = re.result.phone == null ? '' : re.result.phone
          var email = re.result.email == null ? '' : re.result.email
          var sessionId = appData.sessionId
          var path = "https://www.jk234.com/test/i.html?uid=" + uid + "&userName=" + userName + "&age=" + age + "&company=" + company + "&position=" + position + "&phone=" + phone + "&email=" + email + "&sessionId=" + sessionId + "&action=" + that.data.action
          console.log(path)
          that.setData({
            info: re.result,
            path: path
          })
        }
      }
    })
  },
})