var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: __dirname + '/src',
    entry: ['whatwg-fetch','./root.js'],
    devServer:{
      historyApiFallback: true
    },
    module: {
        loaders: [
          {
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
                presets: ['react','es2015','stage-0']
            }
        },
        // {
        //   test: /\.(js|jsx)$/,
        //   exclude: /(node_modules)/,
        //   loader: 'eslint-loader',
        //   enforce: 'pre'
        // },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        },
        {
          test: /\.less$/,
           loader: 'style-loader!css-loader!less-loader'
         },
         {
           test: /\.json$/,
           loader: 'json-loader'
         },
         {
            test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=8192'
          },
          {
            test: /\.(mp4|ogg|svg)$/,
            loader: 'file-loader'
          }

      ]
    },
    output: {
        path: __dirname + "/dist/",
        publicPath: "/dist/",
        filename: "main.js"
    }
};
