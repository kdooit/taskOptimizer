import HtmlWebpackPlugin from 'html-webpack-plugin';
import DefinePlugin from 'webpack';
import path from 'path';

module.exports = {
    // 개발 모드로 설정
    mode: 'development',
    // 소스 맵을 생성하여, 디버깅 시 실제 코드 위치를 찾을 수 있도록 함
    devtool: 'eval-source-map',
    // 애플리케이션 진입점 설정
    entry: './src/index.js',
    // 빌드 결과물에 대한 설정
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    // 개발 서버 설정
    devServer: {
        static: './dist',
        hot: true,
        open: true,
        port: 3000,
    },
    resolve: {
        modules: [__dirname, "node_modules"],
        fallback: {
            "zlib": require.resolve("browserify-zlib"),
            "querystring": require.resolve("querystring-es3"),
            "path": require.resolve("path-browserify"),
            "buffer": require.resolve("buffer/"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "vm": require.resolve("vm-browserify"),
            "timers": require.resolve("timers-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "net": require.resolve("net-browserify"),
            "tls": require.resolve("tls-browserify"),
            "fs": false,
            "util": require.resolve("util"),
            "url": require.resolve("url/")
        },
        extensions: ['.ts', '.js']
    },
    // 모듈 처리 방법 정의
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: { loader: 'source-map-loader' }
            },
        ],
    },
    // 플러그인 설정
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        // 추가 플러그인은 여기에 구성
    ],
};