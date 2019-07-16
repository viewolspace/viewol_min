const WxParse = require('../../../wxParse/wxParse.js');
const { globalData: { http, regeneratorRuntime } } = getApp()

Page({
    data: {},
    onLoad: function (option) {
        const { id } = option
        this.getActivityInformation(id)
    },

    getActivityInformation: async function (id) {
        const { data: { status, message, result } } = await wx.pro.request({
            url: `${http}/schedule/getSchedule`,
            method: 'GET',
            data: { id }
        })

        if (status === '0000'){
            this.setData({ info: result })
            WxParse.wxParse('article', 'html', result.contentView, this, 5);
        } 
    }
})