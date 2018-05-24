import Enemy from './enemy'
import DataBus from '../databus'
import Bullet from '../player/bullet'

let databus = new DataBus()

export default class MyEnemy extends Enemy {
  constructor(imgg,num) {
    super('', 40,40,imgg,num)
    this.imgg=imgg
    this.num=num
  }

  init([i, j]){
    this.x=(i+1)/3*canvas.width
    this.y=j
  }

  update([x0, y0]) {
    this.x = this.x
    this.y = this.y
  }

  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot(direction) {
    let bullet = databus.pool.getItemByClass('bullet', Bullet, this.imgg)

    bullet.init(
      this.x + this.width / 2 - bullet.width / 2,
      this.y - 10,
      2,
      this.num,
      direction
    )

    databus.bullets.push(bullet)
  }
}