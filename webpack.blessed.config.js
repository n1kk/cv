const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

console.log("USING THIS !!!")

module.exports = {
  mode: "development",
  devtool: '#eval-source-map',
  
  entry: './src/term.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'term.js',
    libraryTarget: 'commonjs'
  },
  target: 'node',
  externals: [nodeExternals()].concat(['../../dist/build']),
  
  module: {
    rules: [
      {
        test: /\.pug/,
        use: [
          //'html-loader',
          'pug-plain-loader',
          //{ loader: 'pug-loader?sourceMap', query: {} },
          //'pug-loader?sourceMap'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  
  plugins: [
    new VueLoaderPlugin(),
  ],
}
