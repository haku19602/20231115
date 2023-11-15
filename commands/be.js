import axios from 'axios'
import * as cheerio from 'cheerio'
import beTemplate from '../templates/be.js'

export default async (event) => {
  try {
    const { data } = await axios.get('https://wdaweb.github.io/')
    // 套件規定這樣寫
    const $ = cheerio.load(data)
    // const replies 陣列存資料
    const replies = []
    $('#be .card').each(function () {
      const image = $(this).find('img').attr('src')
      // new URL(檔案路徑, 主網域)
      const imageUrl = new URL(image, 'https://wdaweb.github.io/')
      const title = $(this).find('.card-title').text().trim()
      console.log(image, title) // delete
      // 產生一個新回應訊息模板
      const template = beTemplate()
      // 修改版面內容
      template.hero.url = imageUrl
      template.body.contents[0].text = title
      replies.push(template)
    })
    const result = await event.reply({
      // 不能 type: 'bubble',
      type: 'flex',
      altText: '後端課程',
      contents: {
        type: 'carousel',
        contents: replies
      }
    })
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
