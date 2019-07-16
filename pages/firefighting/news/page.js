const { globalData: { http, regeneratorRuntime } } = getApp()
Page({
    data: {
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        lastSeq: '',
        info_list: [],
        loadding: false
    },
    onLoad: function () {
        this.getInfoList()
    },

    getInfoList: async function () {
        const { lastSeq, info_list = [] } = this
        const { data: { status, message, result = [] } } = await wx.pro.request({
            url: `${http}/info/list`,
            method: 'GET',
            data: {
                classify: 1,
                lastSeq,
                pageSize: 10
            }
        })

        if (status === '0000') {
            this.setData({ info_list: info_list.concat(result) })
        }
    }
})