exports.devServer = ({ host, port} = {}) => ({
  devServer:{
    historyApiFallback: true,
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warnings: true,
    }
  }
})