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
    dayStyle: [{
      month: 'current',
      day: new Date().getDate(),
      color: 'white',
      background: '#AAD4F5'
    },
    {
      month: 'current',
      day: new Date().getDate(),
      color: 'white',
      background: '#AAD4F5'
    }
    ],
    homeList: [],
    homeData: [],
    openid: '',
    easyFlag: false,
    isLoadMore: true,
    total: 0, // 总共多少条
    limit: 10, // 每次返回10条
    skip: 0 //当前页
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

    let _that = this;
    mood.where({}).count({
      success: res => {
        _that.setData({
          total: res.total
        })
      }
    });
    let openid = wx.getStorageSync('_openid');
    _that.setData({
      openid
    })
    _that.queryHomeList({
      limit: 10,
      skip: 0
    });
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
    let {
      total,
      limit,
      skip
    } = this.data;
    console.log(total, limit, skip)
    if (total / limit > skip + 1) {
      this.setData({
        skip: skip + 1
      });
      this.xialaList({
        limit,
        skip: (skip + 1) * 10
      });
    } else {
      this.setData({
        isLoadMore: false
      })
    }
  },
  easyLike(e) {
    let {
      _id,
      index
    } = e.currentTarget.dataset;
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
        let {
          easyLike
        } = res.data[0];
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
              let {
                updated
              } = res.stats;
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
              let {
                updated
              } = res.stats;
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
    wx.cloud.callFunction({
      name: 'orderby',
      data: obj,
      success(res) {
        let {
          data
        } = res.result;
        for (let i = 0; i < data.length; i++) {
          if (data[i].easyLike.indexOf(_openid) === -1) {
            data[i].isLike = 'iconcanyu';
          } else {
            data[i].isLike = 'iconzhichi';
          }
          if (i === 0) {
            data[i].animation = _that.animationShow(_that, 1, 0, 'up')
          } else {
            data[i].animation = _that.animationShow(_that, 1, (i + 1) * 10, 'down')
          }
        }
        _that.setData({
          homeList: data
        })
      }
    })
  },
  xialaList(obj) {
    let _that = this;
    let _openid = _that.data.openid;
    let homeList = _that.data.homeList;
    wx.cloud.callFunction({
      name: 'orderby',
      data: obj,
      success(res) {
        let {
          data
        } = res.result;
        for (let i = 0; i < data.length; i++) {
          if (data[i].easyLike.indexOf(_openid) === -1) {
            data[i].isLike = 'iconcanyu';
          } else {
            data[i].isLike = 'iconzhichi';
          }
        }
        console.log(data)
        let c = homeList.concat(data);
        _that.setData({
          homeList: c
        })
      }
    })
  },
  animationShow: function (that, opacity, delay, isUp) {
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: delay
    });
    if (isUp == 'down') {
      animation.translateY(0).opacity(opacity).step().translateY(-80).step();
    } else if (isUp == 'up') {
      animation.translateY(0).opacity(opacity).step().translateY(-140).opacity(0).step()
    } else {
      animation.translateY(0).opacity(opacity).step()
    }
    let params = ''
    params = animation.export()
    return params
  }
})