var path = require('path');
   module.exports = {
       entry: './lib/linSys.js',
       output: {
           path: __dirname,
           filename: 'linSys.js'
       },
       module: {
           loaders: [
               { test: path.join(__dirname, 'es6'),
                 loader: 'babel-loader' }
           ]
       }
   };
