// pages/product/terms.js
const app = getApp()
const appData = app.globalData
const http = app.globalData.http
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:'',
    catid:'',
    keyword:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.listCategory()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  gosearch:function(){
    appData.urlparameter.isreLaunch = 1
    wx.reLaunch({
      url: '../company/search?keyword=' + this.data.keyword + '&catid=' + this.data.catid,
    })
  },

  //重置设置
  rest:function(){
    this.setData({
      catid: '',
      keyword: '',
    })
  },

  //设置搜索关键字
  setKeyword: function (e) {
    this.setData({
      time: '',
      // date: '2018-10-' + that.data.today,
      // type: that.data.ctype,
      keyword: e.detail.value,
      lastSeq: '',
      // num: that.data.num
    })
  },

  //选择分类
  choiceCategory:function(e){
    this.setData({
      catid: e.currentTarget.dataset.id,
    })
  },

  //获取展商分类
  listCategory: function () {
    var that = this
    wx.request({
      url: http + '/category/listCategory',
      data: {
        parentId: '0001',
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        var re = JSON.parse(res.data)
        if (re.result != null) {
          that.setData({
            category: re.result
          })
        } else {
          app.t1("没有数据啦", "none")
        }
      }
    })
  },
})