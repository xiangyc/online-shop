import Toast from '../../vant/toast/toast';

var app = getApp();
var goodsId, goodsDetailId,key;
var isSearch = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    perCount: 10,   //每页条数
    currentPage: 0,  //当前页
    start:0, // 开始记录
    maxResults:10,// 结束记录
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    goodsId = options.id;
    key = options.key;
    var that = this;
    if (key) {
      this.setData({
        value: key
      });
    }
    //调用加载数据的方法
    that.loadRooms();
  },

  loadRooms: function (res) {
    var that = this;

    //获取分页信息
    var start = that.data.start;
    var maxResults = that.data.maxResults;
    var perCount = that.data.perCount;
    var currentPage = that.data.currentPage;
    var key = that.data.value;

    if (goodsId == null || goodsId == undefined) {
      goodsId = '';
    }

    //发送请求
    wx.request({
      url: app.globalData.requestUri + "/shop-product/list",
      header: {
        "Authorization": "Bearer__" + wx.getStorageSync("token"),
        "Key": "Bearer__" + wx.getStorageSync("key"),
        "ClientId": "Bearer__1"
      },
      method: "GET",
      data: {
        start: start,
        maxResults: maxResults,
        category: goodsId,
        key:key,
        memberId:'0f6a6226f58b78e97db2442e71f5c313'
      },
      success: function (res) {
        if (res) {
          //返回成功
          var goodsList = that.data.goodsList;
          var reqRooms = res.data;

          //如果返回数据为空，则提示
          if (reqRooms.recordCount <= 0){
            Toast('暂无更多数据...');
            return;
          } else {
            if (currentPage > (reqRooms.recordCount / perCount)) {
              Toast('暂无更多数据...');
              return;
            } else {
              var result = goodsList.concat(reqRooms.items);
              console.log(isSearch);
              if (isSearch){
                result = reqRooms.items;
              }

              that.setData({
                goodsList: result,
                domain: app.globalData.domain
              });

              isSearch = false;
            }
          }

        } else {

          //如果数据加载失败，则提示
          Toast.fail('加载数据失败');

          //分页失败，分页数据回退
          if (start > 1) {
            that.setData({
              start: --start
            });
          }
        }

      }
    })

    

  },

  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    var that = this;
    //下拉刷新，将pageNumber和pageSize分别设置成1和5，并初始化数据，让数据重新通过loadRoom()获取
    that.setData({
      start: 0,
      maxResults: 10,
      currentPage:0,
      goodsList: []
    })
    that.loadRooms();
    wx.stopPullDownRefresh();
    wx.showToast({
      icon: 'loading',
      title: '下拉加载完成',
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //上拉分页,将页码加1，然后调用分页函数
    var that = this;
    var start = that.data.start;
    var maxResults = that.data.maxResults;
    var perCount = that.data.perCount;
    var currentPage = that.data.currentPage;
    that.setData({
      start: start + perCount,
      maxResults: maxResults + perCount,
      currentPage: ++currentPage

    });

    setTimeout(function () {
      Toast('加载中...');
      that.loadRooms();
    }, 1000)
  },


  /**
   * 商品详情
   */
  ToGoodsDetail: function (event) {
    goodsDetailId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + goodsDetailId
    })
  },

  onChange(event) {
    this.setData({
      value: event.detail
    });
  },

  onSearch: function (event) {
    if(this.data.value){
      isSearch = true;
      this.setData({
        start: 0,
        maxResults: 10,
        currentPage: 0,
        goodsList: []
      })
      this.loadRooms();
    } else{
      Toast('搜索内容不能为空');
      return;
    }
    
  }
})