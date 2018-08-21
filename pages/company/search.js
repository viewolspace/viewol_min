// pages/company/search.js
const app = getApp()
const appData = app.globalData
const http = app.globalData.http
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:"",
    keyWord:"",
    categoryId:"",
    lastSeq:"",
    num:20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (appData.urlparameter.isreLaunch == 1) {
      console.log(options)
      this.setData({
        keyWord: options.keyword ? options.keyword:'',
        categoryId: options.catid ? options.catid : '',
        lastSeq: "",
        list: '',
      }, function () {
        that.listCompany()
      })
      appData.urlparameter.isreLaunch = ''
    }else{
      this.listCompany()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  //获取展商列表
  listCompany: function () {
    var that = this
    app.t1("加载中..","loading")
    wx.request({
      url: http + '/company/listCompany',
      data: {
        keyWord: that.data.keyWord,
        categoryId: that.data.categoryId,
        lastSeq: that.data.lastSeq,
        num: that.data.num,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======请求的信息======")
        console.log("keyWord:" + that.data.keyWord)
        console.log("categoryId:" + that.data.categoryId)
        console.log("lastSeq:" + that.data.lastSeq)
        console.log("num:" + that.data.num)
        console.log("======end======")
        console.log(res)
        var re = JSON.parse(res.data)
        if (re.result != null && re.result !="" ){
          if (that.data.list == '') {
            that.setData({
              list: re.result,
              lastSeq: re.result[re.result.length - 1].seq
            })
          } else {
            that.setData({
              list: that.data.list.concat(re.result),   //将新获取到的数组 插入到原数组
              lastSeq: re.result[re.result.length - 1].seq
            })
          }
        }else{
          app.t1("没有内容了","none")
        }
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listCompany()
  },


  //设置搜索关键字
  setKeyword: function (e) {
    console.log(e.detail.value)
    this.setData({
      // time: '',
      // date: '2018-10-' + that.data.today,
      // type: that.data.ctype,
      keyWord: e.detail.value,
      lastSeq: '',
      // num: that.data.num
    })
  },

  //关键字搜索
  keywordSearch: function () {
    var that=this
    this.setData({
      list: '',
      // keyWord: "",
      categoryId: "",
      lastSeq: "",
    },function(){
      that.listCompany()
    })
  },
})