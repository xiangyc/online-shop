var app = getApp();
var addAdressUrl = app.globalData.requestUri + '/delivery-addresses/add';
import Toast from '../../../vant/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    areaList: {},
    loading: true,
    consignee: '',
    consigneeMobile: '',
    addressDetail: '',
    area:'请选择',
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   * 加载地区数据
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://cashier.youzan.com/wsctrade/uic/address/getAllRegion.json',
      success: response => {
        this.setData({
          loading: false,
          areaList: response.data.data
        });
      }
    });
  },

  // 打开所在地区选择
  openArea: function (event) {
    this.setData({
      show: true
    })
  },

  // 姓名
  consigneeChange(event) {
    this.setData({
      consignee: event.detail
    });
  },

  // 手机号
  mobileChange(event) {
    this.setData({
      consigneeMobile: event.detail
    });
  },

  // 详情地址
  addressChange(event) {
    this.setData({
      addressDetail: event.detail
    });
  },

  // 是否设置默认地址
  defaultChange(event) {
    this.setData({ checked: event.detail });
  },

  // 保存新增收货信息
  submitAdress: function (event) {
    var isDefault = this.data.checked?1:0;
    var consignee = this.data.consignee;
    var consigneeMobile = this.data.consigneeMobile;
    var addressDetail = this.data.addressDetail;
    var area = this.data.area;

    if (!consignee){
      Toast('姓名不能为空');
      return;
    }
    if (!consigneeMobile) {
      Toast('手机号不能为空');
      return;
    }
    if (area == "请选择") {
      Toast('请选择所在地区');
      return;
    }
    if (!addressDetail) {
      Toast('详情地址不能为空');
      return;
    }

    wx.request({
      url: addAdressUrl,
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        consignee: consignee,
        consigneeMobile: consigneeMobile,
        addressDetail: area + addressDetail,
        isDefault: isDefault,
        region:77
      },
      success: function (res) {
        if (res && res.data.success){
          Toast.success('收货地址添加成功');
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      }
    })
  },

  // 地区控件确认选择
  onConfirm(event) {
    var areaValues = event.detail.values;
    var areaStr = '';
    for (var i = 0; i < areaValues.length; i++) {
      areaStr = areaStr + areaValues[i].name;
    }

    this.setData({
      show: false,
      area: areaStr
    })

  },

  onClose: function(){
    this.setData({
      show: false
    })
  },
  onCancel: function(){

    this.setData({
      show: false
    })
  }

})