import Sprite from '../base/sprite'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC = 'images/startpic.jpg'

var BG_WIDTH = 1080
var BG_HEIGHT = 1920
var num
/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class StartPage {
  constructor(ctx) {
    //super(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT)

    this.render(ctx)
    console.log('启动页')
    this.top = 0
  }

  render(ctx) {
    var img = wx.createImage()
    img.src = BG_IMG_SRC
    img.onload=function(){
      ctx.drawImage(
        img,
        0,
        0,
        BG_WIDTH,
        BG_HEIGHT,
        0,
        0,
        canvas.width,
        canvas.height
      )
      renderGameStart(ctx)
    }
    /**
   * 重新开始按钮区域
   * 方便简易判断按钮点击
   */
    this.btnArea = {
      startX: screenWidth / 2 +75,
      startY: screenHeight / 2 -105,
      endX: screenWidth / 2 + 175,
      endY: screenHeight / 2 -70
    }
    this.btnArea2 = {
      startX: screenWidth / 2 + 85,
      startY: screenHeight / 2 - 25,
      endX: screenWidth / 2 + 175,
      endY: screenHeight / 2 + 10
    }
  }

  showRank(ctx){
    let openDataContext = wx.getOpenDataContext()
    let sharedCanvas = openDataContext.canvas
    ctx.drawImage(sharedCanvas, 5, screenHeight / 2 - 100, 90, 160)
    console.log('st sharedCanvas:', sharedCanvas)
  }
}

function renderGameStart(ctx) {

  ctx.fillStyle = "#ffffff"
  ctx.font = "23px Arial"

  ctx.fillText(
    '解救好友大作战',
    screenWidth / 2 - 80,
    screenHeight / 5
  )

  ctx.fillText(
    '开始游戏',
    screenWidth / 2+80,
    screenHeight / 2 -80
  )
  ctx.fillText(
    '排行榜',
    screenWidth / 2 + 100,
    screenHeight / 2
  )
}
