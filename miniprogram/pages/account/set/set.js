// pages/account/set/set.js
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  logout: function(event){
    WxNotificationCenter.postNotificationName("exitEvent");

    wx.removeStorage({
      key: 'key',
      success: function(res) {},
    })
    wx.removeStorage({
      key: 'token',
      success: function (res) { },
    })

    setTimeout(function () {
      wx.switchTab({
        url: '../main/main'
      })
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})