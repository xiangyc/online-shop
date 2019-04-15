var app = getApp();
var adressUrl = app.globalData.requestUri + '/delivery-addresses';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkbox: false
  },

  // 加载地址列表数据
  onLoad: function () {
    var that = this;
    wx.request({
      url: adressUrl,
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1"
      },
      method: "GET",
      success: function (res) {
        // 有数据
        if (res && res.data.length > 0) {
          that.setData({
            adressList: res.data
          });
        }
      }
    })
  },

  chooseAddress(event) {
    var object = event.currentTarget.dataset;
    var consignee = object.consignee;
    var hidemobile = object.hidemobile;
    var addressdetail = object.addressdetail;
    var pages = getCurrentPages();
    console.log(pages);
    var prevPage = pages[pages.length - 2];  //上一个页面 
    prevPage.setData({
      consignee: consignee,
      hidemobile: hidemobile,
      addressdetail: addressdetail
    }) 

    //返回上一级关闭当前页面 
    wx.navigateBack({
      delta: 1
    }) 

  },

  manageAdress: function() {
    wx.navigateTo({
      url: '../list/list',
    })
  },

})