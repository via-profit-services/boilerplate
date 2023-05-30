import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration, HotModuleReplacementPlugin } from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import "webpack-dev-server";

dotenv.config();
const isDev = process.env.NODE_ENV === "development";
const webpackProdConfig: Configuration = {
  target: "web",
  mode: isDev ? "development" : "production",
  entry: {
    // index: path.resolve(__dirname, "../src/index.tsx"),
    playground: path.resolve(__dirname, "../src/playground/index.tsx"),
  },
  output: {
    path: isDev
      ? path.join(__dirname, "../build")
      : path.join(__dirname, "../dist"),
    publicPath: "/",
    filename: "js/[name]-[contenthash].js",
    chunkFilename: "js/[name]-[chunkhash].js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                process.env.NODE_ENV === "development" && "react-refresh/babel",
              ].filter(Boolean),
            },
          },
          "shebang-loader",
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: !isDev,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
    },
  },
  plugins: [
    ...(isDev
      ? [
          new HotModuleReplacementPlugin(),
          new ReactRefreshWebpackPlugin({
            overlay: false,
          }),
          new HtmlWebpackPlugin({
            templateContent: fs.readFileSync(
              path.resolve(__dirname, "../assets/index.html"),
              { encoding: "utf8" }
            ),
          }),
        ]
      : [
          // prod
        ]),
  ],
  devtool: isDev ? "inline-source-map" : false,
  devServer: isDev
    ? {
        historyApiFallback: {
          verbose: true,
          disableDotRule: true,
        },
        hot: "only",
        liveReload: true,
        compress: true,
        port: Number(process.env.SERVER_PORT),
        host: process.env.SERVER_HOSTNAME,
      }
    : undefined,
  performance: isDev
    ? {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      }
    : {},
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
    alias: {
      "~": path.resolve(__dirname, "..", "src"),
    },
  },
};

export default webpackProdConfig;
