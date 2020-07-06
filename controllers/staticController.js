module.exports = {
  call(req, res, next) {
    res.send({ express: 'Hello From Express' });
  },

  response(req, res) {
    // console.log(req.body);
    res.send(
      `I received your POST request. This is what you sent me: ${req.body.post}`
    );
  },
  about(req, res, next) {
    res.render('static/about', { title: 'About Us' });
  },
};
