import Animation from '../base/animation'
import DataBus from '../databus'

var ENEMY_IMG_SRC = 'images/dot.png'
const ENEMY_WIDTH = 20
const ENEMY_HEIGHT = 20

const __ = {
  speed: Symbol('speed'),
  alpha: Symbol('alpha')
}
var Xspeed, Yspeed

let databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy extends Animation {
  constructor(imgSrc, width, height, c,num) {
    //console.log(width, height)
    if (width === undefined && height === undefined){
      super(imgSrc, ENEMY_WIDTH, ENEMY_HEIGHT, c, num)
    }else{
      super(imgSrc, width, height, c, num)
    }
    this.imgSrc = imgSrc
    this.initExplosionAnimation()
  }

  init([x0,y0]) {
    this.x=x0
    this.y=y0
    while (((x0 - this.x) * (x0 - this.x) + (y0 - this.y) * (y0 - this.y))<2500){
    this.x = rnd(0, window.innerWidth - ENEMY_WIDTH)
    this.y = rnd(0, window.innerHeight - ENEMY_HEIGHT)
    }
    this[__.speed] = 1
    this[__.alpha] = rnd(0, 360)
    this.Xspeed = this[__.speed] * Math.cos(this[__.alpha])
    this.Yspeed = this[__.speed] * Math.sin(this[__.alpha])

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  // 每一帧更新敌人位置
  update([x0,y0]) {
    // this.Xspeed = this[__.speed] * Math.cos(this[__.alpha])
    // this.Yspeed = this[__.speed] * Math.sin(this[__.alpha])
    var d = (x0 - this.x) * (x0 - this.x) + (y0 - this.y) * (y0 - this.y)
    this.Yspeed = this[__.speed] * (y0 - this.y) / Math.sqrt(d)
    this.Xspeed = this[__.speed] * (x0 - this.x) / Math.sqrt(d)
    this.y += this.Yspeed
    this.x += this.Xspeed

    //3.敌人移动方向变化***************************
    // if (this.isXEdged()) {
    //   this.Xspeed = -this.Xspeed
    // }
    // if (this.isYEdged()) {
    //   this.Yspeed = - this.Yspeed
    // }
    // this.y += this.Yspeed * databus.s
    // this.x += this.Xspeed * databus.s

    // 对象回收
    // if ( this.y > window.innerHeight + this.height )
    //   databus.removeEnemey(this)
  }

  // isXEdged() {
  //   if (!this.visible)
  //     return false

  //   return !!(this.x < (this.width / 2 - this.width / 2)
  //     || this.x > (window.innerWidth - this.width))
  // }
  // isYEdged() {
  //   if (!this.visible)
  //     return false

  //   return !!(this.y < (this.height / 2 - this.height / 2)
  //     || this.y > (window.innerHeight - this.height))
  // }
}
