const { globalData, globalData: { http, uid, regeneratorRuntime } } = getApp()


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
            url: `${http}/fuser/getFuser`,
            method: 'GET',
            data: { userId: uid }
        })
        if (status === '0000') {
            this.setData(result)
        }
    },

})