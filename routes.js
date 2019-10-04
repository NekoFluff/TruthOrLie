const routes = require("next-routes")();

routes
  .add("/topics/new", "/topics/new")
  .add("/topics/:address", "/topics/details");
//   .add('/topics/:address/requests', '/topics/requests/index')
//   .add('/topics/:address/requests/new', '/topics/requests/new');

module.exports = routes;
