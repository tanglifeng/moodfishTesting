//question.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")

Page({
  data: {
    testinginfo: null,
    questionList: [], //问题列表  
    curQuestion: null, //当前题  
    endvalue: '', //最终总分&选项
    checked: false,
    curNum: 1, // 当前题号与总题数
    opacity: 1, // 动画需要时间先不展示文本框
    addClass: '' // 动画类
  },
  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function(options) {

    var testinginfo = options.testinginfo;
    //console.log(options);
    this.setData({
      testinginfo: JSON.parse(testinginfo)
    })

    if (!!this.data.testinginfo) {
      this.getQuestionList();
    }

  },
  //测评问题列表
  getQuestionList: function(e) {
    let that = this;
    if (this.data.testinginfo.testid > 0) {
      wx.request({
        url: app.config.server + '/testing/getTestingQuestionInfo.html',
        method: 'get',
        data: {
          testid: this.data.testinginfo.testid
        },
        success: function(res) {
          if (!!res.data.data && res.data.data.length > 0) {
            that.setData({
              questionList: res.data.data,
              curQuestion: res.data.data[0],
            })
          } else {
            console.log('getTestingQuestionInfo:' + JSON.stringify(res));
          }

        }
      })
    }
  },
  /**
   * 获取下一题
   */
  getNextQuestion: function(e) {
    let that = this;
    // console.log(e);
    let question = this.data.curQuestion;
    let code = e.currentTarget.dataset.code;
    if (!!question) {
      let seloption = question.option.find(t => t.code == code);
      if (!!seloption) {
        let score = '';
        if (this.data.testinginfo.resulttype == 1) {
          //分值
          score = parseInt(seloption.score || 0) + parseInt(this.data.endvalue || 0);

        } else {
          score = seloption.score;
        }

        let nextQuestion = null;
        if (seloption.nextquestionid > 0) {
          nextQuestion = this.data.questionList.find(t => t.questionid == seloption.nextquestionid);
        }

        this.setData({
          endvalue: score,
          curQuestion: nextQuestion,
          checked: false,
          curNum: that.data.curNum += 1,
          addClass: 'fadeOutLeft',
          opacity: 0,
        });

        if (nextQuestion == null) {
          this.getTestingResult();
        } else {
          setTimeout(() => {
            this.setData({
              addClass: 'fadeInRight',
              opacity: 1
            })
          }, 100)
        }

      } else {
        //结束
        this.getTestingResult();
      }
    }
  },
  // 跳转结果
  goToResult: function(resultinfo) {
    wx.redirectTo({
      url: '../result/result?testinginfo=' + JSON.stringify(this.data.testinginfo) + '&resultInfo=' + resultinfo
    })
  },
  //测评结果
  getTestingResult: function(e) {
    let that = this;
    if (!!this.data.testinginfo && (this.data.endvalue + '').length > 0) {

      let uuid = '';
      let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
      if (!!wxUserIdInfo) {
        uuid = wxUserIdInfo.unionid;
      }
      let score = util.getUserScore();
      // console.log("上传数据,testid=" + this.data.testid + ",value=" + this.data.endvalue)
      wx.request({
        url: app.config.server + '/testing/getTestingReulst.html',
        method: 'get',
        data: {
          testid: this.data.testinginfo.testid,
          value: this.data.endvalue,
          uuid: uuid,
          score: score
        },
        success: function(res) {
          if (res.data.code == 0) {
            that.goToResult(res.data.data);
          }
          // console.log("getResultInfo:" + JSON.stringify(res.data))
        }
      })
    } else {
      console.log('计算出错')
    }

  }

})