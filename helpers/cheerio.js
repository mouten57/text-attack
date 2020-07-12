const cheerio = require('cheerio');
const axios = require('axios');

let factData = [];

module.exports = function (html) {
  let temp_url_array = html.config.url.split('page=');
  // console.log(temp_url_array[temp_url_array.length - 1]);
  const $ = cheerio.load(html.data);
  $('#content div > p:contains("Chuck")').each((i, elem) => {
    factData.push({
      fact: $(elem).text(),
    });
  });
  // factData.push(count);
  return factData;
};
