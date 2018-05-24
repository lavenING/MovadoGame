import Consts from './consts'

let sharedCanvas = wx.getSharedCanvas()
let context = sharedCanvas.getContext('2d')

const Grade = 'maxscore'
const PAGE_SIZE = 6;
const ITEM_HEIGHT = 125;

let frienddata
let maxScore

const dataSorter = (gameDatas, field = Grade) => {
  return gameDatas.sort((a, b) => {
    const kvDataA = a.KVDataList.find(kvData => kvData.key === Grade);
    const kvDataB = b.KVDataList.find(kvData => kvData.key === Grade);
    const gradeA = kvDataA ? parseInt(kvDataA.value || 0) : 0;
    const gradeB = kvDataB ? parseInt(kvDataB.value || 0) : 0;
    console.log(gradeA, gradeB)
    return gradeA > gradeB ? -1 : gradeA < gradeB ? 1 : 0;
  });
}

export default class Main {
  constructor() {
    this.width=40
    this.height=40
    this.getFriendData()
    this.getmaxscore()
    this.listen()
  }

  getmaxscore() {
    console.log('getmaxscore start')
    wx.getUserCloudStorage({
      keyList: [
        'maxscore'
      ],
      success: function (res) {
        console.log('maxscore:', res.KVDataList.find(kvData => kvData.key === 'maxscore').value)
        maxScore = res.KVDataList.find(kvData => kvData.key === 'maxscore').value
      },
      fail: res => {
        console.log("wx.maxscore fail", res);
      },
    })
  }

  drawFriendPic() {
    context.clearRect(0, 0, context.width, context.height)
    context.save()

    let arr=[]
    for (let j = 0, len = frienddata.length-1; j < len; j++){
      arr[j]=[j]
    }
    arr.sort(function () { return 0.5 - Math.random() })

    for (let i = 0, len = frienddata.length-1; i < len; i++) {
      var imgSrc = frienddata[arr[i]].avatarUrl
    let img = wx.createImage()
    img.onload = function () {
      context.beginPath()
      context.drawImage(
        img, i*40, 0, 40, 40
      )
    }
    img.src = imgSrc   
    }
    context.restore()
    //context.scale(375 / 40, 667 / 40)
  }

  getFriendData(){
    console.log('getFriendCloudStorage start')
    wx.getFriendCloudStorage({
      success: res => {
        let data = res.data
        console.log("friend data:",res)
        frienddata = data;
        const dataLen = res.data.length;
        this.gameDatas = dataSorter(res.data);
        this.currPage = 0;
        this.totalPage = Math.ceil(dataLen / PAGE_SIZE);
        if (dataLen) {
          this.showPagedRanks(0);
        }
        //this.drawFriendPic(data)
      },
      fail: res => {
        console.log("wx.getFriendCloudStorage fail", res);
      },
    })
  }

  listen() {
    wx.onMessage(msg => {
      console.log("ranklist wx.onMessage", msg);
      switch (msg.action) {
        case 'FetchFriend':
          this.drawFriendPic();
          console.log("drawFriendPic:", msg);
          break;
        case 'MaxScore':
          console.log('msg.theScore:', msg.text, 'max:', parseInt(maxScore))
          if (isNaN(parseInt(maxScore)) || parseInt(maxScore) < parseInt(msg.text)){
            console.log('上传最高分')
            let obj = {
              KVDataList: [{ key: 'maxscore', value: msg.text }],
              success: (response) => { console.log('上传数据成功', response) },
              fail: (response) => { console.log('上传数据失败', response) }
            }
            wx.setUserCloudStorage(obj)
          }
          break;
        // case Consts.DomainAction.FetchGroup:
        //   if (!msg.data) {
        //     return;
        //   }
        //   this.fetchGroupData(msg.data);
        //   break;

        // case Consts.DomainAction.Paging:
        //   if (!this.gameDatas.length) {
        //     return;
        //   }
        //   const delta = msg.data;
        //   const newPage = this.currPage + delta;
        //   if (newPage < 0) {
        //     console.log("已经是第一页了");
        //     return;
        //   }
        //   if (newPage + 1 > this.totalPage) {
        //     console.log("没有更多了");
        //     return;
        //   }
        //   this.currPage = newPage;
        //   this.showPagedRanks(newPage);
        //   break;

        default:
          console.log(`未知消息类型:msg.action=${msg.action}`);
          break;
      }
    });
  }

  showPagedRanks(page) {
    const pageStart = page * PAGE_SIZE;
    const pagedData = this.gameDatas.slice(pageStart, pageStart + PAGE_SIZE);
    const pageLen = pagedData.length;

    context.clearRect(0, 0, 1000, 1000);
    for (let i = 0, len = pagedData.length; i < len; i++) {
      drawRankItem(context, i, pageStart + i + 1, pagedData[i], pageLen);
    }
  }
  
}
function drawRankList(data) {
  data.forEach((item, index) => {
    // ...
  })
}

//canvas原点在左上角
function drawRankItem(ctx, index, rank, data, pageLen)
{
  const avatarUrl = data.avatarUrl//.substr(0, data.avatarUrl.length - 1) + "132";
  const nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
  const kvData = data.KVDataList.find(kvData => kvData.key === Grade);
  const grade = kvData ? kvData.value : 0;
  const itemGapY = ITEM_HEIGHT * index;
  //名次
  ctx.fillStyle = "#D8AD51";
  ctx.textAlign = "right";
  ctx.baseLine = "middle";
  ctx.font = "70px Helvetica";
  ctx.fillText(`${rank}`, 90, 80 + itemGapY);

  //头像
  const avatarImg = wx.createImage();
  avatarImg.src = avatarUrl;
  avatarImg.onload = () => {
    if (index + 1 > pageLen) {
      return;
    }
    ctx.drawImage(avatarImg, 120, 10 + itemGapY, 100, 100);
  };

  //名字
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.baseLine = "middle";
  ctx.font = "50px Helvetica";
  ctx.fillText(nick, 235, 80 + itemGapY);

  //分数
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.baseLine = "middle";
  ctx.font = "30px Helvetica";
  ctx.fillText(`${grade}分`, 620, 80 + itemGapY);

  //分隔线
  // const lineImg = wx.createImage();
  // lineImg.src = 'subdomain/images/llk_x.png';
  // lineImg.onload = () => {
  //   if (index + 1 > pageLen) {
  //     return;
  //   }
  //   ctx.drawImage(lineImg, 14, 120 + itemGapY, 720, 1);
  // };
}


