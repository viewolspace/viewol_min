const WxParse = require('../../../wxParse/wxParse.js');
const { globalData: { http, expoId, regeneratorRuntime } } = getApp()

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
            WxParse.wxParse('article', 'html', product.contentView, this, 5);
            this.getRelativeProduct(company.id)
        }
    },

    getRelativeProduct: async function(companyId) {
        const { data: { status, message, result } } = await wx.pro.request({
            url: `${http}/product/listProduct`,
            method: 'GET',
            data: {
                expoId,
                companyId,
                num: 3
            }
        })

        if (status === '0000') {
            this.setData({
                relative_products: result
            })
        }
    }

})