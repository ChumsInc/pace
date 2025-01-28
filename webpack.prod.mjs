import {merge} from 'webpack-merge';
import common from './webpack.common.mjs';
import {WebpackManifestPlugin} from 'webpack-manifest-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

export default merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: true,
    },
    output: {
        clean: true,
        filename: "[name].[contenthash:8].js",
    },
    plugins: [
        new WebpackManifestPlugin({}),
        new BundleAnalyzerPlugin(),
    ]
});
