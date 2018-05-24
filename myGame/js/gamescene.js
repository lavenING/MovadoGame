import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import MyEnemy from './npc/myenemy'
import Bullet from './player/bullet'

let ctx = canvas.getContext('2d')
let databus = new DataBus()
var time
var userdata
let player
let openDataContext = wx.getOpenDataContext()
let bulletdirection=1
const ENEMY_IMG_SRC = 'images/xiao3.png'
/**
 * 游戏主函数
 */
export default class GameScene {
  constructor(res) {
    if(!databus.gameover){
    // 维护当前requestAnimationFrame的id
    setInfo(res)
    this.getfriendinfo()
    console.log('传入数据',res)
    this.aniId = 1
    this.restart()
    }
  }

  getfriendinfo(){
    openDataContext.postMessage({
      action: 'FetchFriend',
    })
  }

  restart() {
    databus.reset()
    //console.log(databus)
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )
    this.bg = new BackGround(ctx)
    this.player = new Player(userdata)
    this.player.setSize(databus.size)
    player=this.player
    this.enemyGenerate()
    this.gameinfo = new GameInfo()
    //this.music = new Music()
    this.time = setInterval(function () { upscore() }, 1000)
    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )

  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    var position = this.player.getPlayerPos()
    for (var i = 0; i < 6; i++) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy, ENEMY_IMG_SRC)
      enemy.init(position)
      databus.enemys.push(enemy)
      databus.enemystatus.push(0)
    }
    let sharedCanvas = openDataContext.canvas   
    for (var i = 0; i < 2; i++) {
      let enemy1 = databus.pool.getItemByClass('myenemy', MyEnemy, sharedCanvas,i)
      enemy1.init([i,0])
      databus.enemys.push(enemy1)
      databus.enemystatus.push(1)
      databus.bosses.push(enemy1)
    }
  }

  // 全局碰撞检测
  collisionDetection() {

    for (let i = 0, il = databus.bullets.length; i < il; i++) {
      if (this.player.isCollideBetween(databus.bullets[i])) {
        databus.bullets[i].visible = false
        databus.size+=5
        this.player.setSize(databus.size)
        if(databus.life<3){
          databus.life += 1
        }
        //databus.life -= 1
        break
      }
    }

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]
      if (this.player.isCollideBetween(enemy)) {
        enemy.playAnimation()
        databus.death += 1
        //databus.enemystatus[i] *= 0
        databus.life -=1
        if(databus.enemystatus[i]==1){
          databus.life += 2
          databus.size = 100 
          this.player.setSize(databus.size)
        }else if (databus.size>20){
          databus.size -= 5
          this.player.setSize(databus.size)
        }
        //that.music.playExplosion()
        break
      }
    }
    if (databus.life <1){
      clearInterval(this.time)//停止加分
      openDataContext.postMessage({
        action: 'MaxScore',
        text: databus.score.toString()
      })
      databus.gameOver = true
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY){
      this.restart()
      return
      }

    let area2 = this.gameinfo.btnArea2

    if (x >= area2.startX
      && x <= area2.endX
      && y >= area2.startY
      && y <= area2.endY)
      this.onTouchGroupRank()
  }

  onTouchGroupRank() {
    wx.shareAppMessage({
      title: '这是个吃好友的游戏',
      imageUrl: canvas.toTempFilePathSync({
        destWidth: 500,
        destHeight: 400
      })
    })
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    if (!databus.gameOver){
    databus.bullets
      .forEach((item) => {
        //if (item.visible) 
        item.drawToCanvas(ctx)
      })
    }
    databus.enemys.forEach((item) => {
      item.drawToCanvas(ctx)
    })
    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, '分数：' + databus.score, databus.life)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver)
      return;

    this.bg.update()

    databus.bullets
      .forEach((item) => {
        if (item.visible) 
        item.update()
      })

    var position = this.player.getPlayerPos()
    databus.enemys
      .forEach((item) => {
        item.update(position)
      })

    this.collisionDetection()
    if (databus.frame % 40 === 0) {
      if (!databus.gameOver) {
      databus.bosses
        .forEach((boss) => {
          if (boss.visible){
            bulletdirection = -bulletdirection
            boss.shoot(bulletdirection)
          }
        })
      }
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
  
}
function upscore() {
  databus.score += 1
  
  var position = player.getPlayerPos()
  let enemy = databus.pool.getItemByClass('enemy', Enemy, ENEMY_IMG_SRC)
  enemy.init(position)
  databus.enemys.push(enemy)
  databus.enemystatus.push(0)
  if (databus.score>20){
    var position = player.getPlayerPos()
    let enemy2 = databus.pool.getItemByClass('enemy', Enemy, ENEMY_IMG_SRC)
    enemy2.init(position)
    databus.enemys.push(enemy2)
    databus.enemystatus.push(0)
  }
  //databus.s = databus.s +0.5  //1.取消敌人速度变更##################
}

function setInfo(res) {
  userdata = res
}