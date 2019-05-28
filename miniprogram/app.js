//app.js
App({
  onShow() {
    let _that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res, 'ses')
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync("__userInfo__", res.userInfo);
              _that.globalData.userInfo = res.userInfo;
            }
          })
        } else {
          wx.redirectTo({
            url: '../login/login',
          });
        }
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // 获取用户信息
              console.log(res);
            }
          })
        }
      }
    })
    if (!this.globalData.openid) {
      console.log('hehe')
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          wx.setStorageSync('_openid', res.result.openid);
        },
        fail: err => {
        }
      })
    }
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'tes-076d73'
      })
    }
  },

  globalData() {
    userInfo: null;
  }
})
