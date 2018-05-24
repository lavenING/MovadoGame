import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import Music from './runtime/music'
import GameScene from './gamescene'
import StartPage from './runtime/startpage'

let ctx = canvas.getContext('2d')
let start = false

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0
    this.start()
  }

  start(){
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )
    this.startpage = new StartPage(ctx)
    this.hasEventBind = true
    this.render()
  }
  //触摸事件
  touchEventHandler(e) {
    if(start){
      return
    }
    this.touchHandler = this.touchEventHandler.bind(this)
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.startpage.btnArea
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY){
      getUserInfo()
      this.hasEventBind = false
      canvas.removeEventListener(
        'touchstart',
        this.touchHandler
      )
    }
    let area2 = this.startpage.btnArea2
    if (x >= area2.startX
      && x <= area2.endX
      && y >= area2.startY
      && y <= area2.endY) {
      this.startpage.showRank(ctx)
    }
  }
  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 游戏开始前的触摸事件处理逻辑
    if (this.hasEventBind) {
      this.hasEventBind = true
      this.touchHandler = this.touchEventHandler.bind(this)
      canvas.addEventListener('touchstart', this.touchHandler)
    }
  }
}
/**
 * 获取用户信息
 */
function getUserInfo() {
  wx.getSetting({
    success: function (res) {
      var authSetting = res.authSetting
      if (authSetting['scope.userInfo'] === true) {
        // 用户已授权，可以直接调用相关 API
        wx.login({
          success: function () {
            wx.getUserInfo({
              success: function (res) {
                //console.log(res.userInfo.avatarUrl)
                new GameScene(res)
                start = true
                console.log('new Menu1')
              }
            })
          }
        })
      } else if (authSetting['scope.userInfo'] === false) {
        // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
        console.log('获取用户信息失败')
        //new GameScene('images/head1.png')
      } else {
        // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
        wx.login({
          success: function () {
            wx.getUserInfo({
              success: function (res) {
                new GameScene(res)
                start = true
                console.log('new Menu3')
              }
            })
          }
        })
      }
    }
  })
}