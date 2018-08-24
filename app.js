//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log( "appjs获取code:"+ res.code)
    //     this.globalData.code = res.code
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              
              console.log("================app.js获取信息,写入golobaldata===============")
              console.log(res);
              console.log("encryptedData:"+res.encryptedData);
              console.log("iv:" +res.iv);
              console.log("================end===============")
            
              this.globalData.encryptedData = res.encryptedData
              this.globalData.iv = res.iv

              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    http:"https://www.view-ol.com/viewol_web",
    // http: "http://47.93.25.129:8080/viewol_web",
    encryptedData:null,
    iv:null,
    code:null,
    urlparameter:{
      "activityType":"-1" , 
      "keyword":'',
      "startdate":'',
      "enddate": '',
      "catid":'',
      "isreLaunch":'',
    },
    openid:null,
    uid:null,
    sessionId:null,
  },


  //消息窗口 正方消息窗口
  t1: function (msg, icon, times=200 , image = "") {//success , loading
    wx.showToast({
      title: msg,
      icon: icon,
      duration: times,
      image: image
    })
  },

  //长方形带确定按钮敞口
  t2: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },





  //用户登录，全局函数
  userLogin: function () {
    console.log("执行app.js里的登录函数")
    var that = this

    wx.login({
      success: function (res) {
        if (res.code) {
          console.log("登录时强制重新获取code:" + res.code)
          var code = res.code
          wx.request({
            url: that.globalData.http + '/wx/maLogin',
            data: {
              code: code,
              encryptedData: that.globalData.encryptedData,
              ivStr: that.globalData.iv
            },
            method: "GET",
            dataType: JSON,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              var re = JSON.parse(res.data)
              console.log("======登录======")
              console.log("code:" + code)
              console.log("encryptedData:" + that.globalData.encryptedData)
              console.log("ivStr:" + that.globalData.iv)
              console.log("获取到userId:" + re.result.userId)
              console.log("======end======")
              console.log(re)

              that.globalData.uid = re.result.userId
              that.globalData.sessionId = re.result.sessionId
              
            }
          })
        } else {
          console.log('获取code态失败！' + res.errMsg)
        }
      }
    })
  },
})