const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    // mode: "production",
    entry: { app: "./src/index.js" },
    output: {
        // publicPath: where Webpack serves its ‘Virtual files
        path: "/",
        filename: "[name].[hash].js",
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            "react": "preact-compat",
            "react-dom": "preact-compat"
        },
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, loader: "babel-loader", include: /src/, exclude: /node_modules/, options: {
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                },
            },
            { test: /\.svg$/, use: [{ loader: "babel-loader" }, { loader: "svg-url-loader", options: { jsx: true } }] },
            // { test: /\.html$/, use: [{ loader: "html-loader", options: { minimize: true } }] },
            {
                // "url" loader works like "file" loader except that it embeds assets
                // smaller than specified limit in bytes as data URLs to avoid requests.
                // A missing `test` is equivalent to a match.
                test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
                use: [{
                    loader: "url-loader", options: {
                        limit: 100000,
                        name: "[name].[ext]",
                    },
                }],
            },
            {
                test: /\.(s?css)$/,
                use: ExtractTextPlugin.extract({
                    use: [{ loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } }],
                    fallback: 'style-loader'
                })
            },

        ]
    },
    devServer: {
        historyApiFallback: true, // make back/forward buttons in browser work
        // contentBase: "./dist", // this was causing the images to not load
        hot: true,
    },
    //devtool: "cheap-module-source-map",

    plugins: [
        // ExtractTextPlugin needs to be added in two spots: in the Loader, and as a Plugin, xtract text from a bundle, or bundles, into a separate file.
        new ExtractTextPlugin({ filename: "[name].[hash].css", disable: true }),
        //new BundleAnalyzerPlugin(),
        new HtmlWebPackPlugin({
            template: "./src/public/index.html",
            favicon: "./src/public/favicon.ico", // TODO: CHECK THIS WORKS
            filename: "index.html",
            inject: "body"
        }),
        // new CleanWebpackPlugin(["dist"]),
        // Add module names to factory functions so they appear in browser profiler.
        new webpack.NamedModulesPlugin(),
        // This is necessary to emit hot updates (currently CSS only):
        new webpack.HotModuleReplacementPlugin(),
        // ProvidePlugin like globals, saves having to import/require everywhere
        new webpack.ProvidePlugin({
            // identifier: module
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Popper: ["popper.js", "default"],
        }),
    ]
    ,
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
};