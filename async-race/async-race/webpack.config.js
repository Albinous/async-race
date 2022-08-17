const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

const devServer = (isDev) =>
    !isDev
        ? {}
        : {
              devServer: {
                  open: true,
                  hot: true,
                  port: 8001,
                  compress: true,
                  contentBase: path.join(__dirname, "public")
              }
          };

const esLintPlugin = (isDev) => (isDev ? [] : [new ESLintWebpackPlugin({ extensions: ["js", "ts"] })]);

module.exports = ({ develop }) => ({
    mode: develop ? "development" : "production",
    devtool: develop ? "inline-source-map" : false,
    entry: {
        main: "./src/index.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        assetModuleFilename: "assets/[hash][ext]"
    },

    module: {
        rules: [
            {
                test: /\.[tj]s$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
                type: "asset/resource"
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/i,
                type: "asset/resource"
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    },

    resolve: {
        extensions: [".ts", ".js", ".scss"]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        // new CopyWebpackPlugin({
        //   patterns: [
        //     { from: './public' }
        //   ]
        // }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        }),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        ...esLintPlugin(develop)
    ],
    ...devServer(develop)
});
