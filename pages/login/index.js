//index.js
//获取应用实例
const app = getApp()
const http = app.globalData.http
const appData = app.globalData

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    var that = this

    // var loaduid = setInterval(function () {
    //   console.log("获取全局变量code：" + app.globalData.code)
    //   if (app.globalData.code != null) {
    //     clearInterval(loaduid)
    //     that.userLogin()
    //   }
    // }, 1000)
    that.userLogin()

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

      // this.jumpIndex()

    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

        // this.jumpIndex()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })

          // this.jumpIndex()
        }
      })
    }
  },

  
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    // this.jumpIndex()
  },


  userLogin:function(){
    var that = this

    wx.login({
      success: function (res) {
        if (res.code) {
          console.log("登录时强制重新获取code:" + res.code)
          var code = res.code 
          wx.request({
            url: http + '/wx/maLogin',
            data: {
              code: code,
              encryptedData: app.globalData.encryptedData,
              ivStr: app.globalData.iv
            },
            method: "GET",
            dataType: JSON,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              var re = JSON.parse(res.data)
              console.log("======登录======")
              console.log("code:" + code)
              console.log("encryptedData:" + app.globalData.encryptedData)
              console.log("ivStr:" + app.globalData.iv)
              console.log("获取到userId:" + re.result.userId)
              console.log("======end======")
              console.log(re)

              // appData.openid = re.result.,
              appData.uid = re.result.userId
              appData.sessionId = re.result.sessionId

              that.jumpIndex()
            }
          })
        } else {
          console.log('获取code态失败！' + res.errMsg)
        }
      }
    })
  },


  jumpIndex:function(){
    console.log("判断是否需要完善资料")
    var loaduid = setInterval(function () {
      console.log("等待获取uid:" + appData.uid)
      if (appData.uid!=undefined){
        clearInterval(loaduid)
      }else{
        return false
      }
    },1000)
    wx.request({
      url: http + '/fuser/isPerfectnfo',
      data: {
        userId: appData.uid,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        var re = JSON.parse(res.data)
        if (re.status == "0000") {
          wx.switchTab({
            url: '../index/index'
          })
        }else{
          wx.switchTab({
            url: '../index/index'
          })
          //跳转去完善信息,
          // wx.redirectTo({
          //   url: '../edituserinfo/index?uid=' + appData.uid
          // })
        }
      }
    })
  }
  
})
