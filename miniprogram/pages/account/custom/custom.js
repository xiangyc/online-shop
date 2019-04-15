// pages/account/custom/custom.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var url = util.getCustomUrl(options.helpTitle);  
    this.setData({
      url: url
    })

  }
  
})