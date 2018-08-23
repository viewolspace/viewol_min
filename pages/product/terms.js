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
    show:""
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
    if (this.data.showOne != ""){
      if (this.data.showOne != e.currentTarget.dataset.tip ){
        this.setData({
          showOne: e.currentTarget.dataset.tip,
          show: e.currentTarget.dataset.tip,
        })
      }else{
        this.setData({
          showOne: "",
          show: "",
        })
      }
    }else{
      this.setData({
        showOne: e.currentTarget.dataset.tip,
        show: e.currentTarget.dataset.tip,
      })
    }
  },

  showsecondmenu: function(e){
    if (this.data.showTwo != "") {
      if (this.data.showTwo != e.currentTarget.dataset.tip) {
        this.setData({
          showTwo: e.currentTarget.dataset.tip,
          show: e.currentTarget.dataset.tip,
        })
      } else {
        this.setData({
          showTwo: "",
          show: "",
        })
      }
    } else {
      this.setData({
        showTwo: e.currentTarget.dataset.tip,
        show: e.currentTarget.dataset.tip,
      })
    }
  },

  restset:function(){
    this.setData({
      catid: '',
      keyword: '',
    })
  },


  //保存catid
  setcatid:function(e){
    var that = this
    this.setData({
      catid: e.currentTarget.dataset.catid,
      show: e.currentTarget.dataset.catid,
    },function(){
      console.log("保存catid：" + e.currentTarget.dataset.catid)
      console.log(that.data.show)
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