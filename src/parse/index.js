const cheerio = require("cheerio");
const parseHTML = (HTMLString) => {
  const $ = cheerio.load(HTMLString);
  const selector = {
    name: "h1",
    director: 'a[rel="v:directedBy"]',
    tags: 'span[property="v:genre"]',
    // cover: 'img[rel="v:image"]'
  };
  const result = {}
  Object.keys(selector).forEach((key) => {
    const el = $(selector[key])
    if (el.length > 1) {
      result[key] = []
      for (let i = 0; i < el.length ; i++) {
        result[key].push($(el[i]).text().replaceAll(/\t|\n| /gm, ""))
      }
    } else {
      result[key] = el.text().replaceAll(/\t|\n| /gm, "")
    }
  });
  console.log('over: ', result)
};
module.exports = {
  parseHTML,
};
