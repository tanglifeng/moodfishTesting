const app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//提示框
var showTips = function(title, content, showCancel) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: showCancel, //是否显示取消按钮
    cancelText: "取消", //默认是“取消”
    cancelColor: '#000000', //取消文字的颜色
    confirmText: "确定", //默认是“确定”
    confirmColor: '#3cc51f', //确定文字的颜色
    success: function(res) {

    },
    fail: function(res) {
      //接口调用失败的回调函数，wx.navigateBack
    },
    complete: function(res) {
      //接口调用结束的回调函数（调用成功、失败都会执行）
    },
  })
}
//分享提示
var shareShowTips = function(title) {
  setTimeout(function() {
    wx.showToast({
      title: '分享成功',
      icon: 'none',
      duration: 2000
    })

  }, 3000)
}

var getUserScore = function() {
  let score = 0;
  let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
  if (!!wxUserIdInfo && !!wxUserIdInfo.score) {
    score = wxUserIdInfo.score;
  }

  return score;
}

var addUserScore = function(num) {
  let score = 0;
  let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
  if (!!wxUserIdInfo) {
    if (!!wxUserIdInfo.score) {
      score = wxUserIdInfo.score + num;
    } else {
      score = num;
    }

    console.log("当前积分:" + parseInt(wxUserIdInfo.score || 0) + ',本次获得积分:' + num + ',总积分:' + score);
    wxUserIdInfo.score = score;
    wx.setStorageSync('wxUserIdInfo', wxUserIdInfo);
  }

  return score;
}

var reduceUserScore = function(num) {
  let score = 0;
  let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
  if (!!wxUserIdInfo && !!wxUserIdInfo.score) {
    if (wxUserIdInfo.score < num) {
      return wxUserIdInfo.score;
    } else {
      score = wxUserIdInfo.score - num;
    }

    console.log("当前积分:" + wxUserIdInfo.score + ',本次减少积分:' + num + ',剩余积分:' + score);
    wxUserIdInfo.score = score;
    wx.setStorageSync('wxUserIdInfo', wxUserIdInfo);
  }

  return score;
}

var checkTestingUser = function() {
  let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
  if (!!wxUserIdInfo && !!wxUserIdInfo.unionid) {
    if (!!app.globalData.userInfo) {
      return true;
    }

  }
  return false;
}

//页面跳回
var goToPage = function(pagetype, testinginfo) {
  switch (pagetype) {
    case 0:
      //主页
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
      break;
    case 1:
      //个人信息
      wx.switchTab({
        url: '/pages/mine/index',
        success: function(e) {
          console.log('success')
        }, //成功后的回调；  
        fail: function(e) {
          console.log(e)
        }, //失败后的回调；  
        complete: function() {

        }
      })
      break;
    case 2:
      //测评信息
      wx.navigateTo({
        url: '/pages/info/info?testinginfo=' + JSON.stringify(testinginfo),
        success: function(e) {
          console.log('success')
        }, //成功后的回调；  
        fail: function(e) {
          console.log(e)
        }, //失败后的回调；  
        complete: function() {

        }
      })
      break;

  }
}
module.exports = {
  formatTime: formatTime,
  showTips: showTips,
  getUserScore: getUserScore,
  addUserScore: addUserScore,
  reduceUserScore: reduceUserScore,
  checkTestingUser: checkTestingUser,
  goToPage: goToPage,
  shareShowTips: shareShowTips
}