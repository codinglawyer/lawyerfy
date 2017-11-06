const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    historyApiFallback: true,
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warnings: true,
    },
  },
})

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
})

exports.extractCSS = ({ include, exclude, use } = {}) => {
  const plugin = new ExtractTextPlugin({
    filename: '[name].css',
  })
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: plugin.extract({
            use,
            fallback: 'style-loader',
          }),
        },
      ],
    },
    plugins: [plugin],
  }
}

exports.purifyCSS = ({ paths }) => ({
  plugins: [new PurifyCSSPlugin({ paths })],
})

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => [require('autoprefixer')()],
  },
})

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(jpg|png|svg)$/,
        include,
        exclude,

        use: {
          loader: 'url-loader',
          options,
        },
      },
    ],
  },
})

// use react-svg-loader for React apps
exports.loadSvgImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.svg$/,
        include,
        exclude,

        use: {
          loader: 'file-loader',
        },
      },
    ],
  },
})
