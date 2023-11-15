import axios from 'axios'
import * as cheerio from 'cheerio'
import animeTemplate from '../templates/anime.js'
import fs from 'node:fs'

export default async (event) => {
  try {
    const id = event.message.text.replace('動畫', '')
    const { data } = await axios.get(`https://ani.gamer.com.tw/animeVideo.php?sn=${id}`)
    const $ = cheerio.load(data)

    const template = animeTemplate()

    // 背景圖
    template.body.contents[0].url = $('.data-file img').attr('data-src')

    // 動畫名稱
    template.body.contents[2].contents[0].contents[0].contents[0].text = $('.data-file img').attr('alt')

    // 星星
    const score = $('.score-overall-number').text()
    const totalStar = Math.round(parseFloat($('.score-overall-number').text()))
    for (let i = 0; i < totalStar; i++) {
      template.body.contents[2].contents[0].contents[1].contents[i].url =
        'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
    }
    for (let i = totalStar; i < 5; i++) {
      template.body.contents[2].contents[0].contents[1].contents[i].url =
        'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
    }
    // 分數
    template.body.contents[2].contents[0].contents[1].contents[5].text = score
    // 評分人數
    template.body.contents[2].contents[0].contents[2].contents[0].contents[0].text = $('.score-overall-people').text()

    // 檢查錯誤的語法
    // 先建一個 dump 資料夾，傳訊息給 line
    // 跳出 anime.json 在 dump 資料夾
    // 複製 anime.json 的內容到 line developers 模板的 JSON 貼上
    // 會顯示錯誤訊息
    if (process.env.DEBUG === 'true') {
      fs.writeFileSync('./dump/anime.json', JSON.stringify(template, null, 2))
    }
    // 但這行會影響機器人正常運作
    // 解決 --> 註解 這行跟 import fs，或在 package.json 檔案中加上 :
    // "scripts": {
    // "dev": "nodemon index.js --ignore ./dump/*"
    // }

    const result = await event.reply({
      type: 'flex',
      altText: '查詢結果',
      contents: template
    })
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
