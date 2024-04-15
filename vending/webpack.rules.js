module.exports = [
  // ... existing loader config ...
  {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react']
        }
      }
  },
  {
    test: /\.png$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'img/', // 이미지를 저장할 폴더 경로 지정
        },
      },
    ],
  }
];