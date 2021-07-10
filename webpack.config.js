const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    comment: BASE_JS + "comment.js",
    videoPreview: BASE_JS + "videoPreview.js",
    sideNav: BASE_JS + "sideNav.js",
    search: BASE_JS + "search.js",
    photoComment: BASE_JS + "photoComment.js",
    homeAni: BASE_JS + "homeAni.js",
    photoWatch: BASE_JS + "photoWatch.js",
    ratingPhoto: BASE_JS + "ratingPhoto.js",
    ratingVideo: BASE_JS + "ratingVideo.js",
  },
  mode: "development",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
