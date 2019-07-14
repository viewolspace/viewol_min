var sliderWidth = 28; // 需要设置slider的宽度，用于计算中间位置

Page({
    data: {
        tabs: [{
                week: '二',
                date: 16,
            },
            {
                week: '三',
                date: 17,
            },
            {
                week: '四',
                date: 18,
            },
            {
                week: '五',
                date: 19,
            },
        ],
        activeIndex: 1,
        sliderOffset: 0,
        sliderLeft: 0
    },
    onLoad: function() {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
});