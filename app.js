//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
    http: 'https://www.view-ol.com/viewol_web',
    web_http: 'https://www.view-ol.com/',
    // http: "http://47.93.25.129:8080/viewol_web",
    encryptedData: null,
    iv: null,
    code: null,
    urlparameter: {
      'activityType': '-1',
      'keyword': '',
      'startdate': '',
      'enddate': '',
      'catid': '',
      'isreLaunch': '',
    },
    openid: null,
    uid: null,
    sessionId: null,
    isAuthorize: false,
    url: '',   //来源地址，用于登录完成后跳回到来源页
  },

  //消息窗口 正方消息窗口
  t1: function (msg, icon, times = 200, image = '') {//success , loading
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

  userLogin: function (urlType = '') {
    var that = this

    //获取encryptedData 和 ivStr 、 级微信用户信息
    wx.getSetting({
      success: res => {
        console.log('获取授权状态：' + res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('================login.js获取信息,写入golobaldata===============')
              console.log(res)
              console.log('encryptedData:' + res.encryptedData)
              console.log('iv:' + res.iv)
              console.log('================end===============')
              that.globalData.encryptedData = res.encryptedData
              that.globalData.iv = res.iv

              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo

              //获取code
              wx.login({
                success: function (res) {
                  console.log('登录时强制重新获取code:' + res.code)
                  var code = res.code

                  //通过code、encryptedData、ivStr从服务器换取用户信息
                  wx.request({
                    url: that.globalData.http + '/wx/maLogin',
                    data: {
                      code: code,
                      encryptedData: that.globalData.encryptedData,
                      ivStr: that.globalData.iv
                    },
                    method: 'GET',
                    dataType: JSON,
                    header: {'content-type': 'application/x-www-form-urlencoded'},
                    success: function (res) {
                      var re = JSON.parse(res.data)
                      console.log('======登录======')
                      console.log('code:' + code)
                      console.log('encryptedData:' + that.globalData.encryptedData)
                      console.log('ivStr:' + that.globalData.iv)
                      console.log(re)
                      console.log('获取到userId:' + re.result.userId)
                      console.log('======end======')

                      that.globalData.uid = re.result.userId
                      that.globalData.sessionId = re.result.sessionId

                    }
                  })
                }
              })
            }
          })
        } else {
          setTimeout(function () {
            that.userLogin()
          }, 300)
        }
      }
    })
  },

})
