// pages/account/order/order.js
var app = getApp();
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: [],
    start: 0,
    maxResults: 6,
    domain: app.globalData.domain,
    status: '',
    balance: 0,
    payShow: false,
    password: '',
    passwordHidden: false,
    active: 0,
    payType: '1',
    paymoney: 0,
    orderId: ''
  },
  loadOrder: function (e) {
    var _this = this;
    // console.log(_this.data.start + " : " + _this.data.maxResults + " : " + _this.data.status)
    wx.request({
      url: app.globalData.requestUri + '/shop/order/pagelist?start=' + _this.data.start + '&maxResults=' + _this.data.maxResults + '&status=' + _this.data.status,
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1" 
      },
      success: function (res) {
        if (res.data.items && res.data.items.length > 0) {
          var dataArray = _this.data.orderArray;

          if(e === 2){
            dataArray = dataArray.concat(res.data.items);
          }else{
            dataArray = res.data.items
          }

          _this.setData({
            orderArray: dataArray
          })
        }else{
          if(e===0 || e===1){
            _this.setData({
              orderArray: []
            })
            wx.showToast({
              title: '暂无记录'
            })
          }else{
            wx.showToast({
              title: '暂无更多数据'
            })
          }
        }

        if (e === 1) {
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        }else if(e === 2){
          wx.hideNavigationBarLoading();
        }
      }
    })
  },
  onChange: function(event){
    var statusValue = ''
    switch(event.detail.index){
      case 1:
        statusValue = 1
        break;
      case 2:
        statusValue = 4
        break;
      case 3:
        statusValue = 2
        break;
      case 4:
        statusValue = 5
        break;
    }
    this.setData({
      status: statusValue,
      start: 0
    })

    this.loadOrder(0)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderStatus = options.status
    var orderActive = options.active

    if (orderStatus && orderStatus !=0){
      this.setData({
        status: orderStatus,
        start: 0,
        active: orderActive
      })
    } else {
      this.setData({
        status: "",
        start: 0,
        active: orderActive
      })
    }

    this.loadOrder(0)
    this.financeAccounts()
  },
  toDetail: function(event){
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderId=' + event.currentTarget.dataset.id,
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.setData({
      start: 0
    })
    this.loadOrder(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showNavigationBarLoading();
    this.setData({
      start: this.data.start + this.data.maxResults
    })
    this.loadOrder(2);
  },
  /**
   * 商品详情
   */
  goGoodsDetail: function (event) {
    var goodsDetailId = event.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../../shopmall/detail/detail?id=' + goodsDetailId
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
            balance: res.data.useBalance
          })
        }

      }
    })
  },
  onChangePassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  payTypeChange: function (event) {
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
  toPay: function (event) {
    this.setData({
      payShow: true,
      paymoney: event.currentTarget.dataset.price,
      orderId: event.currentTarget.dataset.id
    })
  },
  closePay: function (event) {
    this.setData({
      payShow: false,
      passwordShow: true
    })
  },
  confirmPay: function (event) {
    //支付业务逻辑实现
    //console.log(this.data.payType + '    ' + this.data.passwordShow);
    var _this = this

    if (!_this.data.balance || (_this.data.balance < _this.data.paymnoey)) {
      wx.showToast({
        title: '余额不足，请充值或者选择其他支付方式'
      })
      return;
    }
    if (!_this.data.password) {
      wx.showToast({
        title: '交易密码不能为空'
      })
      return;
    }

    wx.request({
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      url: app.globalData.requestUri + '/shop/order/pay/account?id=' + _this.data.orderId + '&payPwd=' + _this.data.password,
      success: function (res) {
        if (res && res.data.success) {
          wx.showToast({
            title: '支付成功'
          })
          
          _this.onPullDownRefresh()
          _this.closePay()
        } else {
          if (res.data.code == '1112') {
            wx.showToast({
              title: '您还没有实名绑卡，请先实名绑卡'
            })
          } else {
            wx.showToast({
              title: res.data.message
            })
          }
        }

      }
    })
  }
})

