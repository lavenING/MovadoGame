import Sprite from '../base/sprite'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC   = 'images/bg.jpg'
const BG_IMG_SRC6 = 'images/bg6.jpg'
const BG_IMG_SRC4 = 'images/bg4.jpg'
const BG_IMG_SRC5 = 'images/bg5.jpg'
var BG_WIDTH     = 512
var BG_HEIGHT    = 512
var num
/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class BackGround extends Sprite {
  constructor(ctx) {
    num = Math.floor(Math.random() * 3 + 1)
    num=3
    if (num == 1){
      BG_WIDTH = 512
      BG_HEIGHT=512
      super(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT)
      this.render(ctx)

      this.top = 0
    }else if(num==2){
      BG_WIDTH = 719
      BG_HEIGHT = 1200
      super(BG_IMG_SRC5, BG_WIDTH, BG_HEIGHT)
    }else{
      BG_WIDTH = 700
      BG_HEIGHT = 700
      super(BG_IMG_SRC6, BG_WIDTH, BG_HEIGHT)
    }

    this.render(ctx)
    this.top = 0
  }

  update() {
    if(num!=1)
    return
    this.top += 2

    if ( this.top >= screenHeight )
      this.top = 0
  }

  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render(ctx) {
    if (num != 1){
      ctx.drawImage(
        this.img,
        0,
        0,
        // canvas.width,
        // canvas.height,
        this.width,
        this.height,
        0,
        0,
        screenWidth,
        screenHeight
      )
      return
    }
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      -screenHeight + this.top,
      screenWidth,
      screenHeight
    )

    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      this.top,
      screenWidth,
      screenHeight
    )
  }
}
