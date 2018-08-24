// pages/my/downer.js
const app = getApp()
const appData = app.globalData
const http = app.globalData.http
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    idarr:[],
    ids:'',
    lastId:'',
    num:12,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.listDownloadRecord()
  },

  checkboxgroupBindchange:function(e){
    console.log(e)
    var that = this
    this.setData({
      idarr:e.detail.value
    },function(){
      var idarr = that.data.idarr
      var list = that.data.list

      //idarr转字符串
      var ids = idarr.join(',');

      for (var c = 0; c < list.length; c++){
        list[c]['ischioce'] = false
      }

      for (var i = 0; i < idarr.length ; i++){
        for (var n = 0; n < list.length ; n++){
          if (idarr[i] == list[n]['productId']){
            list[n]['ischioce'] = true
          }
        }
      }

      that.setData({
        list:list,
        ids: ids
      })
    })
  },


  //获取下载记录
  listDownloadRecord: function () {
    var that = this
    app.t1("加载中..", "loading")
    wx.request({
      url: http + '/fuser/listDownloadRecord',
      data: {
        userId: appData.uid,
        lastId: that.data.lastId,
        num: that.data.num,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======获取下载记录======")
        console.log("userId:" + appData.uid)
        console.log("num:" + that.data.num)
        console.log("lastId:" + that.data.lastId)
        console.log("======end======")

        console.log(res)
        var re = JSON.parse(res.data)
        if (re.result != null) {
          var list = re.result;
          for (var i=0; i<list.length;i++){
            list[i]['ischioce']=false
          }
          that.setData({
            list: that.data.list.concat(list),   //将新获取到的数组 插入到原数组
            lastId: re.result[re.result.length - 1].id
          })
        } else {
          app.t1("没有内容啦", "none",3000)
        }
      }
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listDownloadRecord()
  },

  //发送下载记录
  sendMail: function () {
    var that = this
    app.t1("加载中..", "loading")
    wx.request({
      url: http + '/fuser/sendMail',
      data: {
        userId: appData.uid,
        ids: that.data.ids,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======发送邮件======")
        console.log("userId:" + appData.uid)
        console.log("ids:" + that.data.ids)
        console.log("======end======")

        console.log(res)
        var re = JSON.parse(res.data)
        if (re.status =="0000" ) {
          app.t1("提交成功")
        } else {
          app.t1(re.message, "none",3000)
        }
      }
    })
  },


})