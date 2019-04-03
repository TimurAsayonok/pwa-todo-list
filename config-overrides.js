/* config-overrides.js */

/** import workbox-webpack-plugin */
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

module.exports = function override(config, env) {
  //map all plugins
  config.plugins = config.plugins.map(plugin => {
    //get GenerateSW plugin and change
    if (plugin.constructor.name === 'GenerateSW') {
      return new WorkboxWebpackPlugin.InjectManifest({
        swSrc: './src/sw.js',
        swDest: 'service-worker.js'
      });
    }
    return plugin;
  });

  return config;
}