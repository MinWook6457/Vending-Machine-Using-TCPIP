// require('dotenv').config()

const express = require("express");
const cors = require("cors");
const http = require('http')

// 라우터 설정
// const openaiRouter = require('./api/openai/route.openai')
const port = 8081;

const app = express();
app.use(express.json());
app.use(cors());

const { sequelize } = require('./models/index');

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

// 라우팅
// app.use("/openai", openaiRouter)


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});