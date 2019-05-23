const app = getApp()
var util = require("../../utils/util.js")

//登陆页面
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pagetype: 0,
    testinginfo: null
  },
  onLoad: function(options) {

    var pagetype = parseInt(options.pagetype || 0);
    var testinginfo = null;
    if (!!options.testinginfo && options.testinginfo.length > 0) {
      testinginfo = JSON.parse(options.testinginfo);
    }

    this.setData({
      pagetype: pagetype,
      testinginfo: testinginfo
    })
  },
  //获取用户信息接口
  getUserInfo: function(e) {
    //console.log(e);
    if (e.detail.errMsg !== "getUserInfo:ok") {
      //取消
      this.setData({
        pagetype: 0,
      })

      util.goToPage(this.data.pagetype, this.data.testinginfo);

    } else {
      //同意
      app.globalData.userInfo = e.detail.userInfo;
      this.getWxMinProgramInfo();
    }
  },
  //获取小程序用户信息
  getWxMinProgramInfo: function(e) {
    let that = this;
    //存储用户ID信息
    let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
    if (!!wxUserIdInfo && !!wxUserIdInfo.unionid && wxUserIdInfo.unionid.length > 0) {
      console.log('本地wxUserIdInfo信息：' + JSON.stringify(wxUserIdInfo));
      this.getTestingUserInfo(wxUserIdInfo);
    } else {
      wx.request({
        url: app.config.server + '/third/getWxMinProgramInfo.html',
        method: 'get',
        data: {
          "code": app.globalData.mincode,
          'mptype': 101
        },
        success: function(res) {
          console.log('getWxMinProgramInfo:' + JSON.stringify(res));
          if (res.statusCode == 200) {
            if (res.data.code == 0) {
              let wxuseridinfo = res.data.data;
              if (!!wxuseridinfo.errcode) {
                console.log('获取用户信息失败：' + wxuseridinfo.errmsg)
              } else {
                wxuseridinfo.nickname = '';
                wxuseridinfo.sex = 0;
                wx.setStorageSync('wxUserIdInfo', wxuseridinfo);
                console.log('重新获取wxUserIdInfo信息：' + JSON.stringify(wxuseridinfo));

                that.getTestingUserInfo(wxuseridinfo);

              }
            }
          }
        }
      })
    }
  },
  //获取积分信息
  getTestingUserInfo: function(wxUserIdInfo) {
    let that = this;
    if (!!wxUserIdInfo && !!wxUserIdInfo.unionid && wxUserIdInfo.unionid.length > 0) {
      wx.request({
        url: app.config.server + '/testing/getTestingUserInfo.html',
        method: 'get',
        data: {
          "uuid": wxUserIdInfo.unionid,
        },
        success: function(res) {
          console.log('getTestingUserInfo:' + JSON.stringify(res));
          if (res.statusCode == 200) {
            if (res.data.code == 0 && !!res.data.data) {
              wxUserIdInfo.score = res.data.data.score;
              wx.setStorageSync('wxUserIdInfo', wxUserIdInfo);
              util.goToPage(that.data.pagetype, that.data.testinginfo);
            }
          }
        }
      })
    }

  }
})