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
    autoplay: true, //swiper自动播放开关
    interval: 3000, //swiper自动切换时间间隔
    duration: 1000,  //swiper滑动动画时长


    article:'',
    tab:'company', 
    id:'',
    info:'',
    map_url:'',//地图的地址
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

    userid:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that= this

    app.globalData.url = ""

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

    //获取扫码scene参数
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      var datas_temp = scene.split(":");
      var action = datas_temp[0]
      var companyId = datas_temp[1]
      var bUserId = datas_temp[2]
    }else{
      var action = ""
      var companyId = ""
      var bUserId = ""
    }

    if (appData.uid != null || appData.uid != "") {
      that.setData({
        isLogin: true
      })
    }

    this.setData({
      id: id,
      tab: act,
      categoryId: catid,
      keyword: keyword,

      action: action,
      bUserId: bUserId,
      companyId: companyId,

      userid: appData.uid,
    })


    if (action==1){
      //交换名片流程
      if(app.globalData.uid==null){
        //从分享页进来未登录
        var urlValue = "../company/index?scene=" + options.scene
        app.globalData.url = urlValue
        wx.redirectTo({
          url: '../login/index'
        })
      }else{
        //从分享页进来并已登录
        console.log("进入交换名片流程")
        that.jumpIndex(companyId, bUserId)
      }
    }else{
      that.getCompany() //获取展商信息
      if (catid != "" || keyword != "" || act == "product") {
        console.log("筛选页跳转过来categoryId：" + that.data.categoryId)
        that.listProduct()
      }
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
          var temp_map_url = '';
          if (re.result.place.length>2){
            temp_map_url = re.result.place.substring(0, 2).toUpperCase() + ".html?companyId=" + re.result.id;
          }else{
            temp_map_url = "W1.html"
          }
          console.log(encodeURIComponent(temp_map_url));
          that.setData({
            info:re.result,
            map_url: temp_map_url,
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