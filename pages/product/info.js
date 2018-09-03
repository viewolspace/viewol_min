// pages/product/info.js
const app = getApp()
const appData = app.globalData
const http = app.globalData.http

var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false, //swiper的指示点开关
    autoplay: true, //swiper自动播放开关
    interval: 3000, //swiper自动切换时间间隔
    duration: 1000,  //swiper滑动动画时长

    id:'',
    info:'',

    article: '',

    collection:'',

    tonglelist:'',

    company:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id_param = options.id;
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var datas_temp = scene.split(":");
      id_param = datas_temp[2];
    }
    

    this.setData({
      id:id_param
    },function(){
      that.getProduct()
    })
  },


  //获取产品详情
  getProduct: function () {
    var that = this
    app.t1("加载中..", "loading")
    wx.request({
      url: http + '/product/getProduct', 
      data: {
        id: that.data.id,
        userId: appData.uid,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======获取产品详情======")
        console.log("id:" + that.data.id)
        console.log("userId:" + appData.uid)
        console.log(res)
        console.log("======end======")
        var re = JSON.parse(res.data)

        if (re.result != null && re.result != "") {
          that.setData({
            info:re.result,
            collection: re.collection,
            company: re.company
          },function(){
            that.toView()
            that.listByCategory()
          })
        } else {
          app.t1("未找到内容", "none")
        }
      }
    })
  },

  //保存下载操作记录
  down:function(){
    var that=this
    wx.request({
      url: http + "/fuser/addDownload",
      data: {
        userId: appData.uid,
        productId: that.data.id
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======下载说明书======")
        console.log("productId:" + that.data.id)
        console.log("userId:" + appData.uid)
        console.log("======end======")

        console.log(res)
        var re = JSON.parse(res.data)
        if (re.status == "0000") {
          app.t1("添加成功")
        } else {
          app.t1("添加失败", "none")
        }

        that.download()
      }
    })
  },


  //下载文件到手机
  download:function(){
    var that = this
    app.t1("打开中..","loading")
    wx.downloadFile({
      url: that.data.info.pdfUrlView, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.playVoice({
            filePath: res.tempFilePath
          })
          console.log(res.tempFilePath)

          wx.openDocument({
            filePath: res.tempFilePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })

          // wx.saveImageToPhotosAlbum({
          //   filePath: res.tempFilePath,
          //   success(res) {
          //     console.log("save photo is success")
          //   },
          //   fail: function () {
          //     console.log("save photo is fail")
          //   }
          // })

        }
      }
    })
  },





  //处理收藏（添加收藏 / 删除收藏）
  handlRecommend: function () {
    var that = this
    if (that.data.collection == 1) {
      var url = "/fuser/delUserCollection"
      var rs = 0
    } else {
      var url = "/fuser/addUserCollection"
      var rs = 1
    }

    wx.request({
      url: http + url,
      data: {
        userId: appData.uid,
        type: 2,
        thirdId: that.data.id
      },
      method: "POST",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======处理收藏请求======")
        console.log("collection:" + that.data.collection)
        console.log("userId:" + appData.uid)
        console.log("type:1")
        console.log("thirdId:" + that.data.id)
        console.log("======end======")
        console.log(res)
        var re = JSON.parse(res.data)
        if (re.status == "0000") {
          app.t1(re.message)
          that.setData({
            collection: rs
          })
        } else {
          app.t1(re.message, "none")
        }
      }
    })
  },

  //html转view
  toView: function () {
    var that = this
    var article = that.data.info.contentView
    WxParse.wxParse('article', 'html', article, that, 5)
  },


  //同类推荐
  listByCategory: function () {
    var that = this

    app.t1("加载中..", "loading")
    wx.request({
      url: http + '/recommend/listByCategory',
      data: {
        categoryId: that.data.info.categoryId,
        type: 2
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("=======获取同类========")
        console.log("categoryId:" + that.data.info.categoryId)
        console.log("type:2")
        console.log(res)
        console.log("=======end========")

        var re = JSON.parse(res.data)
        if (re.result != null) {
          that.setData({
            tonglelist: re.result,
          })
        }else{
          app.t1("没找到同类产品","none")
        }
      }
    })
  },
})