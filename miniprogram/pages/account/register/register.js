// pages/account/register/register.js
var app = getApp();
var Base64 = require("../../../utils/base64.js");
var typeEye, iconEye;

Page({
  /**
   * 页面的初始数据
   */
  /**
    * 页面的初始数据
    */
  data: {
    password: '',
    username: '',
    sms: '',
    timer: '',
    smsInterval: app.globalData.smsInterval,
    smsText: '发送验证码',
    typeEye: 'password',
    iconEye: 'closed-eye'
  },

  usernameInput: function (event) {
    this.setData({
      username: event.detail
    })
  },
  smsInput: function (event) {
    this.setData({
      sms: event.detail
    })
  },
  passwordInput: function (event) {
    this.setData({
      password: event.detail
    })
  },
  countDown: function(){
    var _this = this
    _this.setData({
      timer: setInterval(function () {
        var smsInterval = _this.data.smsInterval - 1
        _this.setData({
          smsInterval: smsInterval,
          smsText: smsInterval
        })
        if (smsInterval == 0) {
          clearInterval(_this.data.timer)
          _this.setData({
            smsInterval: app.globalData.smsInterval,
            smsText: '发送验证码'
          })
        }
      }, 1000)
    })
  },
  sendSms: function (event) {
    var _this = this;

    if (!_this.data.username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return;
    }

    var that = this;
    wx.request({
      url: app.globalData.requestUri + "/members/validate/mobile?mobile=" + _this.data.username,
      method: "GET",
      success: function (res) {
        if (!res.data.value) {
          wx.showToast({
            title: "手机号已注册",
            icon: 'none'
          })
        } else {
          wx.request({
            url: app.globalData.requestUri + "/validate-code/register",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
              mobile: _this.data.username
            },
            success: function (res) {
              if (res.data.success) {
                if (res.data.message) {
                  if (res.data.message === 'already_send') {
                    wx.showToast({
                      title: "验证码已发送，请勿重复点击!",
                      icon: 'none'
                    })
                  } else {
                    _this.countDown();
                  }
                } else {
                  _this.countDown();
                }
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  register: function (event) {
    var _this = this;

    if (!_this.data.username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return;
    }
    if (!_this.data.sms) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    }
    if (!_this.data.password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return;
    }

    var passwordBase64 = Base64.encode(_this.data.password)
    wx.request({
      url: app.globalData.requestUri + '/members/register',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {       
        mobile: _this.data.username,
        password: passwordBase64,
        platfromSource: 1,
        verificationCode: _this.data.sms
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          var obj = res.data.obj;
          wx.setStorageSync("token", obj.message.split("_")[1])
          wx.setStorageSync("hideMobile", obj.member.hideMobile)

          wx.showToast({
            title: '注册成功',
            success: function () {
              wx.switchTab({
                url: '../main/main',
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.message
          })
        }
      }
    })
  },
  loginFun: function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  onClickIcon: function(e){
    var that = this;
    typeEye = e.target.dataset.type;
    if (typeEye == 'password') {
      typeEye = 'text';
      iconEye = 'eye-o';
    } else {
      typeEye = 'password';
      iconEye = 'closed-eye'
    }
    that.setData({
      typeEye: typeEye,
      iconEye: iconEye
    })
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