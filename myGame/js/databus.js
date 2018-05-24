import Pool from './base/pool'
//import Bullet from './player/bullet'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance)
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame = 0
    this.score = 0
    this.enemys = []
    this.animations = []
    this.gameOver = false
    this.s=1
    this.death=0
    this.enemystatus=[]
    this.datalist=[]
    this.maxscore=0
    this.life=2
    this.bullets = []
    this.bosses=[]
    this.size=20
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    let temp = this.enemys.shift()

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    //let temp = this.bullets.shift()

    bullet.visible = false

    //this.pool.recover('bullet', bullet)
  }
}
