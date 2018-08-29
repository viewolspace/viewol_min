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

  onLoad: function (options) {
    var that = this
    console.log("sourse："+app.globalData.url)
    that.userLogin()
  },

  userLogin:function(){
    var that = this
    
    //获取encryptedData 和 ivStr 、 级微信用户信息
    wx.getSetting({
      success: res => {
        console.log("获取授权状态："+res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log("================login.js获取信息,写入golobaldata===============")
              console.log(res);
              console.log("encryptedData:" + res.encryptedData);
              console.log("iv:" + res.iv);
              console.log("================end===============")
              getApp().globalData.encryptedData = res.encryptedData
              getApp().globalData.iv = res.iv

              // 可以将 res 发送给后台解码出 unionId
              getApp().globalData.userInfo = res.userInfo

              //获取code
              wx.login({
                success: function (res) {
                  console.log("登录时强制重新获取code:" + res.code)
                  var code = res.code

                  //通过code、encryptedData、ivStr从服务器换取用户信息
                  wx.request({
                    url: http + '/wx/maLogin',
                    data: {
                      code: code,
                      encryptedData: getApp().globalData.encryptedData,
                      ivStr: getApp().globalData.iv
                    },
                    method: "GET",
                    dataType: JSON,
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    success: function (res) {
                      var re = JSON.parse(res.data)
                      console.log("======登录======")
                      console.log("code:" + code)
                      console.log("encryptedData:" + getApp().globalData.encryptedData)
                      console.log("ivStr:" + getApp().globalData.iv)
                      console.log(re)
                      console.log("获取到userId:" + re.result.userId)
                      console.log("======end======")

                      app.globalData.uid = re.result.userId
                      app.globalData.sessionId = re.result.sessionId

                      if (app.globalData.url=="" ){
                        wx.switchTab({
                          url: "../index/index"
                        })
                      }else{
                        wx.redirectTo({
                          url: app.globalData.url
                        })
                      }
                    }
                  })
                }
              })
            }
          })
        }else{
          setTimeout(function () {
            that.userLogin()
          }, 300)
        }
      }
    })
  },


  
})
