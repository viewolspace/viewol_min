// pages/edituserinfo/index.js
const app = getApp()
const http = app.globalData.http
const appData = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {  
    info: '',
    globaluserinfo: '',
    path:'',
    

    uid: '',
    action: '',
    companyId:'',
    bUserId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    if (options.c){
      var companyId = options.c
    }else{
      var companyId = ''
    }

    if (options.u){
      var bUserId = options.u
    }else{
      var bUserId = ''
    }

    if(options.a){
      var action = options.a
    } else {
      var action = ''
    }

    console.log("appData.uid:" + appData.uid)
    console.log("appData.sessionId:"+appData.sessionId)

    that.setData({
      uid: appData.uid,
      action: action,
      bUserId: bUserId,
      companyId: companyId,

      path: "https://www.jk234.com/test/editUserInfo.html?userId=" + appData.uid + "&companyId=" + companyId + "&bUserId=" + bUserId+"&sessionId=" + appData.sessionId + "&action=" + action,

      globaluserinfo: appData.userInfo,
    })
    console.log("https://www.jk234.com/test/editUserInfo.html?userId=" + appData.uid + "&companyId=" + companyId + "&bUserId=" + bUserId + "&sessionId=" + appData.sessionId + "&action=" + action)
  },

  //获取个人信息
  // getFuser: function () {
  //   var that = this
  //   app.t1("加载中..", "loading")
  //   wx.request({
  //     url: http + '/fuser/getFuser',
  //     data: {
  //       userId: appData.uid,
  //     },
  //     method: "GET",
  //     dataType: JSON,
  //     header: { 'content-type': 'application/x-www-form-urlencoded' },
  //     success: function (res) {
  //       console.log("==========获取用户信息======")
  //       console.log("入参 userId：" + appData.uid)
  //       console.log(res)
  //       var re = JSON.parse(res.data)
  //       if (re.result != null) {
          // var uid = that.data.uid
          // var company = re.result.company == null ? '' : re.result.company
          // var sessionId = appData.sessionId


          // var path = "https://www.jk234.com/test/editUserInfo.html?userId=" + uid +"&companyId=&bUserId=&sessionId=" + sessionId + "&action=" + that.data.action
          // console.log(path)
          // that.setData({
          //   info: re.result,
          //   path: path
          // })
  //       }
  //     }
  //   })
  // },
})