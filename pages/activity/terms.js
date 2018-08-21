// pages/product/terms.js
const app = getApp()
const appData = app.globalData
const http = app.globalData.http
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dates: null,
    time:null,
    ctype:null,
    keyword: '',
  },

  restset: function () {
    this.setData({
      ctype: '-1',
      dates: '2018-10-23',
      keyword:'',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dates:"2018-10-23",
      time:"10:00",
      ctype:'-1',
    })
  },

  showfirstmenu:function(e){
    this.setData({
      showOne: e.currentTarget.dataset.tip,
    })
  },

  showsecondmenu: function(e){
    this.setData({
      showTwo: e.currentTarget.dataset.tip,
    })
  },

  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },

  bindDateendChange: function (e) {
    // console.log(e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  setCtype:function(e){
    // console.log(e.currentTarget.dataset.ctype )
    this.setData({
      ctype: e.currentTarget.dataset.ctype
    })
  },

  //设置搜索关键字
  setKeyword: function (e) {
    this.setData({
      time: '',
      keyword: e.detail.value,
      lastSeq: '',
    })
  },


  gosearch:function(){
    wx.reLaunch({
      url: '../activity/index?type=' + this.data.ctype + '&keyword=' + this.data.keyword + '&dates=' + this.data.dates + '&time=' + this.data.time,
    })
  },
})