// pages/shopmall/detail/detail.js
import Toast from '../../vant/toast/toast';
var app = getApp();
var goodsId, detailImg, detailCon, detailConDes, stockNum;
//查询产品详情
var proDetail = app.globalData.requestUri + '/shop-product/query';
var WxParse = require('../../../wxParse/wxParse.js');
var getMember = app.globalData.requestUri + '/auth/currMember';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgheights: [],
    current: 0,
    imgwidth: 750,
    show: false,
    showWin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    goodsId = options.id;
    this.proDetailFun();
    
  },
  //查询产品信息
  proDetailFun: function () {
    var that = this;
    if (goodsId == null || goodsId == undefined) {
      goodsId = '';
    }

    wx.request({
      url: proDetail + "?id=" + goodsId,
      success: function (res) {
        if (res) {
          detailCon = res.data.obj;
          detailConDes = res.data.obj.description;
          detailImg = res.data.obj.productImages;
          stockNum = res.data.obj.amount;
          that.setData({
            detailCon: detailCon,
            detailImg: detailImg,
            domain: app.globalData.domain
          });
          that.detailConDesFun();
        }
      }
    });
  },
  //富文本转化
  detailConDesFun: function () {
    var article = detailConDes;
    WxParse.wxParse('article', 'html', article, this, 5);
  },
  //图片宽高自适应
  imageLoad: function (e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights[e.target.dataset['index']] = imgheight;// 改了这里 赋值给当前 index
    this.setData({
      imgheights: imgheights,
    })
  },
  //主图滑动动作
  bindchange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  //判断是否登录
  onClickButton: function(){
    if (!wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '../../account/login/login',
      })
    } else {
      //已登录，显示弹出框
      this.setData({ 
        show: true,
        showWin: false,
        mobile: wx.getStorageSync("hideMobile")
      });
    }
  },
  //隐藏弹出框
  onClose: function () {
    this.setData({ show: false });
  },
  //购买数量变更
  onChangeNum: function (e) {
    this.setData({
      name: e.detail
    })
  },
  //确定购买数量
  numberSure: function () {
    var number = this.data.name;
    if (this.data.name == '' || this.data.name == null || this.data.name == undefined){
      number = 1;
    }
    
    if (number > stockNum) {
      Toast('购买数量超出库存');
      return;
    }
    if (number > 100) {
      Toast('每单限购100件');
    } else {
      wx.navigateTo({
        url: '../defineOrder/defineOrder?id=' + goodsId + '&numberVal=' + number
      })
    }

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
   * 客服
   */
  onClickIcon: function () {
    wx.navigateTo({
      url: '../../account/custom/custom?helpTitle=产品详情'
    })
  },

  // 打开购物数量窗口
  applyWin: function (event) {
    var goods = this.data.detailCon;
    console.log(goods);
    this.setData({
      showWin: true,
      show: false,
      goodsData: goods,
      count: 1
    })
  },
  //隐藏弹出框
  onClose: function () {
    this.setData({ showWin: false });
    this.setData({ show: false });
  },

})