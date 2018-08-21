// pages/my/collection.js
const app = getApp()
const appData = app.globalData
const http = app.globalData.http
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_company:[],
    list_product:[],

    num:30,
    lastId_company:'',
    lastId_product: '',
    tab: 'company',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCompany()
  },

  changeTab:function(e){
    this.setData({
      tab: e.currentTarget.dataset.tab,
    })
    if (e.currentTarget.dataset.tab == "company"){
      this.getCompany()
    }
    if (e.currentTarget.dataset.tab == "product") {
      this.getProduct()
    }
  },

  //获取收藏的展商列表
  getCompany: function () {
    var that = this
    app.t1("加载中..", "loading")
    wx.request({
      url: http + '/fuser/listUserCollection',
      data: {
        userId: appData.uid,
        type:1,
        num: that.data.num,
        lastId: that.data.lastId_company,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======获取收藏的展商列表======")
        console.log("userId:" + appData.uid)
        console.log("type:1")
        console.log("num:" + that.data.num)
        console.log("lastId:" + that.data.lastId_company)
        console.log("======end======")

        console.log(res)
        var re = JSON.parse(res.data)
        if (re.result != null) {
          console.log("返回有内容")
          that.setData({
            list_company: that.data.list_company.concat(re.result),
            lastId_company: re.result[re.result.length - 1].id
          })
        }
      }
    })
  },


  //获取收藏的产品列表
  getProduct: function () {
    var that = this
    app.t1("加载中..", "loading")
    wx.request({
      url: http + '/fuser/listUserCollection',
      data: {
        userId: appData.uid,
        type: 2,
        num: that.data.num,
        lastId: that.data.lastId_product,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======获取收藏的产品列表======")
        console.log("userId:" + appData.uid)
        console.log("type:2")
        console.log("num:" + that.data.num)
        console.log("lastId:" + that.data.lastId_product)
        console.log("======end======")

        console.log(res)
        var re = JSON.parse(res.data)
        if (re.result != null) {
          that.setData({
            list_product: that.data.list_product.concat(re.result),
            lastId_product: re.result[re.result.length - 1].id
          })
        }
      }
    })
  },

  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    if (this.data.tab=="company" ){
      this.getCompany()
    }
    if (this.data.tab == "product") {
      this.getProduct()
    }
  },

})