import Sprite   from '../base/sprite'
import Bullet   from '../player/bullet'
import DataBus  from '../databus'

const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight

// 玩家相关常量设置

var PLAYER_WIDTH   = 20
var PLAYER_HEIGHT  = 20

let databus = new DataBus()

export default class Player extends Sprite {
  constructor(res) {
    super(res.userInfo.avatarUrl, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕居中位置
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight / 2- this.height/2

    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false

    this.bullets = []

    //获取用户最高分
    this.getmaxscore()

    // 初始化事件监听
    this.initEvent()
  }
  setSize(size){
    PLAYER_WIDTH = size
    PLAYER_HEIGHT = size
    super.setwidthheight(size, size)
  }
  //图片裁剪为圆形
  drawToCanvas(ctx) {
    if (!this.visible)
      return
    ctx.save()
    var cx = this.x + PLAYER_WIDTH/2
    var cy = this.y + PLAYER_HEIGHT/2
    ctx.beginPath()
    ctx.arc(cx, cy, PLAYER_HEIGHT/2,0,2*Math.PI)
    ctx.strokeStyle = "yellow"
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.clip()
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      PLAYER_WIDTH,
      PLAYER_HEIGHT
    )
    ctx.restore()
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(   x >= this.x - deviation
              && y >= this.y - deviation
              && x <= this.x + this.width + deviation
              && y <= this.y + this.height + deviation  )
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x0,y0,x, y) {
    // let disX = x - this.width / 2
    // let disY = y - this.height / 2
    let disX = this.x + (x - x0) * 3 / 2
    let disY = this.y + (y - y0)*3/2
    //console.log(disX,disY,x0, y0, x, y)

    if ( disX < 0 )
      disX = 0

    else if ( disX > screenWidth - this.width )
      disX = screenWidth - this.width

    if ( disY <= 0 )
      disY = 0

    else if ( disY > screenHeight - this.height )
      disY = screenHeight - this.height

    //console.log(disX, disY, x0, y0, x, y)
    this.x = disX
    this.y = disY
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    let x0,y0
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      // let x = e.touches[0].clientX
      // let y = e.touches[0].clientY
      x0 = e.touches[0].clientX
      y0 = e.touches[0].clientY

      //
      this.touched = true
      // if ( this.checkIsFingerOnAir(x, y) ) {
      //   this.touched = true

      //   this.setAirPosAcrossFingerPosZ(x, y)
      // }

    }).bind(this))

    canvas.addEventListener('touchmove', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      if ( this.touched ){
        this.setAirPosAcrossFingerPosZ(x0, y0, x, y)
        x0=x
        y0=y
      }

    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()

      this.touched = false
    }).bind(this))
  }

  getPlayerPos(){
    return [this.x,this.y]
  }

  getmaxscore(){
    let openDataContext = wx.getOpenDataContext()
    openDataContext.postMessage({
      // text: 'hello',
      // year: (new Date()).getFullYear()
    })
  }

  // /**
  //  * 玩家射击操作
  //  * 射击时机由外部决定
  //  */
  // shoot() {
  //   let bullet = databus.pool.getItemByClass('bullet', Bullet)

  //   bullet.init(
  //     this.x + this.width / 2 - bullet.width / 2,
  //     this.y - 10,
  //     10
  //   )

  //   databus.bullets.push(bullet)
  // }
}
