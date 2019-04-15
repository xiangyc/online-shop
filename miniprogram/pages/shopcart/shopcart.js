var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
import Toast from '../vant/toast/toast'; 
var app = getApp();
//var balance, lastPrice;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAllSelect: false,   // 是否全选
    totalMoney: 0,  // 支付金额
    carts: [], //购物车数据 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载缓存数据
    this.cartListFunction();
  },

  // 获取购物车的缓存数据
  cartListFunction: function (data) {
    var that = this;
    // 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cart') || [];
    // 有数据的话，就遍历数据，计算总金额 和 总数量 
    // 更新数据  
    that.setData({
      carts: arr
    });
 
    // 计算支付金额
    this.count_price();
  },

  // 步进器改变时触发，保存当前步进器值
  onChangeNum(event) {
    // 数组的下标值
    var index = event.target.dataset.index;
    var that = this;
    var list = that.data.carts;
    list[index].count = event.detail;
    wx.setStorageSync('cart', that.data.carts);
    that.setData({
      carts: that.data.carts
    })
  },

  //增加操作，点击+
  onAddNum(event) {
    var that = this;
    // 计算金额方法
    that.count_price();
  },

  //减少操作，点击-
  onCurtNum(event) {
    var that = this;
    // 调用计算金额方法
    that.count_price();
  },

  // 单选、取消操作
  onChange(event) {
    var that = this;
    // 数组的下标值
    var index = event.target.dataset.index;
    var list = that.data.carts;
    var totalMoney = that.data.totalMoney; 
    list[index].isSelect = !list[index].isSelect;
    //价钱统计
    if (list[index].isSelect) {
      totalMoney = totalMoney + (list[index].salePrice * list[index].count);
    } else {
      totalMoney = totalMoney - (list[index].salePrice * list[index].count);
    }

    wx.setStorageSync('cart', that.data.carts);
    that.setData({
      carts: that.data.carts,
      totalMoney: totalMoney
    })
    // 是否全选判断方法
    that.isAllSelect(); 
  },

  // 全选、取消操作
  onChangeAll: function (event) {
    var that = this;
    //处理全选逻辑
    var list = that.data.carts;
    var totalMoney = 0; 
    if (list && list.length < 1){
      Toast('请先添加商品到购物车');
      return;
    }

    if (!that.data.isAllSelect) {
      for (var i = 0; i < list.length; i++) {
        list[i].isSelect = true;
        totalMoney = totalMoney + (list[i].salePrice * list[i].count);
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        list[i].isSelect = false;
      }
    }

    wx.setStorageSync('cart', that.data.carts);
    this.setData({
      carts: this.data.carts,
      totalMoney: totalMoney,
      isAllSelect: !this.data.isAllSelect
    })
  },

  /**
   * 计算总支付金额方法
   */
  count_price: function () {
    var that = this;
    var list = that.data.carts;
    var totalMoney = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].isSelect == true) {
        totalMoney = totalMoney + (list[i].salePrice * list[i].count);
      }
    }
    that.setData({
      totalMoney: totalMoney
    })
    // 是否全选判断方法
    that.isAllSelect(); 
  },

  // 是否全选判断方法,且更新支付总金额
  isAllSelect: function () {
    var that = this; 
    var list = that.data.carts;// 购物车数据
    var totalMoney = that.data.totalMoney;// 购物车总价值（已选）
    var allPrice = 0;// 购物车总价值（已选和未选）
    //是否全选判断
    for (var i = 0; i < list.length; i++) {
      allPrice = allPrice + (list[i].salePrice * list[i].count);
    }
    if (allPrice === totalMoney && allPrice > 0) {
      that.data.isAllSelect = true;
    } else {
      that.data.isAllSelect = false;
    }
    that.setData({
      totalMoney: totalMoney,
      isAllSelect: this.data.isAllSelect
    })
  },

  /**
   * 结算
   */
  onClickButton: function (event) {
    var selectList = new Array();//创建list集合
    var list = this.data.carts;
    for (var i = 0; i < list.length; i++) {
      if (list[i].isSelect == true) {
        selectList.push(list[i]);
      }
    }

    if (selectList && selectList.length < 1) {
      Toast('购物车无商品或者没有勾选购买的商品');
      return;
    }
    wx.navigateTo({
      url: '../shopmall/defineOrder/defineOrder?cartSource=shopCart',
    })
  },

  /* 删除购物车商品 */
  delGoods: function (event) {
    // 数组的下标值
    var index = event.target.dataset.index;
    var list = this.data.carts;
    list.splice(index, 1);
    // 更新data数据对象  
    this.setData({
      carts: this.data.carts
    })
    wx.setStorageSync('cart', this.data.carts);
    this.count_price();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 获取监听事件cartDataEvent
    var that = this;
    WxNotificationCenter.addNotification("cartDataEvent", that.cartListFunction, that);
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

  // 阻止事件冒泡
  preventEvent: function(){

  }
})