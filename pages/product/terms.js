// pages/product/terms.js
const app = getApp()
const appData = app.globalData
const http = app.globalData.http
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: '',

    catid: '',
    keyword: '',
    
    id:"",
    sourse:"",

    showOne: "",
    showTwo: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.listCategory()

    if (options.sourse != null){
      this.setData({
        sourse:options.sourse
      })
    }

    if (options.companyid != null) {
      this.setData({
        id: options.companyid
      })
    }


  },

  showfirstmenu:function(e){
    console.log("showOne:" + e.currentTarget.dataset.tip)
    this.setData({
      showOne: e.currentTarget.dataset.tip,
    })
  },

  showsecondmenu: function(e){
    this.setData({
      showTwo: e.currentTarget.dataset.tip,
    })
  },

  restset:function(){
    this.setData({
      catid: '',
      keyword: '',
    })
  },



  setcatid:function(e){
    this.setData({
      catid: e.currentTarget.dataset.catid,
    })
  },

  gosearch: function () {
    if (this.data.sourse =="" ){
      appData.urlparameter.isreLaunch = 1
      wx.reLaunch({
        url: '../product/search?keyword=' + this.data.keyword + '&catid=' + this.data.catid,
      })
    }

    if (this.data.sourse == "companyinfo"){
      wx.navigateTo({
        url: '../company/index?id=' + this.data.id +'&act=product&keyword=' + this.data.keyword + '&catid=' + this.data.catid,
      })
    }
    
  },


  //设置搜索关键字
  setKeyword: function (e) {
    this.setData({
      keyword: e.detail.value,
    })
  },


  //获取产品分类
  listCategory: function () {
    var that = this
    wx.request({
      url: http + '/category/listCategory',
      data: {
        parentId: '0002',
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
          console.log(re.result[0].child)
        } else {
          app.t1("没有数据啦", "none")
        }
      }
    })
  },
})