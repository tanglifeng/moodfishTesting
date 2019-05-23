//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null,
    score: 0, //拥有积分
    testingLogList: [], //测评日志列表  
    imgUrl: '../../images/record.png' // 无测评图片
  },
  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function() {
    if (app.globalData.userInfo == null) {
      wx.redirectTo({
        url: '/pages/login/index?pagetype=1'
      })
    }
    //console.log(app.globalData.userInfo);

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log("==onReady==");
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    if (this.data.userInfo == null) {
      if (app.globalData.userInfo != null) {
        this.setData({
          userInfo: app.globalData.userInfo
        })
      } else {
        wx.redirectTo({
          url: '/pages/login/index?pagetype=1'
        })
      }

    }
    let score = 0;
    let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
    if (!!wxUserIdInfo) {
      score = wxUserIdInfo.score
    }
    this.setData({
      userInfo: app.globalData.userInfo,
      score: score
    })

    this.getTestingLog();
    console.log("==onShow==");

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("==onHide==");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("==onUnload==");
  },
  getUserInfo: function(e) {
    let that = this;
    if (!!app.globalData.userInfo) {
      let uuid = '';
      let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
      if (!!wxUserIdInfo) {
        uuid = wxUserIdInfo.unionid;
      }

      wx.request({
        url: app.config.server + '/testing/getTestingUserInfo.html',
        method: 'get',
        data: {
          uuid: uuid,

        },
        success: function(res) {

          if (res.data.code == 0) {

            that.setData({
              score: res.data.data.score,
            });
          }
          //console.log("getTestingUserInfo:" + JSON.stringify(res.data))
        }
      })
    }

  },
  getTestingLog: function(e) {
    let that = this;
    if (!!app.globalData.userInfo) {
      let uuid = '';
      let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
      if (!!wxUserIdInfo) {
        uuid = wxUserIdInfo.unionid;
      }

      wx.request({
        url: app.config.server + '/testing/getTestingLog.html',
        method: 'get',
        data: {
          uuid: uuid,
        },
        success: function(res) {

          if (res.data.code == 0 && res.data.data.length > 0) {

            that.setData({
              testingLogList: res.data.data
            });
          }
          //console.log(res.data);       

        }
      })
    }
  },
  // 跳转测评
  goToInfo: function(e) {
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
  // 跳转结果
  goToResult: function(e) {
    let resultinfo = '';
    let id = e.currentTarget.dataset.id;
    let testinginfo = e.currentTarget.dataset.testinginfo;
    if (!!testinginfo) {

      let uuid = '';
      let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
      if (!!wxUserIdInfo) {
        uuid = wxUserIdInfo.unionid;
      }

      wx.request({
        url: app.config.server + '/testing/getResultInfo.html',
        method: 'get',
        data: {
          testid: testinginfo.testid,
          id: id,
          uuid: uuid,

        },
        success: function(res) {
          if (res.data.code == 0) {

            wx.navigateTo({
              url: '../result/result?testinginfo=' + JSON.stringify(e.currentTarget.dataset.testinginfo) + '&resultInfo=' + res.data.data + '&isShare=' + 0 + '&pagetype=1'
            })

          }
          // console.log("getResultInfo:" + JSON.stringify(res.data))
        }
      })
    }


  },
})