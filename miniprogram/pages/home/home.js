// pages/home/home.js
const db = wx.cloud.database();
const mood = db.collection('mood');
const _ = db.command
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
    ],
    homeList: [],
    openid: ''
  },
  dayClick: function (event) {
    let clickDay = event.detail.day;
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    this.setData({
      [changeDay]: clickDay,
      [changeBg]: "#84e7d0"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

    wx.cloud.callFunction({
      name: 'orderby',
      data: {},
      success: res => {
        console.log(res, 'hehehehehe')
      }
    })
    let _that = this;
    _that.setData({
      openid: app.globalData.openid
    })
    mood.where({}).get({
      success(res) {
        console.log(res);
        let { data } = res;
        _that.setData({
          homeList: data.reverse()
        })
      }
    })
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
  addMoodSelf() {
    wx.navigateTo({
      url: '../send/send-mood',
    })
  },
  /**
   * 图片放大功能
   */
  previewImage(e) {
    console.log(e);
    let urlList = e.currentTarget.dataset.itemlist;
    let index = e.currentTarget.dataset.index;
    let arr = [];
    for (let i = 0; i < urlList.length; i++) {
      arr.push(urlList[i].imgUrl);
    }
    console.log(arr)
    wx.previewImage({
      current: arr[index],
      urls: arr
    })
  },
  /**
   * 滚动到底部
   */
  scrollBottom() {
    console.log('hehe')
  },
  easyLike(e) {
    let { _id, _openid } = e.currentTarget.dataset;
    mood.where({
      _id
    }).get({
      success: res => {
        let { easyLike } = res.data[0];
        let idx = easyLike.findIndex(e => e === _openid);
        if (idx === -1) {
          mood.doc(_id).update({
            data: {
              easyLike: _.push(_openid)
            },
            success: res => {
              console.log(res);
            }
          })
        } else {
          mood.doc(_id).update({
            data: {
              easyLike: easyLike.splice(idx, 1)
            },
            success: res => {
              console.log(res);
            }
          })
        }
      }
    })
  }
})