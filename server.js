const next = require("next");
const port = parseInt(process.env.PORT, 10) || 3000
const routes = require("./routes");
const app = next({
  dev: process.env.NODE_ENV !== "production"
});
const handler = routes.getRequestHandler(app);
const HomormorphicEncryption = {a: () => {return 1;}};

const handle = app.getRequestHandler();

// Create server
const express = require('express')
app.prepare().then(() => {
  const server = express();

  server.get('/a', (req, res) => {
    console.log("Homomorhpic Encryption A");
    console.log(HomormorphicEncryption.a());
    return handle(req, res)
  })

  server.all('*', (req, res) => {
    console.log("Homomorhpic Encryption STAR");

    return handle(req, res)
  })

  server.use(handler).listen(3000, err => {
    if (err) throw err;
    console.log("Ready on localhost:3000");
  });
})


