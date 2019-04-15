// pages/account/login/login.js
var app = getApp();
var Base64 = require("../../../utils/base64.js");
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    username: ''
  },

  usernameInput: function(event){
    this.setData({
      username: event.detail
    })
  },
  passwordInput: function(event){
    this.setData({
      password: event.detail
    })
  },
  reset: function (event){
    this.setData({
      password: '',
      username: ''
    })
  }, 
  register: function(event){
    wx.navigateTo({
      url: '../register/register',
    })
  },
  login: function (event) {
    var _this = this;

    if (!_this.data.username ){
      wx.showToast({
        title: '请输入用户名',
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
      url: app.globalData.requestUri + '/auth/login',
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        userName: _this.data.username,
        password: passwordBase64,
        platfromSource: 1
      },
      success: function(res){
        if(res.data.success){
          var obj = res.data.obj;
          console.log(obj)
          wx.setStorageSync("token", obj.token)
          wx.setStorageSync("key", obj.key)
          wx.setStorageSync("hideMobile", obj.member.hideMobile)
          wx.setStorageSync("securityMobile", obj.member.securityMobile)
          wx.setStorageSync("hideName", obj.member.hideName)

          var param = { hideMobile: obj.member.hideMobile }
          WxNotificationCenter.postNotificationName("loginEvent", param);
          
          setTimeout(function(){
            wx.switchTab({
              url: '../main/main'
            })            
          }, 1000)
        }else{
          wx.showToast({
            title: res.data.message
          })
        }
      }
    })
  },
  wxlogin: function (event){
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: '',
            data: {
              code: res.code
            }
          })
        } else {
          wx.showToast({
            title: res.errMsg
          })
        }
      }
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