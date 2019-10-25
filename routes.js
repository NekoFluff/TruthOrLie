const routes = require("next-routes")();

routes
  .add("/topics/new", "/topics/new")
  .add("/topics/:address", "/topics/details")
  .add("/topics/:address/arguments/new", "/topics/arguments/new")
  .add("/topics/:address/arguments/:creator/vote", "/topics/arguments/vote");
//   .add('/topics/:address/requests', '/topics/arguments/index')

module.exports = routes;
