import util from '../../../utils/util.js'

const app = getApp()
const { globalData, globalData: { http, regeneratorRuntime } } = app

Page({

    /**
     * 页面的初始数据
     */
    data: {
        recomment_company_list: [],
        recomment_product_list: [],
        hot_schedule_list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getRecommentCompanyList()
        this.getProductCompanyList()
        this.getNowHostSchedule()
    },

    getRecommentCompanyList: async function() {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/company/recommentCompanyList`,
            method: 'GET',
            data: {
                expoId: 1
            }
        })
        if (status === '0000') {
            this.setData({
                recomment_company_list: util.chunk(result, 4)
            })
        }
    },

    getProductCompanyList: async function() {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/product/recommentProductList`,
            method: 'GET',
            data: {
                expoId: 1
            }
        })
        if (status === '0000') {
            this.setData({
                recomment_product_list: result
            })
        }
    },

    getNowHostSchedule: async function() {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/schedule/queryNowHostSchedule`,
            method: 'GET',
            data: {
                expoId: 1
            }
        })
        if (status === '0000') {
            this.setData({
                hot_schedule_list: result
            })
        }
    }
})