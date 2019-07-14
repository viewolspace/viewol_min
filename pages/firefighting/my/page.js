const { globalData, globalData: { http, regeneratorRuntime } } = getApp()


Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        const { data: { status, result, message } } = await wx.pro.request({
            url: `${http}/buser/getBuser`,
            method: 'GET',
            data: { userId: 34 }
        })
        if (status === '0000') {
            this.setData(result)
        }
    },

})