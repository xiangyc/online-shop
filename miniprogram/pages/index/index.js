var app = getApp();
import Toast from '../vant/toast/toast'; 
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");

Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    bannerArray: [],
    productArray: [],
    imageWidth: wx.getSystemInfoSync().windowWidth,
    domain: app.globalData.domain,
    isRepeat: false,// 是否重复标识
    count: 1, // 初始数量
    isSelect: true, // 初始选中状态
    show: false
  },
  loadBanners: function (e) {
    var _this = this;
    wx.request({
      url: app.globalData.requestUri + '/banners?start=0&maxResults=6&bannerType=1',
      success: function (res) {
        if (res.data.items && res.data.items.length > 0) {
          _this.setData({
            bannerArray: res.data.items
          })
        }
      }
    })
  },
  loadProduct: function (e) {
    var _this = this;
    wx.request({
      url: app.globalData.requestUri + '/shop-product/recommend',
      success: function (res) {
        if (res.data && res.data.length > 0) {
          _this.setData({
            productArray: res.data
          })
        }

        if (e === 1) {
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        }
      }
    })
  },
  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    this.loadBanners(0)
    this.loadProduct(0)
  },

  /** 
   * 页面相关事件处理函数--监听用户下拉动作 
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.loadBanners(1)
    this.loadProduct(1)
  },

  /**
   * 商品详情
   */
  goGoodsDetail: function (event) {
    var goodsDetailId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../shopmall/detail/detail?id=' + goodsDetailId
    })
  },

  openSearchWin: function (event) {
    wx.navigateTo({
      url: '../shopmall/search/search'
    })
  },

  // 打开购物数量窗口
  applyWin: function (event) {
    var index = event.target.dataset.index;
    var goods = this.data.productArray[index];
    console.log(goods);
    this.setData({
      show: true,
      goodsData: goods,
      index: index,
      count:1
    })
  },

  //隐藏弹出框
  onClose: function () {
    this.setData({ show: false });
  },

  // 步进器改变时触发，保存当前步进器值
  onChangeNum(event) {
    var that = this;
    // 数组的下标值
    that.setData({
      count: event.detail
    })
  },

  // 添加到购物车，存入缓存数据
  numberSure: function (event) {

    // 数组的下标值
    var index = event.target.dataset.index;
    console.log(index);
    // 选中的需要加入购物车的商品
    var goods = this.data.productArray[index];
    goods.count = this.data.count;// 初始购买数量
    goods.isSelect = this.data.isSelect;// 初始选中状态
    var isRepeat = this.data.isRepeat;// 是否重复标识

    // 获取购物车的缓存数组（没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cart') || [];
    if (arr.length > 0) {
      // 遍历购物车数组  
      for (var j in arr) {
        // 判断购物车内的item的id，和事件传递过来的id，是否相等  
        if (arr[j].id == goods.id) {
          // 相等的话，给count+1（即再次添加入购物车，数量+1）  
          arr[j].count = arr[j].count + goods.count;
          // 最后，把购物车数据，存放入缓存（此处不用再给购物车数组push元素进去，因为这个是购物车有的，             直接更新当前数组即可）  
          isRepeat = true; // 是否重复标识
        }
      }
      arr.push(goods);
      // 有重复移除最后一条数据
      if (isRepeat) {
        arr.pop();
      }
    } else {
      arr.push(goods);
    }
    // 最后，把购物车数据，存放入缓存  
    try {
      wx.setStorageSync('cart', arr)
    } catch (e) {
    }
    this.onClose();
    // 发送监听事件cartDataEvent
    WxNotificationCenter.postNotificationName("cartDataEvent");
  }
})