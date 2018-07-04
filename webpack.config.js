const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const resolve = (...paths) => path.resolve(root_dir, ...paths)

module.exports = {
  mode: 'development',
  entry: './src/web.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
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
        test: /\.css$/,
        use: [
          'vue-style-loader',
          //'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
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
  resolve: {
    modules: [path.resolve(__dirname, './node_modules')],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'assets': path.join(__dirname, 'assets'),
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    //new ExtractTextPlugin(),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'ENV_ROUTES': JSON.stringify(
        fs.readdirSync(path.resolve(__dirname, 'src/layouts'))
          .map(name => path.parse(name).name)
      )
    }),
  ],
}
