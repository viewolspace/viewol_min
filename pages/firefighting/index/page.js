import util from '../../../utils/util.js'

const app = getApp()
const { globalData, globalData: { http, expoId, regeneratorRuntime } } = app

Page({
    data: {
        recomment_company_list: [],
        recomment_product_list: [],
        hot_schedule_list: [],
        recommend_schedule_list: [],
        height_product_swiper: null
    },

    onLoad: function (options) {
        const user_id = wx.getStorageSync('uid')
        if (!user_id && !globalData.uid) {
            wx.navigateTo({
                url: '../login/page'
            })
        } else {
            const session_id = wx.getStorageSync('sid')
            globalData.uid = user_id
            globalData.sid = session_id
        }
        this.getRecommentCompanyList()
        this.getProductCompanyList()
        this.getNowHostSchedule()
        this.getNowRecommendSchedule()
    },

    goExhibitors: function (event) {
        globalData.firefighting_exhibitors_award = event.currentTarget.dataset.award
        wx.switchTab({
            url: '../exhibitors/page',
        })
    },

    getRecommentCompanyList: async function () {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/company/recommentCompanyList`,
            method: 'GET',
            data: {
                expoId
            }
        })
        if (status === '0000') {
            let tmp = util.chunk(result, 4)
            let data = []
            for (let i = 0; i < tmp.length / 2; i++) {
                data.push([tmp[i * 2], tmp[i * 2 + 1] || tmp[0]])
            }
            this.setData({
                recomment_company_list: data
            })
        }
    },

    getProductCompanyList: async function () {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/product/recommentProductList`,
            method: 'GET',
            data: {
                expoId
            }
        })
        if (status === '0000') {
            this.setData({
                recomment_product_list: util.chunk(result, 3)
            })
        }
    },

    getNowHostSchedule: async function () {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/schedule/queryNowHostSchedule`,
            method: 'GET',
            data: {
                expoId
            }
        })
        if (status === '0000') {
            this.setData({
                hot_schedule_list: result
            })
        }
    },

    getNowRecommendSchedule: async function () {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/schedule/queryNowRecommendSchedule`,
            method: 'GET',
            data: {
                expoId,
                type: 2
            }
        })
        if (status === '0000') {
            this.setData({
                recommend_schedule_list: result
            })
        }
    }
})