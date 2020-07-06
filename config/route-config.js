module.exports = {
  init(app) {
    require('../routes/static')(app);
    require('../routes/facts')(app);
  },
};
