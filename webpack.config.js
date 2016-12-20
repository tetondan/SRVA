module.exports = {
    context: __dirname + "/client/dev",
    entry: "./main.js",
    output: {
        path: __dirname + "/client/dist",
        filename: "bundle.js"
    },
    module: {
      loaders: [
        { 
          test: /\.css$/, 
          loader: "style!css" 
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['react', 'es2015']
          }
        }
      ]
    }
};