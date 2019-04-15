import Dialog from '../../vant/dialog/dialog';
import Toast from '../../vant/toast/toast'; 
var app = getApp();
var util = require('../../../utils/util.js');
var orderId, orderCon, orderDetails, totalPrice, expressFee, freightMoney, premiumFee, premiumMoney, lastPrice, createTime, orderStatus, orderStatusText, orderStatusName, timeShow, arrowShow, orderIcon, remainSec, cannelShow, goodsId, balance, passwordHidden;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: app.globalData.domain,
    setInter:'',
    payShow: false,
    passwordHidden: false,
    payType: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    orderId = options.orderId;
    if (orderId == null || orderId == undefined){
      orderId = 726;
    }else{
      orderId = options.orderId;
    }

    this.loadPro();
    this.decLoading();
    this.financeAccounts();
  },
  /**
   * 加载数据
   */
  loadPro: function(){
    var that = this;
    wx.request({
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "GET",
      url: app.globalData.requestUri + '/shop/order/detail?orderId=' + orderId,
      success: function (res) {
        if (res) {
          orderCon = res.data.obj;
          orderDetails = res.data.obj.orderDetails[0];
          totalPrice = res.data.obj.orderDetails[0].amount * res.data.obj.orderDetails[0].price;
          expressFee = res.data.obj.expressFee;
          premiumFee = res.data.obj.premiumFee;
          goodsId = res.data.obj.orderDetails[0].shopProduct.id;
          if (premiumFee && premiumFee > 0) {
            freightMoney = '￥' + expressFee;
          } else {
            freightMoney = '包运费';
          }
          if (premiumFee && premiumFee > 0){
            premiumMoney = '￥' + premiumFee;
          }else{
            premiumMoney = '包保价费';
          }
          lastPrice = res.data.obj.totalPrice;
          createTime = util.tsFormatTime(new Date(res.data.obj.createTime),'Y-M-D h:m:s');
          orderStatus = res.data.obj.orderStatus;
          orderStatusName = res.data.obj.orderStatusName;
          remainSec = res.data.obj.remainingTime;
          that.setData({
            orderCon: orderCon,
            orderDetails: orderDetails,
            totalPrice: totalPrice,
            freightMoney: freightMoney,
            premiumMoney: premiumMoney,
            lastPrice: lastPrice,
            createTime: createTime,
            orderStatus: orderStatus,
            orderStatusName: orderStatusName,
            remainSec: remainSec,
            domain: app.globalData.domain
          });

          that.queryFlow();
          that.data.setInter = setInterval(that.countdownInterval, 1000);
        }
      }
    });
  },
  /**
   * 订单状态描述显示判断
   */
  queryFlow: function () {
    timeShow = false;
    arrowShow = false;
    cannelShow = false;
    orderStatusText = this.data.orderStatusText;
    if (orderStatus == 0) {
      timeShow = true;
      cannelShow = true;
      orderStatusText = '订单还未支付，好物不等人，请尽快支付哦~';
    } else if (orderStatus == 1){
      cannelShow = true;
    } else if (orderStatus == 3) {
      orderStatusName = '已过期';
      orderStatusText = '订单超时未支付，系统自动取消';
    } else {

    }
    this.setData({
      orderStatusText: orderStatusText,
      orderStatusName: orderStatusName,
      timeShow: timeShow,
      arrowShow: arrowShow,
      cannelShow: cannelShow
    })

  },
  /**
   * 订单状态描述加载
   */
  decLoading: function () {
    var that = this;
    wx.request({
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "GET",
      url: app.globalData.requestUri + '/shop/order/flow/member/last?id=' + orderId,
      success: function (res) {
        if (res.data && res.data.description) {
          orderStatusText = res.data.description;
          that.setData({
            orderStatusText: orderStatusText
          })

        }
      }
    });
  },
  /**
   * 支付倒计时
   */
  countdownInterval: function () {
    var that = this;
    remainSec = parseInt(remainSec - 1);
    var hour = parseInt(remainSec / 3600);
    var minute = parseInt((remainSec - hour * 3600) / 60);
    var second = parseInt(remainSec - hour * 3600 - minute * 60);

    if (hour <= 0 && minute <= 0 && second <= 0) {
      timeShow = false;
      clearInterval(that.data.setInter);
    } else {
      if(hour < 1){
        hour = '00';
      }else if(minute < 1){
        minute = '00';
      }else if(second <= 1){
        second = '00';
      }
      var time = hour + '小时' + minute + '分' + second + '秒';
      this.setData({
        time: time
      })
    }
  },

  /**
   * 复制订单编号
   */
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  cancelOrder: function() {
    var that = this;
    Dialog.confirm({
      message: '确定要取消订单吗？'
    }).then(() => {
      // on confirm
      that.deliveryConfirm();
    }).catch(() => {
      // on cancel
    });
  },
  deliveryConfirm: function() {
    var that = this;
    wx.request({
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'PUT',
      url: app.globalData.requestUri + '/shop/order/cancelOrder?orderId=' + orderId,
      success: function (res) {
        if (res && res.data.success) {
          Toast('取消订单成功!');
          clearInterval(that.data.setInter);
          that.queryFlow();
          that.loadPro();
        }else{
          Toast(res.data.message);
        }
      }
    })
  },
  /**
   * 再次购买
   */
  repeatBuy: function (){
    wx.navigateTo({
      url: '../../shopmall/detail/detail?id=' + goodsId
    })
  },
  /**
   * 去支付
   */
  toPay: function (event) {
    var that = this;
    if (that.data.setInter && remainSec > 0) {
      var hour = parseInt(remainSec / 3600);
      var minute = parseInt((remainSec - hour * 3600) / 60);
      var orderTimeId;

      if (hour > 0) {
        orderTimeId = '订单已提交，请在' + hour + '小时' + minute + '分完成支付';
      } else if(minute >= 1) {
        orderTimeId = '订单已提交，请在' + minute + '分钟完成支付';
      } else {
        orderTimeId = '订单已提交，请尽快完成支付';
      }

    } else {
      orderTimeId = '订单已提交，请尽快完成支付';
    }
    this.setData({
      payShow: true,
      orderTimeId: orderTimeId
    })
  },
  /**
   * 退出支付
   */
  closePay: function (event) {
    this.setData({
      payShow: false,
      passwordShow: true
    })
  },
  /**
   * 余额查询
   */
  financeAccounts: function() {
    var that = this;
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
          balance = res.data.useBalance;

          that.setData({
            balance: balance
          })
        }

      }
    })
  },
  /**
   * 输入交易密码
   */
  onChangePassword: function(e){
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 确认支付
   */
  confirmPay: function(){
    var password = this.data.name;
    if (!balance || (balance < lastPrice)){
      Toast('余额不足，请充值或者选择其他支付方式');
      return;
    }
    if (!password) {
      Toast('交易密码不能为空');
      return;
    }
    var that = this;
    wx.request({
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      url: app.globalData.requestUri + '/shop/order/pay/account?id=' + orderId + '&payPwd=' + password,
      success: function (res) {
        
        
        if (res && res.data.success) {
          if (that.data.setInter) {
            clearInterval(that.data.setInter);
          }
          Toast('支付成功');
          that.financeAccounts();
          that.loadPro();
          that.decLoading();
          that.closePay();
        }else{

          if (res.data.code == '1112') {
            Toast('您还没有实名绑卡，请先实名绑卡');
          } else {
            Toast(res.data.message);
          }
        }

      }
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