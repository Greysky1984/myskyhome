<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['message'])) {
    $message = htmlspecialchars(strip_tags($_POST['message'])); // 防止XSS攻击和HTML注入
    $messagesFile = 'messages.txt';
 
    // 读取现有留言
    $existingMessages = file_exists($messagesFile) ? file_get_contents($messagesFile) : '';
    // 添加新留言（带时间戳）
    $newMessage = date('[Y-m-d H:i:s] ') . $message . "\n";
    // 将新留言追加到文件
    file_put_contents($messagesFile, $existingMessages . $newMessage, LOCK_EX);
 
    // 返回新留言的HTML片段（这里简单返回文本，实际应用中可能需要更多处理）
    echo "<div class='message'>" . htmlspecialchars($message) . "</div>";
}
?>