import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = path.resolve();

export default {
    entry: './dev_src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: './dev_src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ],
};