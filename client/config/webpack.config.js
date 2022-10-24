const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

let mode = 'development';
let target = 'web';
const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    title: 'Footy Stats',
    template: path.resolve(__dirname, '..', './src/index.html'),
  }),
];

if (process.env.NODE_ENV === 'production') {
  mode = 'production';
  target = 'browserslist';
} else if (process.env.NODE_ENV === 'test') {
  mode = 'test';
} else {
  mode = 'development';
  plugins.push(new ReactRefreshWebpackPlugin());
}

module.exports = {
  mode,

  target,

  entry: path.resolve(__dirname, '..', './src/index.js'),

  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
      },
    ],
  },

  plugins,
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, '../src/'),
      'node_modules/',
    ],
  },

  devtool: 'source-map',

  devServer: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000/',
      secure: false,
      changeOrigin: true,
    },
    static: path.resolve(__dirname, '..', './dist'),
    hot: true,
    historyApiFallback: true,
  },
};
