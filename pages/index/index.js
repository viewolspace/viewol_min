// pages/index/index.js
const app  = getApp()
const http = app.globalData.http

var touchDot = 0;//触摸时的原点
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "";// 记录/清理时间记录

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],//swiper里面的内容
    indicatorDots: false, //swiper的指示点开关
    autoplay: true, //swiper自动播放开关
    interval: 4000, //swiper自动切换时间间隔
    duration: 1000,  //swiper滑动动画时长

    sponsor:null, //主办方日程

    businessman_top:null, //展商置顶1条
    businessman_other: null, //展商其他日程

    CompanyList:null, //展商列表
    logoz:"/images/logoz.png", //展商logo占位图

    productList:null, //推荐产品列表
    page:1,
    primgz: "/images/img.png",

    className:'', 

    today:'',
    week:'',

    newslist:'',
  },
  scan: function (options){
    
    //首页接受跳转
    if (options.scene) {
      console.log("options.scene:" + options.scene);
      var scene = decodeURIComponent(options.scene)
      var datas_temp = scene.split(":");
      var action = datas_temp[0]
      /**
       * 1 活动报名页面
       */
      if (action == 1) {
        var urlValue = "../activity/info?id=" + datas_temp[1]
        if (app.globalData.uid == null) {
            app.globalData.url = urlValue
            wx.navigateTo({
              url: '../login/index'
            })
        }else{
            wx.navigateTo({
              url: "../activity/info?id=" + datas_temp[1]
            })
        }
        return true;
      }
    }
    return false;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isscan = this.scan(options); 
    console.log("isscan:" + isscan);
    

    if (app.globalData.uid == null && !isscan) {
      wx.redirectTo({
        url: '../login/index'
      })
      return false;
    }

    this.queryNowHostSchedule()
    this.queryNowRecommendSchedule()
    this.queryNowRecommendSchedule2()
    this.recommentCompanyList()
    this.recommentProductList()

    var date = new Date();
    var myDate = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate()
    var week = "星期"+"日一二三四五六".charAt(new Date().getDay());
    this.setData({
      today:myDate,
      week:week
    })

    this.getnewslist()
  },

  //获取主办方日程
  queryNowHostSchedule:function(){
    var that = this
    wx.request({
      url: http + '/schedule/queryNowHostSchedule',
      data: {   },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        var re = JSON.parse(res.data)
        that.setData({
          sponsor: re.result
        })
      }
    })
  },

  //获取展商置顶活动
  queryNowRecommendSchedule: function () {
    var that = this
    wx.request({
      url: http + '/schedule/queryNowRecommendSchedule?type=1',
      data: {},
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        var re = JSON.parse(res.data)
        that.setData({
          businessman_top: re.result
        })
      }
    })
  },

  //获取展商其他活动
  queryNowRecommendSchedule2: function () {
    var that = this
    wx.request({
      url: http + '/schedule/queryNowRecommendSchedule?type=2',
      data: {},
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        var re = JSON.parse(res.data)
        that.setData({
          businessman_other: re.result
        })
      }
    })
  },

  //获取推荐展商
  recommentCompanyList: function () {
    var that = this
    wx.request({
      url: http + '/company/recommentCompanyList',
      data: {},
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        var re = JSON.parse(res.data)
        that.setData({
          "CompanyList": re.result
        })
      }
    })
  },


  //获取推荐产品
  recommentProductList: function () {
    var that = this
    wx.request({
      url: http + '/product/recommentProductList',
      data: {},
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        var re = JSON.parse(res.data)
        that.setData({
          productList: re.result
        },function(){
          that.changeTjcp()
        })
      }
    })
  },



  //手势部分
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    interval = setInterval(function () {// 使用js计时器记录时间  
      time++;
    }, 100);
  },
  // 触摸移动事件
  touchMove: function (e) {
    var that = this
    var touchMove = e.touches[0].pageX;

    // 向左滑动  
    if (touchMove - touchDot <= -100 && time < 10) {
      console.log('向左滑动');
      if(that.data.page==1){
        that.setData({
          page:2,
          className:"changeData"
        })
      }
    }
    // 向右滑动
    if (touchMove - touchDot >= 100 && time < 10) {
      console.log('向右滑动');
      if (that.data.page == 2) {
        that.setData({
          page: 1,
          className: "changeData2"
        })
      }
    }
  },

  // 触摸结束事件
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
  },

  //推荐产品每N秒自动切换一次
  changeTjcp:function(){
    var that = this
    var loaduserinfo = setInterval(function () {
      if(that.data.page == 2){
        that.setData({
          page: 1,
          className: "changeData2"
        })
      }else{
        that.setData({
          page: 2,
          className: "changeData"
        })
      }
    }, 4300)
  },

  //跳转日程页面
  navigatorto:function(e){
    wx.reLaunch({
      url: '../activity/index?type='+e.currentTarget.dataset.type,
    })
  },


  //获取媒体视角
  getnewslist: function () {
    var that = this
    wx.request({
      url: http + '/info/list',
      data: {
        lastSeq:0,
        pageSize:3,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        var re = JSON.parse(res.data)
        for(var i=0;i<re.result.length;i++){
          if (re.result[i].title.length > 30 ){
            re.result[i].title = re.result[i].title.substring(0,30)+"..."
          }
        }
        that.setData({
          newslist: re.result
        })
      }
    })
  },

})