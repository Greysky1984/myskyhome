<?php
// 定义存储点赞数的文本文件路径
$likeFilePath = 'like_count.txt';
 
// 检查文件是否存在，如果不存在则创建并初始化为0
if (!file_exists($likeFilePath)) {
    file_put_contents($likeFilePath, '0');
}
 
// 读取当前的点赞数
$likeCount = (int)file_get_contents($likeFilePath);
 
// 增加点赞数
$likeCount++;
 
// 将新的点赞数写回文件
file_put_contents($likeFilePath, (string)$likeCount);
 
// 返回新的点赞数
echo $likeCount;
?>