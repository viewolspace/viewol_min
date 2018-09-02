// pages/news/info.js

const app = getApp()
const web_http = app.globalData.web_http


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: options.userId
    })
  },

})