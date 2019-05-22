// pages/send/send-mood.js
const db = wx.cloud.database();
const mood = db.collection('mood');
const QQMapWX = require('../../libs/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandImgList: [],
    saySome: '',
    fileList: [],
    latitude: '',
    longitude: '',
    address: '',
    userInfo: '',
    sendFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserLocation();
    let userInfo = wx.getStorageSync('__userInfo__');
    this.setData({
      userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 上传图片至云管理
   */
  doUpload() {
    let _that = this;
    let fileList = [];
    wx.chooseImage({
      count: 6,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        const arrFile = res.tempFilePaths
        arrFile.forEach((e, i) => {
          const cloudPath = e.replace('wxfile://', '');
          wx.cloud.uploadFile({
            cloudPath,
            filePath: e,
            success: res => {
              let { statusCode, fileID } = res;
              if (statusCode === 200) {
                wx.cloud.callFunction({
                  name: 'getvideo',
                  // 传给云函数的参数
                  data: {
                    fileID
                  },
                  success(res) {
                    let { requestID, result } = res;
                    fileList.push({
                      requestID, imgUrl: result[0].tempFileURL
                    });
                    _that.setData({
                      brandImgList: fileList
                    })
                  },
                  fail: console.error
                })
              }
            },
            fail: res => {
              console.log(res);
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        });
        console.log(fileList);

      },
      fail: e => {
        console.error(e)
      }
    });
  },

  /**
   * 填写表单获取input事件
   */
  sendMsg(e) {
    let msg = e.detail.value;
    this.setData({
      saySome: msg
    });
  },
  /**
   * 发表按钮发送信息到数据库
   */
  sendMood() {
    let _that = this;
    if(_that.data.sendFlag) {
      return;
    }
    _that.setData({
      sendFlag: true
    })
    mood.add({
      data: {
        touristsNickname: _that.data.userInfo.nickName,
        touristsName: "无",
        touristsHead: _that.data.userInfo.avatarUrl,
        location: _that.data.address,
        brandImgList: _that.data.brandImgList,
        saySome: _that.data.saySome,
        createTime: (new Date()).getTime(), //添加该字段
        easyLike: []
      },
      success(res) {
        wx.switchTab({
          url: '../home/home',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      },
      fail: console.error,
      complete: res => {
       _that.setData({
         sendFlag: false
       })
      }
    })
  },
  getUserLocation() {
    let _that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
        let { latitude, longitude } = res;
        _that.setData({
          latitude,
          longitude
        })
        qqmapsdk = new QQMapWX({
          key: 'JGUBZ-J6GRI-IOGGK-5ORHN-XK7KE-ISBPK'// 这个KEY的获取方式在上面链接 腾讯位置服务的开发文档中有详细的申请密钥步骤
        });
        qqmapsdk.reverseGeocoder({//地址解析
          location: {
            latitude: _that.data.latitude,
            longitude: _that.data.longitude
          },
          success: function (res) {
            let { address } = res.result;
            _that.setData({
              address
            })
          },
          fail: function (res) {
            console.log(res, 'jssjsj');
          },
          complete: function (res) {
            console.log(res, 'haha');
          }
        });
      }
    })
  }
})