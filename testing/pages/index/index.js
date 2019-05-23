//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")
Page({
  data: {
    // 轮播图属性
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    // 测评首页数据
    testingInfo: {
      testingList: [], // 轮播图
      recommendList: [] // 测评列表
    },
  },
  // 事件处理函数
  bindViewTap: function() {

  },
  onLoad: function() {
    this.getTestingList();
  },

  // 测评首页数据
  getTestingList: function(e) {
    let that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.config.server + '/testing/getTestingList.html',
      method: 'get',
      data: {},
      success: function(res) {
        that.setData({
          testingInfo: res.data
        })
        wx.hideNavigationBarLoading();
        //console.log(that.data.testingInfo);
      },
      fail: function(e) {
        console.log(e);
        util.showTips('连接失败', '通讯失败，请稍后再试...', false)
      }
    })
  },
  // 跳转测评
  goToInfo: function(e) {
    //console.log(e);
    if (!!e.currentTarget.dataset.testinginfo) {
      //跳转测评
      wx.navigateTo({
        url: '../info/info?testinginfo=' + JSON.stringify(e.currentTarget.dataset.testinginfo),
        success: function() {}, //成功后的回调；  
        fail: function() {}, //失败后的回调；  
        complete: function() {}
      })
    }

  },
  onShareAppMessage: function() {

    util.addUserScore(10);
    // util.shareShowTips('分享成功');

    wx.showShareMenu({
      withShareTicket: true
    })
    return {
      title: 'AI心理鱼测评', //分享内容
      path: '/pages/index/index', //分享地址
      imageUrl: '', //分享图片
      success: function(res) {
        if (res.errMsg == 'shareAppMessage:ok') { //判断分享是否成功
          if (res.shareTickets == undefined) { //判断分享结果是否有群信息
            //分享到好友操作...
            console.log("分享到好友操作");

          } else {
            //分享到群操作...
            var shareTicket = res.shareTickets[0];

            wx.getShareInfo({
              shareTicket: shareTicket,
              success: function(e) {
                //当前群相关信息
                var encryptedData = e.encryptedData;
                var iv = e.iv;
              }
            })

            console.log("分享到群操作");

          }
        } else {
          console.log("分享失败");
        }
      },
      fail: function(res) {
        console.log("转发失败", res);
      },
      complete: function(res) {

      }

    }
  }
})