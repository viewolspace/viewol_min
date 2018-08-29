const app = getApp()
const appData = app.globalData
const http = app.globalData.http
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    list: [],
    globaluserinfo: '',

    lastId:'',
    pageSize:20,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      uid: appData.uid,
      globaluserinfo: appData.userInfo
    },function(){
      that.mycardList()
    })
  },

  //获取名片夹
  mycardList: function () {
    var that = this
    app.t1("加载中..", "loading")
    wx.request({
      url: http + '/ucard/mycardList',
      data: {
        fUserId: that.data.uid,
        lastId: that.data.lastId,
        pageSize: that.data.pageSize,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======获取名片夹======")
        console.log("fUserId:" + that.data.uid)
        console.log("lastId:" + that.data.lastId)
        console.log("pageSize:" + that.data.pageSize)
        console.log(res)
        console.log("======end======")
        var re = JSON.parse(res.data)
        if (re.result != null) {
          that.setData({
            list: that.data.list.concat(re.result),   //将新获取到的数组 插入到原数组
            lastId: re.result[re.result.length - 1].id
          })
        }else{
          app.t1("没有内容啦","none")
        }
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.mycardList()
  },

  //拨打电话
  tel: function (e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  }
})