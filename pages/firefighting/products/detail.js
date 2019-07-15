const WxParse = require('../../../wxParse/wxParse.js');
const { globalData: { http, regeneratorRuntime } } = getApp()

Page({
    data: {
        id: null
    },
    onLoad: function(option) {
        this.getProductInformation(option.id)
    },

    getProductInformation: async function(id) {
        const { data: { code, collection, comment, company, isPraise, message, praise, result: product, see } } = await wx.pro.request({
            url: `${http}/product/getProduct`,
            method: 'GET',
            data: { id }
        })
        if (code === '0000') {
            this.setData({ code, collection, comment, company, isPraise, message, praise, product, see })
            const that = this
            WxParse.wxParse('article', 'html', product.contentView, that, 5);
        }
    },


})