const { globalData: { http, regeneratorRuntime } } = getApp()
const sliderWidth = 28; // 需要设置slider的宽度，用于计算中间位置

Page({
    data: {
        year: '2019',
        month: '10',
        tabs: [
            {
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
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        schedule_list: []
    },

    onLoad: async function () {
        var that = this
        const res = await wx.pro.getSystemInfo()
        that.setData({
            sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
            sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
        this.getScheduleList()
    },

    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        this.getScheduleList()
    },

    getScheduleList: async function () {
        const { activeIndex, tabs, year, month } = this.data
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/schedule/listSchedule`,
            method: 'GET',
            data: {
                expoId: 1,
                // date: `${year}-${month}-${tabs[activeIndex]['date']}`,
                num: 200
            }
        })
        this.setData({ schedule_list: result })
    }

});