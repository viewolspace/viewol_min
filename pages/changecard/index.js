// pages/changecard/index.js
const app = getApp()
const appData = app.globalData
const http = app.globalData.http
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.changeCard(options.companyId, options.userId, options.bUserId )
  },

  //交换名片
  changeCard: function (companyId, userId, bUserId) {
    wx.request({
      url: http + '/ucard/changeCard',
      data: {
        companyId: companyId,
        userId: userId,
        bUserId: bUserId
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        var re = JSON.parse(res.data)
        if (re.status == "0000") {
          //交换名片
          app.t1(re.message, "success" , 1000)
          setTimeout(function () {
            wx.redirectTo({ 
              url: '../company/index?id=' + companyId
            })
          }, 1500)
        } else {
          app.t1(re.message , "none",1000)
          setTimeout(function () {
            wx.redirectTo({
              url: '../company/index?id=' + companyId
            })
          }, 1500)
        }
      }
    })
  }
})