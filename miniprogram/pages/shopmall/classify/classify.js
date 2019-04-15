var app = getApp();
var classifyId = 1;
var goodsId;

//一级分类url
var classifyUrl = app.globalData.requestUri + "/shop-product/category/top";
//二级分类url
var classifySecondUrl = app.globalData.requestUri + "/shop-product/category/child";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    scrollTop: 0,  //用作跳转后右侧视图回到顶部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: classifyUrl,
      success: function (res) {
        if (res){
          classifyId = res.data[0].id;
          that.setData({
            classifyList: res.data
          });

          // 查询二级分类列表
          that.querySecondClassifyList(classifyId);
        }
      }
    })
  },

  // 查询二级分类列表
  querySecondClassifyList: function (classifyId) {
    var that = this;
    wx.request({
      url: classifySecondUrl + "?id=" + classifyId,
      success: function (res) {
        if(res){
          that.setData({
            classifySecondList: res.data,
            domain: app.globalData.domain,
            scrollTop: 0
          })
        }
        
      }
    })
  },

  //切换一级分类
  onChange(event) {
    var that = this;
    classifyId = event.currentTarget.dataset.id;
    that.querySecondClassifyList(classifyId);
  },


  //查询商品列表
  ToGoodsList(event) {
    goodsId = event.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../shopList/shopList?id=' + goodsId
    })

  },

  openSearchWin: function (event) {
    wx.navigateTo({
      url: '../search/search'
    })
  }

})