var app = getApp();
var adressUrl = app.globalData.requestUri + '/delivery-addresses';
var adressDefaultUrl = app.globalData.requestUri + '/delivery-addresses/default';
var delAdressUrl = app.globalData.requestUri + '/delivery-addresses/del';
import Dialog from '../../../vant/dialog/dialog';
import Toast from '../../../vant/toast/toast'; 
var defaultId, choiceId;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    noDataShow: false,
    manageDataShow: false,
    checkbox:false,
    show: false
  },
  //打开新增页面
  addAdress:function() {
    wx.navigateTo({
      url: '../add/add',
    })
  },

  // 加载地址列表数据
  onShow:function(){
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
            adressList: res.data,
            noDataShow: false,
            manageDataShow:true
          });
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].isDefault == 1) {
              defaultId = res.data[i].id;
            } else {
              choiceId = res.data[i].id;
            }
          }
        } else {
          // 无数据
          that.setData({
            noDataShow: true,
            manageDataShow: false
          });
        }
      }
    })
  },

  onChange(event) {
    var that = this;
    const { key } = event.currentTarget.dataset;
    choiceId = event.currentTarget.dataset.id;
    if (defaultId == choiceId)
      return;

    wx.request({
      url: adressDefaultUrl + "?id=" + choiceId,
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1"
      },
      method: "put",
      success: function (res) {
        if (res.data) {
          if (res.data.success) {
            defaultId = choiceId;
            Toast('设置默认收货地址成功');
            // that.onShow();
            for (var i = 0; i < that.data.adressList.length; i++) {
              if (event.currentTarget.id == i) {
                that.data.adressList[i].isDefault = 1;
              }
              else {
                that.data.adressList[i].isDefault = 0;
              }
            }
            that.setData(that.data);
          } else {
            Toast(res.data.message);
          }
        } else {
          Toast(res.data.message);
        }
      }
    })
    this.setData({ checkbox: true });
  },

  //删除收货地址  
  delAdress(event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    Dialog.confirm({
      message:"确认删除收货地址？"
    }).then(() => {
      wx.request({
        url: delAdressUrl,
        header: {
          "Authorization": "Bearer__" + wx.getStorageSync("token"),
          "Key": "Bearer__" + wx.getStorageSync("key"),
          "ClientId": "Bearer__1",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "PUT",
        data: {
          id: id
        },
        success: function (res) {
          Toast('删除收货地址成功');
          that.onShow();
          that.setData({
            show: false
          });
        }
      })
    })
  }
})