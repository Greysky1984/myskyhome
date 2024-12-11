const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
 
// 设置静态文件目录（假设你的HTML/CSS/JS文件放在public文件夹中）
app.use(express.static(path.join(__dirname, 'MyWeb2024')));
 
let likeCount = 0;
 
// 读取点赞数（从文件或内存中）
fs.readFile('likeCount.txt', 'utf8', (err, data) => {
  if (err) {
    if (err.code === 'ENOENT') {
      // 文件不存在，初始化点赞数为0
      likeCount = 0;
      fs.writeFileSync('likeCount.txt', '0');
    } else {
      // 其他错误
      console.error(err);
    }
  } else {
    // 文件存在，读取点赞数
    likeCount = parseInt(data, 10);
  }
});
 
// 处理点赞请求
app.get('/like', (req, res) => {
  likeCount++;
  fs.writeFileSync('likeCount.txt', likeCount.toString());
  res.send(likeCount.toString());
});
 
// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});