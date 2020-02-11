const next = require("next");
const port = parseInt(process.env.PORT, 10) || 3000;
const routes = require("./routes");
// import Topic from "./ethereum/topic";


const app = next({
  dev: process.env.NODE_ENV !== "production"
});
const handler = routes.getRequestHandler(app);
const HomormorphicEncryption = {
  random_keys: () => {
    return paillier.generateRandomKeys(2048);
  },
  encrypt: (publicKey, m) => {
    return publicKey.encrypt(m);
  },
  decrypt: (privateKey, c) => {
    return privateKey.decrypt(c);
  }
};

const handle = app.getRequestHandler();

// Create server
const express = require("express");
app.prepare().then(() => {
  const server = express();

  // Middleware to redirect http to https on production
  if (process.env.NODE_ENV === "production") {
    server.use((req, res, next) => {
      if (req.header("x-forwarded-proto") != "https") {
        res.redirect(`https://${req.header("host")}${req.url}`);
      } else {
        next();
      }
    });
  }

  // server.get("/vote", (req, res) => {
  //   contract = req.query.contract;
  //   account = req.query.account;
  //   const topicContract = Topic(topicAddress);
  //   await topicContract.methods.vote(argumentIndex, reputation).send({
  //     from: account,
  //     value: wei
  //   });
  //   res.send(req.query);
  // });

  // Handler
  server.use(handler).listen(port, err => {
    if (err) throw err;
    console.log(`Ready on localhost:${port}`);
  });
});
