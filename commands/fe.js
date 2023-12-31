import axios from 'axios'
import * as cheerio from 'cheerio'

export default async (event) => {
  try {
    const { data } = await axios.get('http://wdaweb.github.io/')
    // 套件規定這樣寫
    const $ = cheerio.load(data)
    // const replies 陣列存資料
    const replies = []
    $('#fe .card-title').each(function () {
      replies.push($(this).text().trim())
    })
    event.reply(replies)
  } catch (error) {
    console.log(error)
  }
}
