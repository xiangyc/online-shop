import Toast from '../../vant/toast/toast';  
var app = getApp();  
var typeName, goodsId, imgCon, numberVal, shopOrderFee, shopOrderPremiumFee, typeId = 0, expressType, options, detailPrice, detailPriceNum = [];
var addressUrl = app.globalData.requestUri + '/delivery-addresses/find/default-address';  
var proDetail = app.globalData.requestUri + '/shop-product/query';  
var expressMoneyUrl = app.globalData.requestUri + '/sys/config';
var submitUrl = app.globalData.requestUri + '/shop/order/mall';

var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js");

Page({  
  /**  
   * 页面的初始数据  
   */  
  data: {  
    typeName: '快递',  
    adressData1: false,
    adressData2: true,
    adressData3: true,
    consignee:'',   
    hideMobile: '',   
    addressDetail: '',   
    checked: true,  
    personFlag: false,
    companyFlag:true,
    disabled: false,
    onChangeTab: "onChangeTab",
    ticketText: "暂不需要", 
    personValue:"",
    companyValue: "",
    onValue: "",
    payShow: false,
    passwordHidden: false,
    payType: '1',
    domain: app.globalData.domain,
    isSelect:true,
    selectList:[],
    noSelectList:[],
    detailCon:''
    
  },  
  /**  
   * 生命周期函数--监听页面加载  
   */  
  onLoad: function (options) {  
    options = options; 
    this.showAddress(options);
    this.checkExpressMoney(options);  
    this.setData({  
      options: options,  
      expressType: 0  
    });  
  },  
  expressType: function () {  
    //显示提金方式弹框  
    this.setData({  
      show: true  
    });  
  },  
  //隐藏提金方式弹出框  
  onClose: function () {  
    this.setData({  
      show: false  
    });  
  },  
  //选择提金方式  
  choiceType: function (e) {  
    options = this.data.options;  
    typeName = e._relatedInfo.anchorTargetText;  
    typeId = e.target.dataset.id;  
    this.setData({  
      show: false,  
      typeName: typeName  
    });  
    if (typeId == 0) {
      if (this.data.consignee){
        this.setData({
          expressType: 0,
          adressData1: true,
          adressData2: false,
          adressData3: true
        })
      } else {
        this.setData({
          expressType: 0,
          adressData1: false,
          adressData2: true,
          adressData3: true
        })
      }
        
    } else {  
      this.setData({  
        expressType: 1,
        adressData1: true,
        adressData2: true,
        adressData3: false 
      })  
    }  
    this.checkExpressMoney(options);  
  },  
  //获取默认地址  
  showAddress: function (options) {
    var that = this;
    wx.request({  
      url: addressUrl,  
      header: {  
        "Authorization": "Bearer__" + wx.getStorageSync("token"),  
        "Key": "Bearer__" + wx.getStorageSync("key"),  
        "ClientId": "Bearer__1"  
      },  
      success: function (res) {  
        if (res && res.data) {
          that.setData({
            consignee: res.data.consignee,
            hideMobile: res.data.hideMobile,
            addressDetail: res.data.addressDetail,
            adressData1: true,
            adressData2: false,
            adressData3: true
          })    
        } else {  
          that.setData({
            adressData1: false,
            adressData2: true,
            adressData3: true
          })
        }  
      }  
    });  
  },  
  //选择收货地址  
  choiceAdress: function (e) {  
    wx.navigateTo({  
      url: '../../account/deliveryAddress/selectAddress/selectAddress', 
    })  
  },
  getProDetailFun: function(options){
    if (options.cartSource && options.cartSource == 'shopCart') {
      this.proDetailStorageFun(options);
    } else {
      this.proDetailFun(options);
    }
  },
  //获取产品缓存信息
  proDetailStorageFun: function(options){
    var that = this;
    var list = wx.getStorageSync('cart') || [];
    var selectList = that.data.selectList;
    var noSelectList = that.data.noSelectList;
    detailPrice = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].isSelect == true){
        selectList.push(list[i]);

      }else {
        noSelectList.push(list[i]);
      }
    }
    for (var i = 0; i < selectList.length;i++){
      numberVal = selectList[i].count;
      detailPrice = detailPrice + selectList[i].salePrice * numberVal;
    }

    that.setData({
      noSelectList: noSelectList,
      detailCon: selectList,
      detailPrice: detailPrice
    });
    that.loadPrice();  
  },
  //查询产品信息  
  proDetailFun: function (options) {  
    var that = this;
    var detailCon = that.data.detailCon || []; 
    numberVal = options.numberVal;  
    goodsId = options.id;  
    if (goodsId == null || goodsId == undefined) {  
      goodsId = '1';  
    }  
    if (numberVal == null || numberVal == undefined) {  
      numberVal = '1';  
    }  
    wx.request({  
      url: proDetail + "?id=" + goodsId,  
      success: function (res) {  
        if (res) {        
          
          res.data.obj.isSelect = true;
          res.data.obj.count = numberVal;
          res.data.obj.imgurl = '/' + res.data.obj.productImages[0].path + '/' + res.data.obj.productImages[0].fileName; 
          detailCon.push(res.data.obj); 
          detailPrice = detailCon[0].salePrice * numberVal;
          that.setData({
            detailCon: detailCon,  
            detailPrice: detailPrice
          });  
          that.loadPrice();  
        }  
      }  
    });  
  },  
  /**  
 * 查询运费  
 */  
  checkExpressMoney: function (options) {  
    expressType = this.data.expressType;  
    var that = this;  
    wx.request({  
      url: expressMoneyUrl,  
      success: function (res) {  
        if (res) {  
          shopOrderFee = res.data.shop_order_fee;  
          shopOrderPremiumFee = res.data.shop_order_premium_fee;  
          if (shopOrderFee) {  
            shopOrderFee = shopOrderFee;  
          } else {  
            shopOrderFee = 0.00;  
          }  
          if (shopOrderPremiumFee) {  
            shopOrderPremiumFee = shopOrderPremiumFee;  
          } else {  
            shopOrderPremiumFee = 0.00;  
          }  
          if (expressType == 1) {  
            shopOrderFee = 0.00;  
            shopOrderPremiumFee = 0.00;  
          }  
          if (shopOrderFee == '0.00') {  
            that.setData({  
              freightMoney: '包运费'  
            });  
          } else {  
            that.setData({  
              freightMoney: '￥' + shopOrderFee  
            });  
          }  
          if (shopOrderPremiumFee == '0.00') {  
            that.setData({  
              premiumMoney: '包保价费'  
            });  
          } else {  
            that.setData({  
              premiumMoney: '￥' + shopOrderPremiumFee  
            });  
          }  
          that.getProDetailFun(options);  
        }  
      }  
    });  
  },  
  /**  
   * 价格合计  
   */  
  loadPrice: function () {  
    var lastPrice = (parseFloat(detailPrice) + parseFloat(shopOrderFee) + parseFloat(shopOrderPremiumFee)) * 100;  
    this.setData({  
      lastPrice: lastPrice  
    });  
  },  
  /**
   * 提交列表订单 
   */
  confirmOrderBefore: function(){
    var list = this.data.selectList || [];
    
    if (this.data.options.cartSource == 'shopCart') {

      for (var i = 0; i < list.length; i++) {
        goodsId = list[i].id;
        numberVal = list[i].count;
        this.confirmOrder();
        this.setData({
          isEnd: i
        });  
      }
    } else {

      goodsId = goodsId;
      numberVal = numberVal;
      this.confirmOrder();
      
    }
  },
  /**  
   * 提交订单  
   */  
  confirmOrder: function () {
    var that = this;
    expressType = that.data.expressType; 
    var consignee = that.data.consignee;
    if (expressType == 0) {  
      if (!consignee){
        Toast('请选择收货地址');
        return;  
      }
    }
    var params = {};


    if (expressType == 0) {
      params = {
        productId: goodsId,
        amount: numberVal,
        expressType: expressType,
        addressId: 71,
        source: 1,
        invoiceType: 1,
        invoiceTitle: '财易通个人'
      };
    } else {
      params = {
        productId: goodsId,
        amount: numberVal,
        expressType: expressType,
        addressId: 71,
        source: 1,
        invoiceType: 1,
        invoiceTitle: '财易通公司',
        taxNo: that.data.onValue
      };
    }

    wx.request({
      url: submitUrl,
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: params,
      success: function (res) {
        if (res && res.data.success) {
          Toast('成功提交订单');
          var orderId = res.data.obj;
        if (that.data.options.cartSource == 'shopCart') {
          if (that.data.isEnd == that.data.selectList.length - 1) {
              wx.navigateTo({
                url: '../../account/order/order',
              });

              wx.setStorageSync('cart', that.data.noSelectList);
              
            }
          } else {
            wx.navigateTo({
              url: '../../account/orderDetail/orderDetail?orderId=' + orderId,
            })
          }

          // 发送监听事件cartDataEvent
          WxNotificationCenter.postNotificationName("cartDataEvent");

        }
      }
    }) 
  },
  showInvoice:function () {
    this.setData({
      isShow:true
    })
  },
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
    if (detail){
      this.setData({
        disabled: false,
        onChangeTab: "onChangeTab"
        });
    } else {
      this.setData({
        disabled: true,
        onChangeTab: "",
        personValue: "",
        companyValue: "",
        onValue: ""
        });
    }
  },
  onCloseInvoice: function () {
    this.setData({
      isShow: false
    })
  },

  onChangePerson({ detail }) {
    this.setData({ personValue: detail });
  },

  onChangeCompany({ detail }) {
    this.setData({ companyValue: detail });
  },

  onChangeNo({ detail }) {
    this.setData({ onValue: detail });
  },

  onChangeTab: function(event) {
    var type = event.currentTarget.dataset.type;
    if (type == 1){
      this.setData({
        personFlag: false,
        companyFlag: true
      })
    } else {
      this.setData({
        personFlag: true,
        companyFlag: false
      })
    }
  },

  confimInfo: function (event){
    var that = this;
    // 开具发票
    if (that.data.checked){
      if (that.data.personFlag) {
        if (that.data.companyValue && that.data.onValue) {
          that.setData({
            ticketText: "公司"
          })
          that.onCloseInvoice();
        } else {
          Toast('请填写完整的单位名称和纳税人识别号');
          return;
        }
        
      } else {

        if (that.data.personValue) {
          that.setData({
            ticketText: "个人"
          })
          that.onCloseInvoice();
        } else {
          Toast('请填写个人名称');
          return;
        }
      }

    } else {
      that.setData({
        ticketText: "暂不需要" 
      })
    }
  },

  closePay: function (event) {
    this.setData({
      payShow: false,
      passwordShow: true
    })
  }
  
})
