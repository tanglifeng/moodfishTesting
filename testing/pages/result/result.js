//result.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")

Page({
  data: {
    testinginfo: null, //测评主体信息
    resultInfo: [], //测评结果信息
    shareimg: '../../images/lock.png', //锁图片
    title: '', // 标题
    isShare: true, //是否显示分享
    pagetype: 0, //页面类型
    commendList: [] //用户推荐测评
  },

  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function(options) {
    var resultInfo = options.resultInfo.split('||');
    var pagetype = parseInt(options.pagetype || 0);
    var testinginfo = null;
    if (!!options.testinginfo && options.testinginfo.length > 0) {
      testinginfo = JSON.parse(options.testinginfo);
    }

    let title = '微信分享给好友后可查看测试结果';
    var isShare = true;
    if (!!options.isShare) {
      isShare = !!parseInt(options.isShare);
      if (!isShare) {
        title = '测试结果:';
      }
    }

    this.setData({
      testinginfo: testinginfo,
      resultInfo: resultInfo,
      isShare: isShare,
      title: title,
      pagetype: pagetype
    })

    // console.log('setData,testid:' + this.data.testid);
  },
  //用户推荐测评
  getRecommendList: function() {
    let that = this;
    let uuid = '';
    let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
    if (!!wxUserIdInfo) {
      uuid = wxUserIdInfo.unionid;
    }

    if (!!uuid && uuid.length > 0) {
      wx.request({
        url: app.config.server + '/testing/getUserRecommendList.html',
        method: 'get',
        data: {
          uuid: uuid,
        },
        success: function(res) {
          if (res.data.code == 0 && !!res.data.data) {
            that.setData({
              commendList: res.data.data
            })

          }

        }
      })
    }

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
  // 分享测试
  shareState: function(e) {
    let that = this;
    setTimeout(function() {
      that.setData({
        isShare: false,
        title: '测试结果:'
      });

      // wx.showToast({
      //   title: '分享成功',
      //   icon: 'none',
      //   duration: 2000
      // })

    }, 3000)


  },
  // 返回首页
  goBack: function(e) {
    util.goToPage(this.data.pagetype, this.data.testinginfo);
  },
  //分享
  onShareAppMessage: function(mes) {
    //console.log('onShareAppMessage:' + JSON.stringify(mes));
    if (!!this.data.testinginfo) {
      this.shareState();
      util.addUserScore(10);
      this.getRecommendList(); //推荐测评

      wx.showShareMenu({
        withShareTicket: true
      })
      return {
        title: this.data.testinginfo.title, //分享内容
        path: '/pages/info/info?testinginfo=' + JSON.stringify(this.data.testinginfo), //分享地址
        imageUrl: this.data.testinginfo.imgurl, //分享图片
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


  }
})