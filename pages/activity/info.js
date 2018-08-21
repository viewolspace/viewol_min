// pages/activity/info.js
const app = getApp()
const appData = app.globalData
const http = app.globalData.http

var WxParse = require('../../wxParse/wxParse.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    userid: '',
    info: '',
    toView: '',
    tixing: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      id:options.id,
      userid: appData.uid
    },function(){
      that.getSchedule()
    })
  },
    
  //获取详情
  getSchedule: function () {
    var that = this
    wx.request({
      url: http + '/schedule/getSchedule',
      data: { id: that.data.id, userId: that.data.userid},
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======获取详情======")
        console.log("id:" + that.data.id)
        console.log("userid:" + that.data.userid)
        console.log("======end======")

        console.log(res)
        var re = JSON.parse(res.data)
        that.setData({
          "info": re.result
        },function(){
          that.toView()
        })
      }
    })
  },


  toView:function(){
    var article = this.data.info.contentView; 
    console.log(article)
    var that = this;
    WxParse.wxParse('toView', 'html', article, that, 5); 
  },

  changechose:function(){
    this.setData({
      tixing:!this.data.tixing
    })
  },

  //提交
  applyJoin: function () {
    var that = this
    wx.request({
      url: http + '/schedule/applyJoin',
      data: { 
        scheduleId: that.data.id, 
        userId: that.data.userid, 
        needReminder:that.data.tixing},
      method: "POST",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======提交报名======")
        console.log("scheduleId:" + that.data.id)
        console.log("userId:" + that.data.userid)
        console.log("needReminder:" + that.data.tixing)
        console.log("======end======")

        console.log(res)
        var re = JSON.parse(res.data)
        if(re.status == "0000"){
          app.t1("报名成功")
          var info = that.data.info
          info['applyStatus']=2
          that.setData({
            info:info
          })
        }else{
          app.t1(re.message)
        }
      }
    })
  },
})