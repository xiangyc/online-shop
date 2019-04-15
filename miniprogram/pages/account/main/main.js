// pages/account/main/main.js
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js")
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: "请登录",
    payShow: false,
    passwordHidden: false,
    payType: '1',
    useBalance: 0
  },

  toOrder: function (event){
    var status = event.currentTarget.dataset.id;
    var active = event.currentTarget.dataset.active;
    wx.navigateTo({
      url: '../order/order?status=' + status + '&active=' + active
    })
  },
  toAddress: function () {
    wx.navigateTo({
      url: '../deliveryAddress/list/list'
    })
  },
  toclllectProduct: function () {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  toSet: function () {
    wx.navigateTo({
      url: '../set/set'
    })
  },
  financeAccounts: function () {
    var _this = this;
    wx.request({
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'GET',
      url: app.globalData.requestUri + '/finance-accounts',
      success: function (res) {
        if (res) {
          _this.setData({
            useBalance: res.data.useBalance
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    WxNotificationCenter.addNotification("exitEvent", _this.exitFunction, _this)
    WxNotificationCenter.addNotification("loginEvent", _this.loginFunction, _this)

    if (!wx.getStorageSync("token")){
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      _this.setData({ mobile: wx.getStorageSync("hideMobile")})
      _this.financeAccounts();
    }
  },
  loginFunction: function (data) {
    this.setData({ mobile: data.hideMobile })
    this.financeAccounts();
  },
  exitFunction: function(data){
    this.setData({ 
      useBalance: 0,
      mobile: '请登录'
    })
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
    var that = this
    WxNotificationCenter.removeNotification("exitEvent", that)
    WxNotificationCenter.removeNotification("loginEvent", that)    
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
    return {
      title: '分享测试',
      path: '/pages/shopmall/detail/detail?id=2',
      //path: '/pages/index/index',
      success: function (res) { 
        log(res)
      }
    }
  },
  payTypeChange: function(event){
    if (event.detail.value == "1") {
      this.setData({
        payType: "1",
        passwordHidden: false
      })
    } else {
      this.setData({
        payType: "2",
        passwordHidden: true
      })
    }
  },
  toPay: function(event){
    this.setData({
      payShow: true
    })
  },
  closePay: function(event){
    this.setData({
      payShow: false,
      passwordShow: true
    })
  },
  confirmPay: function (event){
    //支付业务逻辑实现
    //console.log(this.data.payType + '    ' + this.data.passwordShow);
    wx.showToast({
      title: '支付业务逻辑实现',
      icon: 'none'
    })
  }
})