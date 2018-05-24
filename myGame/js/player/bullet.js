import Sprite   from '../base/sprite'
import DataBus  from '../databus'
import Enemy from '../npc/enemy'

const BULLET_WIDTH   = 20
const BULLET_HEIGHT  = 20

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

export default class Bullet extends Enemy {
  constructor(imgg) {
    super(imgg, BULLET_WIDTH, BULLET_HEIGHT)
    this.imgg=imgg
  }

  init(x, y, speed,num,direction) {
    this.x = x
    this.y = y
    this.num=num
    this.direction = direction
    this[__.speed] = speed

    this.visible = true
  }

  drawToCanvas(ctx) {
    if (!this.visible)
      return
    ctx.save()
    var cx = this.x + 10
    var cy = this.y + 10
    ctx.beginPath()
    ctx.arc(cx, cy, 10, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(
      this.imgg, this.num * 40, 0, canvas.width, canvas.height,
      this.x,
      this.y,
      canvas.width/2,
      canvas.height/2
    )
    ctx.restore()
  }

  // 每一帧更新子弹位置
  update() {
    this.y += this[__.speed]*2
    this.x = this.x
    //this.x -= this.direction*this[__.speed]/2

    // 超出屏幕外回收自身
    //console.log(this.y,this.height)
    if ( this.y <-this.height
    ||(this.y>this.height+canvas.height)
    ||this.x<-this.width
    ||(this.x>this.width+canvas.width))
      databus.removeBullets(this)
  }

}
