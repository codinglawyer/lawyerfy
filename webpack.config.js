const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const parts = require('./webpack.parts')
const merge = require('webpack-merge')
const glob = require('glob')

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
}

const commonConfig = merge(
  {
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
  },
  // limit font size, if above emits a separate file
  parts.loadFonts({
    options: {
      limit: 50000,
      name: '[name].[ext]',
    },
  }),
  parts.loadJavascript({
    include: PATHS.app,
  }),
)

const productionConfig = merge(
  // include information about the build to the build folder
  parts.clean(PATHS.build),
  parts.attachRevision(),
  // extract dependencies to a separate vendor bundle
  parts.extractBundles([
    {
      name: 'vendor',
      minChunks: ({ resource }) =>
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/),
    },
  ]),
  // extractCSS generate css bundle separated from js bundle to achieve faster css loading
  // autoprefix add vendor prefixes to CSS
  parts.extractCSS({ use: ['css-loader', parts.autoprefix()] }),
  // eliminates unused CSS
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
  parts.generateSourceMaps({ type: 'source-map' }),
)

const developmentConfig = merge(
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
)

module.exports = env => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig)
  }
  return merge(commonConfig, developmentConfig)
}
