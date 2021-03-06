const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const parts = require('./webpack.parts')
const merge = require('webpack-merge')
const glob = require('glob')
const webpack = require('webpack')

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
      name: '[name].[hash:8].[ext]',
    },
  }),
  parts.loadJavascript({
    include: PATHS.app,
  }),
)

const productionConfig = merge(
  // including hashes related to the file contents to their names allows to invalidate them on the client side
  {
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[chunkhash:8].js',
    },
  },
  // module use hashes instead of IDs
  {
    plugins: [new webpack.HashedModuleIdsPlugin()],
  },
  {
    recordsPath: path.join(__dirname, "records.json"),
  },
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
    // separete manifest from vendor bundle - vendor bundle won't change when the app files change
    {
      name: 'manifest',
      minChunks: Infinity,
    },
  ]),
  // extractCSS generate css bundle separated from js bundle to achieve faster css loading
  // autoprefix add vendor prefixes to CSS
  parts.extractCSS({ use: ['css-loader', parts.autoprefix()] }),
  // eliminates unused CSS
  parts.purifyCSS({
    paths: glob.sync('${PATHS.app}/**/*.js', { nodir: true }),
  }),
  // inline images using url-loader
  // larger images are separated from js bundle using file-loader
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[hash:8].[ext]',
    },
  }),
  parts.minifyJavascript(),
  parts.minifyCss({
    options: {
      discardComments: {
        removeAll: true,
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      safe: true,
    },
  }),
  parts.generateSourceMaps({ type: 'source-map' }),
  // define performance budget
  {
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000, // in bytes
    },
  },
  // enables JavaScript minifier to delete the development-only code from the build
  parts.setFreeVariable('process.env.NODE_ENV', 'production'),
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
