// var path = require('path');

// const withCSS = require("@zeit/next-css");
// module.exports = withCSS({
//   cssModules: true,
//   webpack(config, { dev, isServer }) {
//     // modify it!
//     config.module.rules.push({
//       test: /\\.css$/,
//       include: path.join(__dirname, 'node_modules'),
//       // use: cssLoaderConfig(extractCSSPlugin, {
//       //   cssModules,
//       //   dev,
//       //   isServer
//       // })
//       loaders: ['style-loader', 'css-loader'],
//     })

//     return config
//   }
// });

const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  cssModules: true
});
