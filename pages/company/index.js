// pages/company/index.js
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
    autoplay: false, //swiper自动播放开关
    interval: 2300, //swiper自动切换时间间隔
    duration: 1000,  //swiper滑动动画时长


    article:'',
    tab:'company', 
    id:'',
    info:'',
    productlist:[], //存放所有数据，每翻下一页获取到的数据就插入到此
    list:[], //存放当前页的数据
    lastSeq:'',
    num:12,
    page:0,
    categoryId:'',
    keyword:'',
    islast:false,

    tonglei:1,
    tonglelist:'',
    
    collection:'',
    isLogin:false,

    action: '',
    companyId: '',
    bUserId: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that= this

    if(options.act!=null){
      var act = options.act
    }else{
      var act ="company"
    }

    if (options.keyword != null) {
      var keyword = options.keyword
    } else {
      var keyword = ""
    }

    if (options.catid != null) {
      var catid = options.catid
    } else {
      var catid = ""
    }

    if (options.id != null) {
      var id = options.id
    } else {
      var id = ""
    }

    if (options.c) {
      var companyId = options.c
    } else {
      var companyId = ''
    }

    if (options.u) {
      var bUserId = options.u
    } else {
      var bUserId = ''
    }

    if (options.a) {
      var action = options.a
    } else {
      var action = ''
    }

    if (appData.uid != null || appData.uid != "") {
      that.setData({
        isLogin: true
      })
    }


    if (options.a){
      var getisLogin = setInterval(function () {
        if (that.data.isLogin) {
          console.log("已登录")
          clearInterval(getisLogin)
          //已登录
          console.log("已登录userid:" + appData.uid)
          that.setData({
            id: id,
            tab: act,
            categoryId: catid,
            keyword: keyword,

            action: action,
            bUserId: bUserId,
            companyId: companyId,

          }, function () {

            that.getCompany()

            if (options.a != null && options.a == 1) {
              console.log("进入交换名片流程")
              that.jumpIndex(options.c, options.u)
              return false;
            }

            
            if (catid != "" || keyword != "" || act == "product") {
              console.log("筛选页跳转过来categoryId：" + that.data.categoryId)
              that.listProduct()
            }
          })
        }
      }, 1500)
    }else{
      that.setData({
        id: id,
        tab: act,
        categoryId: catid,
        keyword: keyword,

        action: action,
        bUserId: bUserId,
        companyId: companyId,
      }, function () {
        that.getCompany()

        if (catid != "" || keyword != "" || act == "product") {
          console.log("筛选页跳转过来categoryId：" + that.data.categoryId)
          that.listProduct()
        }
      })
    }


    //判断是否已经登录
    if (appData.uid == null || appData.uid == ""){
      //未登录
      app.userLogin()
      var loaduserinfo = setInterval(function () {
        if(appData.uid==null || appData.uid ==""){
          return false;
        }else{
          //登录成功
          console.log("登录成功userid："+appData.uid)
          that.setData({
            isLogin:true
          })
          clearInterval(loaduserinfo);
        }
      }, 1000)
    }


  },



  setTab:function(e){
    this.setData({
      tab: e.currentTarget.dataset.tab,
    })
    if (e.currentTarget.dataset.tab == 'product' ){
      this.setData({
        productlist: [], //存放所有数据，每翻下一页获取到的数据就插入到此
        list: [], //存放当前页的数据
        lastSeq: '',
        num: 12,
        page: 0,
        categoryId: '',
        keyword: '',
        islast: false,
      })
      this.listProduct()

    }
  },

  //获取展商详情
  getCompany: function () {
    var that = this
    app.t1("加载中..", "loading")
    wx.request({
      url: http + '/company/getCompany',
      data: {
        id: that.data.id,
        userId: appData.uid,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        
        var re = JSON.parse(res.data)
        console.log("======获取展商详情======")
        console.log(res)
        console.log("======end======")
        if(re.result!=null){
          that.setData({
            info:re.result,
            collection: re.collection,
            categoryId: re.categoryId
          },function(){
            that.listByCategory()
            that.toView()
          })
        }
      }
    })
  },

  toView: function () {
    var that = this
    var article = that.data.info.contentView
    WxParse.wxParse('article', 'html', article, that, 5);
  },


  //翻页
  paging:function(e){
    var that = this
    console.log("执行翻页：" + e.currentTarget.dataset.act)
    if (e.currentTarget.dataset.act=="next" ){
      //下一页
      var page = that.data.page 

      if (that.data.islast) {
        //已获取全部数据
        if (page < that.data.productlist.length){
          console.log("从历史数据中读取下一页数据第" + (page + 1) + "条")
          that.setData({
            list: []
          })
          that.setData({
            list: that.data.list.concat(that.data.productlist[page]),
            page: page + 1 //设置当前页page
          })
        }
      }else{
        if (page >= that.data.productlist.length) {
          console.log("请求新数据")
          that.listProduct()
        }else{
          if (page < that.data.productlist.length) {
            console.log("从历史数据中读取下一页数据第" + (page + 1) + "条")
            that.setData({
              list: []
            })
            that.setData({
              list: that.data.list.concat(that.data.productlist[page]),
              page: page + 1 //设置当前页page
            })
          }
        }
      }

    }else{
      //查看上一页
      var page = that.data.page-1
      console.log(that.data.productlist)
      if(page>0){
        console.log(" page > 0 ")
        that.setData({
          list:[]
        })
        that.setData({
          list:  that.data.list.concat(that.data.productlist[page - 1]),
          page: page
        },function(){
          console.log(that.data.list)
        })
      }else{
        console.log("到第一页了")
      }
    }
    
  },


  //获取产品列表
  listProduct: function () {
    var that = this

    app.t1("加载中..", "loading")
    wx.request({
      url: http + '/product/listProduct',
      data: {
        companyId: that.data.id,
        name:that.data.keyword,
        categoryId: that.data.categoryId,
        lastSeq: that.data.lastSeq,
        num: that.data.num,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======获取产品列表======")
        console.log("companyId:" + that.data.id)
        console.log("name:" + that.data.keyword)
        console.log("categoryId:" + that.data.categoryId)
        console.log("lastSeq:" + that.data.lastSeq)
        console.log("num:" + that.data.num)
        console.log("======end======")
        
        console.log(res)
        var re = JSON.parse(res.data)
        if (re.result != '') {
          var data=[]
          data[0]=re.result;

          that.setData({
            productlist: that.data.productlist.concat(data),
            lastSeq: re.result[re.result.length - 1].seq,
            page: that.data.page+1,
            list: re.result
          },function(){
            console.log(that.data.productlist)
          })        
        }else{
          app.t1("没有内容了","none")
          that.setData({
            islast:true
          })
        }
      }
    })
  },


  //同类推荐
  listByCategory: function () {
    var that = this

    that.setData({
      tonglelist:'',
    })

    app.t1("加载中..", "loading")
    wx.request({
      url: http + '/recommend/listByCategory',
      data: {
        categoryId: that.data.categoryId,
        type: that.data.tonglei
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("=======获取同类========")
        console.log("categoryId:" + that.data.categoryId)
        console.log("type:" + that.data.tonglei)
        console.log(res)
        console.log("=======end========")
        var re = JSON.parse(res.data)
        if (re.result != null) {
          that.setData({
            tonglelist: re.result,
          })
        }
      }
    })
  },

  //处理收藏（添加收藏 / 删除收藏）
  handlRecommend:function(){
    console.log("1111111")
    var that =this 
    if (that.data.collection == 1 ){
      var url = "/fuser/delUserCollection"
      var rs  = 0
    }else{
      var url = "/fuser/addUserCollection"
      var rs = 1
    }

    wx.request({
      url: http + url,
      data: {
        userId: appData.uid,
        type: 1,
        thirdId:that.data.id
      },
      method: "POST",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("======处理收藏请求======")
        console.log("collection:" + that.data.collection)
        console.log("userId:" + appData.uid)
        console.log("type:1" )
        console.log("thirdId:" + that.data.id)
        console.log("======end======")
        console.log(res)
        var re = JSON.parse(res.data)
        if (re.status == "0000") {
          app.t1(re.message)
          that.setData({
            collection: rs
          })
        }else{
          app.t1(re.message,"none")
        }
      }
    })
  },


  //设置搜索关键字
  setKeyword: function (e) {
    console.log(e.detail.value)
    this.setData({
      keyword: e.detail.value,
    })
  },

  //关键字搜索
  keywordSearch: function () {
    var that = this
    this.setData({
      lastSeq: '',
      productlist: [], //存放所有数据，每翻下一页获取到的数据就插入到此
      list: [], //存放当前页的数据
      islast: false,
      page:0,
      categoryId:'',
    },function(){
      that.listProduct()
    })
    
  },

  //判断是否需要完善用户信息
  jumpIndex: function (companyId, bUserId ) {
    wx.request({
      url: http + '/fuser/isPerfectnfo',
      data: {
        userId: appData.uid,
      },
      method: "GET",
      dataType: JSON,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("========判断是否需要完善信息===========")
        console.log("入参userId：" + appData.uid)
        console.log(res)
        var re = JSON.parse(res.data)
        if (re.status == "0000") {
          //交换名片
          wx.redirectTo({
            url: '../changecard/index?&companyId=' + companyId + '&userId=' + appData.uid+'&bUserId=' + bUserId
          })
        } else {
          //跳转去完善信息,
          wx.redirectTo({
            url: '../edituserinfo/index?userId=' + appData.uid + '&u=' + bUserId + "&c=" + companyId + "&a=1"
          })
        }
      }
    })
  }
  
})