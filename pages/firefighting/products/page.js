const { globalData: { http, regeneratorRuntime } } = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        product_list: [],
        category_list: [],
        lastSeq: '',
        keyWord: '',
        loadding: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getCategoryList()
        this.getProductList()
    },


    onReachBottom: function() {
        this.getProductList()
    },

    showCategoryList: function(event) {
        const status = (+event.currentTarget.dataset.status === 1)
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export()
        })
        if (status) {
            this.setData({
                showModalStatus: true
            });
        }
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation
            })
            if (!status) {
                this.setData({
                    showModalStatus: false
                });
            }
        }.bind(this), 200)
    },

    changeCategory: function(event) {
        const id = event.currentTarget.dataset.id
        this.setData({ categoryId: id })
        this.getProductList(true)
        this.showCategoryList(event)
    },

    changeKeyword: function(event) {
        this.setData({ keyWord: event.detail.value })
        this.getProductList(true)
    },

    getProductList: async function(is_replace = false) {
        this.setData({ loadding: true })
        const { keyWord = '', categoryId = '', lastSeq, product_list } = this.data
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/product/listProduct`,
            method: 'GET',
            data: {
                expoId: 1,
                keyWord,
                categoryId,
                lastSeq: is_replace ? '' : lastSeq,
                num: 20
            }
        })

        if (status === '0000') {
            this.setData({ product_list: is_replace ? result : product_list.concat(result) })
            if (is_replace) this.setData({ lastSeq: '' })
            else if (result.length) this.setData({ lastSeq: result[result.length - 1]['seq'] })
        }

        this.setData({ loadding: false })
        console.log("TCL: this.data.loadding", this.data.loadding)
    },

    getCategoryList: async function() {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/category/listCategory`,
            method: 'GET',
            data: {
                parentId: '0002'
            }
        })

        if (status === '0000') {
            this.setData({ category_list: result })
        }
    }

})