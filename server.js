require('dotenv').config(); // 用于加载 .env 文件中的环境变量
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser'); // 用于解析请求体
const app = express();
const port = 3000;
 
const GITHUB_OWNER = 'Greysky1984';
const GITHUB_REPO = 'myskyhome';
const GITHUB_BRANCH = 'main';
const GITHUB_FILE_PATH = 'MS.js';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
 
if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN is not set in .env file');
  process.exit(1);
}
 
const githubHeaders = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
};
 
const githubApiUrl = (path) => `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
 
app.use(bodyParser.json()); // 解析 JSON 请求体
 
// 辅助函数：将 JavaScript 对象数组格式化为 MS.js 文件内容
const formatMsJsContent = (messages) => {
  const content = `const messages = ${JSON.stringify(messages, null, 2)};\nmodule.exports = messages;`;
  return Buffer.from(content).toString('base64');
};
 
// 获取留言
app.get('/api/messages', async (req, res) => {
  try {
    const response = await axios.get(githubApiUrl(GITHUB_FILE_PATH), { headers: githubHeaders });
    const content = Buffer.from(response.data.content, 'base64').toString();
    // 由于我们存储的是 JS 对象，需要稍微处理一下以提取 messages 数组
    const match = content.match(/const messages = ([\s\S]*?);\n/);
    const messages = JSON.parse(match ? match[1] : '[]');
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});
 
// 提交留言
app.post('/api/messages', async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: '留言内容不能为空，且必须是字符串！' });
  }
 
  try {
    let response = await axios.get(githubApiUrl(GITHUB_FILE_PATH), { headers: githubHeaders });
    let existingMessages = [];
    if (response.data.content) {
      const content = Buffer.from(response.data.content, 'base64').toString();
      // 提取 messages 数组，如果文件不存在或格式不正确，则默认为空数组
      const match = content.match(/const messages = ([\s\S]*?);\n/);
      existingMessages = match ? JSON.parse(match[1]) : [];
    }
 
    // 添加新留言到数组
    existingMessages.push({ text: message, timestamp: new Date().toISOString() }); // 可以添加其他属性，如时间戳
 
    // 格式化 MS.js 文件内容
    const newContent = formatMsJsContent(existingMessages);
 
    // 更新 GitHub 上的 MS.js 文件
    response = await axios.put(
      githubApiUrl(GITHUB_FILE_PATH),
      {
        message: 'Update MS.js with new message',
        content: newContent,
        sha: response.data.sha,
        branch: GITHUB_BRANCH
      },
      { headers: { ...githubHeaders, 'Content-Type': 'application/json' } }
    );
 
    res.json({ message: '留言已提交！' });
  } catch (error) {
    console.error('Error submitting message:', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});
 
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});