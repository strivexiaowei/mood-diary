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
    openid: '',
    easyFlag: false
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

    // wx.cloud.callFunction({
    //   name: 'orderby',
    //   data: {},
    //   success: res => {
    //     console.log(res, 'hehehehehe')
    //   }
    // })
    let _that = this;
    let openid = wx.getStorageSync('_openid');
    _that.setData({
      openid
    })
    _that.queryHomeList({});
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
    let { _id, index } = e.currentTarget.dataset;
    let _that = this;
    let _openid = _that.data.openid;
    let arrList = _that.data.homeList;
    if (_that.data.easyFlag) {
      return;
    }
    _that.setData({
      easyFlag: true
    })
    mood.where({
      _id
    }).get({
      success: res => {
        let { easyLike } = res.data[0];
        console.log(easyLike);
        let idx = easyLike.findIndex(e => {
          return e === _openid
        });
        console.log(idx);
        if (idx === -1) {
          console.log('baici')
          mood.doc(_id).update({
            data: {
              easyLike: _.push(_openid)
            },
            success: res => {
              let { updated } = res.stats;
              arrList[index].easyLike.push(_openid);
              arrList[index].isLike = 'iconzhichi';
              if (updated === 1) {
                _that.setData({
                  homeList: arrList
                })
              }
            },
            complete: res => {
              _that.setData({
                easyFlag: false
              })
            }
          })
        } else {
          easyLike.splice(idx, 1);
          mood.doc(_id).update({
            data: {
              easyLike
            },
            success: res => {
              let { updated } = res.stats;
              arrList[index].easyLike = easyLike;
              arrList[index].isLike = 'iconcanyu';
              if (updated === 1) {
                _that.setData({
                  homeList: arrList
                })
              }
            },
            complete: res => {
              _that.setData({
                easyFlag: false
              })
            }
          })
        }
      }
    })
  },
  /**
   * 查询列表
   */
  queryHomeList(obj) {
    let _that = this;
    let _openid = _that.data.openid;
    mood.where(obj).get({
      success(res) {
        console.log(res);
        let { data } = res;
       console.log(data[0].createTime.getDate);
        for(let i = 0; i< data.length;i++) {
             
          if(data[i].easyLike.indexOf(_openid) === -1) {
            data[i].isLike = 'iconcanyu';
          } else {
            data[i].isLike = 'iconzhichi';
          }
        }
        _that.setData({
          homeList: data.reverse()
        })
      }
    })
  }
})