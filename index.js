const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mainConfig = require('./config/main-config');
const routeConfig = require('./config/route-config.js');
const PORT = process.env.PORT || 5000;
const ngrok = require('ngrok');

//main setup
mainConfig.init(app, express);

//route setup
routeConfig.init(app);

//socket.io setup 2
//ioConfig.init(io);

//express to behave in production
if (process.env.NODE_ENV === 'production') {
  //Express will serve up production assets
  //like our main.js file, or main.css file!
  app.use(express.static('client/build'));

  //Express will serve up index.html file if it doesn't
  //recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

server.listen(PORT, (err) => {
  if (err) return console.log(`Something bad happened: ${err}`);
  console.log(`Now listening on port ${PORT}`);
});
