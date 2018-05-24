/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(imgSrc = '', width , height , x = 0, y = 0, imgg, num) {
    this.img = new Image()
    this.img.src = imgSrc
    this.isFriend=false
    if (imgg!=null) {
      this.Num=num
      this.img=imgg
      this.isFriend=true
      //console.log('imgg:', imgg, this.isFriend)
    }

    this.width = width
    this.height = height

    this.x = x
    this.y = y

    this.visible = true
  }
  setwidthheight(w,h){
    this.width=w
    this.height=h
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if (!this.visible)
      return
      /*====================================*/
    if (this.isFriend){
      ctx.save()
      var cx = this.x + 20
      var cy = this.y + 20
      ctx.beginPath()
      ctx.arc(cx, cy, 20, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(
        this.img, this.Num*40, 0, canvas.width, canvas.height,
        this.x,
        this.y,
        canvas.width,
        canvas.height
      )
      ctx.restore()
      return
    }
    /*====================================*/
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵的中心点处于本精灵所在的矩形内即可
   * @param{Sprite} sp: Sptite的实例
   */
  // isCollideWith(sp) {
  //   let spX = sp.x + sp.width / 2
  //   let spY = sp.y + sp.height / 2

  //   if (!this.visible || !sp.visible)
  //     return false

  //   return !!(spX >= this.x
  //     && spX <= this.x + this.width
  //     && spY >= this.y
  //     && spY <= this.y + this.height)
  // }

  isCollideBetween(ball1) {
    //console.log(this.width,this.height,ball1.width,ball1.height)
    let ox = this.x + this.width / 2
    let oy = this.y + this.height / 2
    let ballox = ball1.x + ball1.width / 2
    let balloy = ball1.y + ball1.height / 2
    let dx = ox - ballox;           //两小球圆心距对应的两条直角边
    let dy = oy - balloy;
    var dist = Math.sqrt(dx * dx + dy * dy);    //两直角边求圆心距

    if (!ball1.visible || !this.visible)
      return false

    return !!(dist <= (this.width / 2 + ball1.width / 2))
  }

}
