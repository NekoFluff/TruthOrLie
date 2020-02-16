const routes = require("next-routes")();

routes
  .add("/getting-started", "/getting-started")
  .add("/how-it-works", "/how-it-works")
  .add("/topics/new", "/topics/new")
  .add("/topics/:address", "/topics/details")
  .add("/topics/:address/arguments/new", "/topics/arguments/new")
  .add("/topics/:address/arguments/:creator/vote", "/topics/arguments/vote");

module.exports = routes;
