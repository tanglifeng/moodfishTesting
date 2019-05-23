//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    loginImg: 'https://www.moodfish.cn/upload/wx/mark_02.png',
  },
  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function() {

  },
  onShow: function() {

    // let obj = setTimeout(function() {

    // }, 500)
    // console.log(obj)
    // clearTimeout(obj)

  },
  goToMiniProgram: function(e) {
    var that = this;
    wx.navigateToMiniProgram({
      appId: 'wxba76f60583b08cb3',
      path: 'pages/index/index',
      extraData: {
        regtype: 1
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log(res)
        if (res.errMsg !== "navigateToMiniProgram: ok") {
          // that.GoBack();
        }

      },
      fail(res) {
        console.log("fail");
        //that.GoBack();
      }
    })
  },
  onShareAppMessage: function() {
    let that = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    return {
      title: '测试小程序', //分享内容
      path: '/pages/index/index', //分享地址
      imageUrl: '/images/wx_login.png', //分享图片
      success: function(res) {
        if (res.errMsg == 'shareAppMessage:ok') { //判断分享是否成功
          if (res.shareTickets == undefined) { //判断分享结果是否有群信息
            //分享到好友操作...

            console.log("分享到好友操作");
            that.showTips('提示', '分享到好友操作');

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
            that.showTips('提示', '分享到群操作');

          }
        } else {
          console.log("分享失败");
          that.showTips('提示', '分享失败');
        }
      }
    }

  },
  showTips: function(title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: true, //是否显示取消按钮
      cancelText: "取消", //默认是“取消”
      cancelColor: '#000000', //取消文字的颜色
      confirmText: "前往", //默认是“确定”
      confirmColor: '#3cc51f', //确定文字的颜色
      success: function(res) {},
      fail: function(res) {
        //接口调用失败的回调函数，wx.navigateBack
      },
      complete: function(res) {
        //接口调用结束的回调函数（调用成功、失败都会执行）
      },
    })
  },
  // 返回首页
  GoBack: function(e) {
    wx.switchTab({
      url: '/pages/index/index',
      success: function(e) {
        console.log('success')
      }, //成功后的回调；  
      fail: function(e) {
        console.log(e)
      }, //失败后的回调；  
      complete: function() {

      }
    })
  },

})