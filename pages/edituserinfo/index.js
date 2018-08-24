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

      path: "https://www.view-ol.com/mobile/editUserInfo.html?userId=" + appData.uid + "&companyId=" + companyId + "&bUserId=" + bUserId+"&sessionId=" + appData.sessionId + "&action=" + action,

      globaluserinfo: appData.userInfo,
    })
    console.log("https://www.view-ol.com/mobile/editUserInfo.html?userId=" + appData.uid + "&companyId=" + companyId + "&bUserId=" + bUserId + "&sessionId=" + appData.sessionId + "&action=" + action)
  },
})