const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const parts = require('./webpack.parts')
const merge = require('webpack-merge')
const glob = require('glob')

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
}

const commonConfig = merge({
  // Entries have to resolve to files! They rely on Node
  // convention by default so if a directory contains *index.js*,
  // it resolves to that.
  entry: {
    app: PATHS.app,
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'lawyerfy',
    }),
  ],
})

const productionConfig = merge(
  // extractCSS generate css bundle separated from js bundle to achieve faster css loading
  // autoprefix add vendor prefixes to CSS
  parts.extractCSS({ use: ['css-loader', parts.autoprefix()] }),
  // eleminates unused CSS
  parts.purifyCSS({
    paths: glob.sync('${PATHS.app}/**/*.js', { nodir: true }),
  }),
  // load images with url-loader to inline images, if too big, use file-loader to separate it from js bundle
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[ext]',
    },
  }),
  parts.loadSvgImages(),
)

const developmentConfig = merge(
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadSvgImages(),
  parts.loadImages(),
)

module.exports = env => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig)
  }
  return merge(commonConfig, developmentConfig)
}
