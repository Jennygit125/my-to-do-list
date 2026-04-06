// webpack.config.js
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default (_env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/index.js",
    output: {
      filename: isProduction ? "[name].[contenthash].js" : "[name].js",
      path: path.resolve(import.meta.dirname, "dist"),
      clean: true,
      publicPath: isProduction ? "./" : "/",
      assetModuleFilename: "assets/[name].[contenthash][ext][query]",
    },
    devtool: isProduction ? false : "source-map",
    devServer: {
      watchFiles: ["./src/template.html"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/template.html",
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "[name].[contenthash].css",
            }),
          ]
        : []),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: !isProduction,
              },
            },
          ],
        },
        {
          test: /\.html$/i,
          use: ["html-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
      runtimeChunk: "single",
    },
  };
};
