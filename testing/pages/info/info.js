//info.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")

Page({
  data: {
    testinginfo: null, //测评对象   
    disabled: false,
    plain: false,
    loading: false,
    infoDesc: [] // 介绍文本分段
  },

  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function(options) {
    //console.log(options);
    if (!!options.testinginfo && options.testinginfo.length > 0) {
      this.setData({
        testinginfo: JSON.parse(options.testinginfo),
        infoDesc: JSON.parse(options.testinginfo).desc.split('||')
      })
    }
    // console.log('setData,testinginfo:' + JSON.stringify(this.data.testingisnfo));
  },
  goToQuestion: function(e) {
    //跳转测评
    let that = this;
    if (this.data.testinginfo) {

      let flag = util.checkTestingUser();
      if (app.globalData.userInfo == null || !flag) {
        wx.redirectTo({
          url: '/pages/login/index?pagetype=2&testinginfo=' + JSON.stringify(this.data.testinginfo)
        })
      } else {

        //积分判断
        let score = 0;
        let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
        if (!!wxUserIdInfo) {
          score = wxUserIdInfo.score
        }

        if (score >= this.data.testinginfo.score) {

          wx.redirectTo({
            url: '../question/question?testinginfo=' + JSON.stringify(this.data.testinginfo),
            success: function(res) {
              util.reduceUserScore(that.data.testinginfo.score);
            }
          })
        } else {
          //弹出提示框
          util.showTips('温馨提醒', '本题需要' + this.data.testinginfo.score + '个积分,通过分享可获得积分哦!', false);
        }
      }

    }

  },
  onShareAppMessage: function() {
    if (!!this.data.testinginfo) {
      util.addUserScore(10);
     // util.shareShowTips('分享成功');

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
        }
      }
    }
  }
})