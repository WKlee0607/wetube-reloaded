const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
    entry: {
        main: "./src/client/js/main.js",
        videoPlayer : "./src/client/js/videoPlayer.js",
        recorder : "./src/client/js/recorder.js",
    },
    mode: "development",
    watch: true,//수정 사항이 있고 저장할 때마다 이를 반영해줌. -> 이 때문에 콘솔창을 2개 돌려야함.dev:server와 dev:assets. 이 둘은 동시에 실행되어야함.
    plugins: [new MiniCssExtractPlugin({
        filename:"css/styles.css"
    })],
    output: {
        filename:"js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    module :{
        rules:[//entry파일 내에 js파일 혹은 css파일 등을 어떤 loader로 처리할 지 지정해주는 곳
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets:[
                            ["@babel/preset-env", {targets: "defaults"}]
                        ]
                    }
                }
            },
            {
                test: /\.scss$/,
                use:[MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
        ],
    },
};