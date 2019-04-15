import Toast from '../../vant/toast/toast';
var app = getApp();
var searchUrl = app.globalData.requestUri + "/shop-product/searchRecord";
var delSearchUrl = app.globalData.requestUri + "/shop-product/searchRecord/clear";

import Dialog from '../../vant/dialog/dialog';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    noDataShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: searchUrl,
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1"
      },
      method: "GET",
      success: function (res) {
        if (res && res.data) {
          console.log(1);
          that.setData({
            historyList: res.data,
            noDataShow: true
          });
        } else {
          console.log(2);
          // 无数据
          that.setData({
            historyList: [],
            noDataShow: false
          });
        }
      }
    })
  },

  onChange(event) {
    this.setData({
      value: event.detail
    });
  },

  onSearch: function (event) {
    if (this.data.value) {
      wx.navigateTo({
        url: '../shopList/shopList?key=' + this.data.value
      })
    } else {
      Toast('搜索内容不能为空');
      return;
    }
  },

  onShow: function () {
    this.onLoad();
  },

  onSearchRecord: function (event) {
    var object = event.currentTarget.dataset; 
    wx.navigateTo({
      url: '../shopList/shopList?key=' + object.key
    })
  },

  onDelete(event) {
    var that = this;
    Dialog.confirm({
      message: "确认删除所有搜索记录？"
    }).then(() => {
      wx.request({
        url: delSearchUrl,
        header: {
          "Authorization": "Bearer__" + wx.getStorageSync("token"),
          "Key": "Bearer__" + wx.getStorageSync("key"),
          "ClientId": "Bearer__1"
        },
        method: "get",
        success: function (res) {
          that.onShow();
        }
      })
    }).catch(function(err) {
    });
  }


})