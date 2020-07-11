const mongoose = require('mongoose');
const Fact = mongoose.model('facts');
const Send = mongoose.model('send');
const Reply = mongoose.model('reply');
const axios = require('axios');
const Count = mongoose.model('count');
const getNameFromNumber = require('../helpers/getNameFromNumber');
const phonebook = require('../client/src/phonebook');
// const url = `https://chucknorrisfacts.net/facts.php?page=${count.page}`;
const cheerio = require('cheerio');

let factData = [];
const getData = (html) => {
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

module.exports = {
  async getTheCount(callback) {
    Count.findOne()
      .sort({ field: 'asc', _id: -1 })
      .limit(1)
      .then(async (latestCount) => {
        //if this is the first count EVER..should only happen once
        if (latestCount == null) {
          console.log('count is NULL!');
          const latestCount = new Count({
            page: 1,
            item: 1,
            created_at: Date.now(),
          });
          let facts = await Fact.findOne({ page: 1 });
          if (facts != null) {
            latestCount.save();
            var count_and_facts = { latestCount, facts };
            callback(null, count_and_facts);
          } else {
            const url = `https://chucknorrisfacts.net/facts.php?page=${latestCount.page}`;
            axios
              .get(url)
              .then((response) => {
                const facts = new Fact({
                  page: latestCount.page,
                  created_at: Date.now(),
                  list: getData(response),
                });
                try {
                  facts.save();
                  latestCount.save();
                  var count_and_facts = { latestCount, facts };
                  callback(null, count_and_facts);
                } catch (err) {
                  callback(err);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } else {
          if (latestCount.item == 20) {
            //need to signal new call is to be made on controller, will also need to save next 20 facts
            latestCount.item = 1;
            latestCount.page = latestCount.page + 1;
            latestCount.created_at = Date.now();

            let facts = await Fact.findOne({ page: latestCount.page });
            if (facts != null) {
              latestCount.save();
              var count_and_facts = { latestCount, facts };
              callback(null, count_and_facts);
            } else {
              const url = `https://chucknorrisfacts.net/facts.php?page=${latestCount.page}`;
              axios
                .get(url)
                .then((response) => {
                  const facts = new Fact({
                    page: latestCount.page,
                    created_at: Date.now(),
                    list: getData(response),
                  });
                  try {
                    facts.save();
                    latestCount.save();
                    var count_and_facts = { latestCount, facts };
                    callback(null, count_and_facts);
                  } catch (err) {
                    callback(err);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          } else {
            //just return 20 facts for the page
            latestCount.item = latestCount.item + 1;
            latestCount.created_at = Date.now();
            Fact.findOne({ page: latestCount.page })
              .then((facts) => {
                if (facts == null) {
                  const url = `https://chucknorrisfacts.net/facts.php?page=${latestCount.page}`;
                  axios
                    .get(url)
                    .then((response) => {
                      const facts = new Fact({
                        page: latestCount.page,
                        created_at: Date.now(),
                        list: getData(response),
                      });
                      try {
                        facts.save();
                        latestCount.save();
                        var count_and_facts = { latestCount, facts };
                        callback(null, count_and_facts);
                      } catch (err) {
                        callback(err);
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  try {
                    latestCount.save();
                    var count_and_facts = { latestCount, facts };
                    callback(null, count_and_facts);
                  } catch (err) {
                    callback(err);
                  }
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      });
  },
  async resetTheCount(callback) {
    let count = await Count.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
    count.page = 1;
    count.item = 1;
    count.save();
    let facts = await Fact.findOne({ page: count.page });
    let count_and_facts = { count, facts };
    try {
      callback(null, count_and_facts);
    } catch (err) {
      console.log(err);
    }
  },
  async send(msg, callback) {
    const { body, from, to, dateCreated, type } = msg;
    // console.log(getNameFromNumber(to), to)
    const send = new Send({
      body,
      from,
      fromName: getNameFromNumber(from),
      to,
      toName: getNameFromNumber(to),
      dateCreated,
      type,
    });
    try {
      send.save();
      callback(null, msg);
    } catch (err) {
      throw err;
    }
  },
  async reply(msg, callback) {
    const { Body, From, To } = msg;
    const reply = new Reply({
      Body,
      From,
      fromName: getNameFromNumber(From),
      To,
      toName: getNameFromNumber(To),
      dateCreated: Date.now(),
    });
    try {
      reply.save();
      callback(null, msg);
    } catch (err) {
      throw err;
    }
  },
};
