// pages/news/info.js

const app = getApp()
const web_http = app.globalData.web_http


Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(web_http + "mobile/mapael/" + options.url);
    this.setData({
      url: web_http + "mobile/mapael/" + options.url
    })
  },

})