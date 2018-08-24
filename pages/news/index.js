// pages/news/index.js
const app = getApp()
const http = app.globalData.http

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newslist: [],

    lastSeq:0,
    pageSize:20,

    isLastPage:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getnewslist()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getnewslist()
  },

  //获取展商置顶活动
  getnewslist: function () {
    var that = this
    app.t1("加载中","loading")
    wx.request({
      url: http + '/info/list',
      data: {
        lastSeq: that.data.lastSeq,
        pageSize: that.data.pageSize,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======获取媒体视角======")
        console.log("lastSeq:" + that.data.lastSeq)
        console.log("pageSize:" + that.data.pageSize)
        console.log(res)
        console.log("======end======")
        var re = JSON.parse(res.data)
        if(re.result != null){
          that.setData({
            newslist: that.data.newslist.concat(re.result),   //将新获取到的数组 插入到原数组
            lastSeq: re.result[re.result.length - 1].id
          })
        }else{
          app.t1("到底了","none",3000)
          that.setData({
            isLastPage:true
          })
        }
      }
    })
  },
})