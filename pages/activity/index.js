// pages/activity/index.js
const app = getApp()
const appData = app.globalData
const http = app.globalData.http
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //接口请求参数start
    time:'',
    endTime:'',
    place:'',
    date:'',
    ctype:'',
    keyword:'',
    lastSeq:'',
    num:12,
    //接口请求参数end

    list:[],
    today:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    if(options.dates==null){
      var date = new Date();
      //今天日期
      var myDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() 
      var myTime = myDate + ' ' + date.getHours() + ':' + date.getMinutes()
      
      if (date.getMonth() + 1 == 10 && date.getDate() > 22 && date.getDate()<28 ){
        var today = date.getDate()
        var date1  = myDate
      }
      if ((date.getMonth() + 1 == 10 && date.getDate() < 23) || date.getMonth() + 1 < 10 ) {
        var today = 23
        var date1  = "2018-10-23"
      }
      if ((date.getMonth() + 1 == 10 && date.getDate() > 27) || date.getMonth() + 1 > 10 ) {
        var today = 27
        var date1 = "2018-10-27"
      }
    }else{
      var t = new Date(options.dates)
      var today = t.getDate()
      var date1 = options.dates
    }

    if(options.type!=null){
      var ctype = options.type
    }else{
      var ctype = "-1"
    }

    if (options.time != null) {
      var time = options.time
    } else {
      var time = ""
    }

    if (options.endTime != null) {
      var endTime = options.endTime
    } else {
      var endTime = ""
    }

    if (options.place != null) {
      var place = options.place
    } else {
      var place = ""
    }

    if (options.keyword!=null){
      var keyword = options.keyword
    }else{
      var keyword = that.data.keyword
    }

    this.setData({
      today: today,
      date: date1,
      ctype: ctype,
      keyword: keyword,
      time: time,
      endTime:endTime,
      place: place
    },function(){
      console.log("日期:" + that.data.date)
      that.listSchedule()
    })

  },
  
  //设置搜索关键字
  setKeyword:function(e){
    this.setData({
      time: '',
      keyword: e.detail.value,
      lastSeq: '',
      endTime: '',
      place: ''
    })
  },

  //关键字搜索
  keywordSearch:function(){
    this.setData({
      list:[],
    })
    this.listSchedule()
  },


  //获取某天的日程
  listSchedule: function () {
    var that = this
    app.t1("正在加载","loading")
    wx.request({
      url: http + '/schedule/listSchedule',
      data: {
        time: that.data.time,
        date: that.data.date,
        type: that.data.ctype,
        keyword: that.data.keyword,
        lastSeq: that.data.lastSeq,
        num: that.data.num,
        endTime: that.data.endTime,
        place: that.data.place
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======请求的信息======")
        console.log("time:" + that.data.time)
        console.log("date:" + that.data.date)
        console.log("type:" + that.data.ctype)
        console.log("keyword:" + that.data.keyword)
        console.log("lastSeq:" + that.data.lastSeq)
        console.log("num:" + that.data.num)
        console.log("======end======")
        console.log(res)
        var re = JSON.parse(res.data)

        if (re.result != null) {
          that.setData({
            list: that.data.list.concat(re.result), 
            lastSeq: re.result[re.result.length - 1].seq
          })
        } else {
          app.t1("没有内容了","none")
        }
      }
    })
  },

  //选定日期
  setDate:function(e){
    console.log(e.currentTarget.dataset.d)
    var that = this
    this.setData({
      today: e.currentTarget.dataset.d,
      date: "2018-10-" + e.currentTarget.dataset.d,
      time: '',
      keyword: '',
      lastSeq:'',
      list:[],
    },function(){
      that.listSchedule()
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listSchedule()
  },

})