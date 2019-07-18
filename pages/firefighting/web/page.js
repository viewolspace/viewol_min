Page({
    data: {
        url: null
    },

    onLoad: function ({ url, title }) {
        if (title) wx.setNavigationBarTitle({ title })
        this.setData({ url })
    }
})