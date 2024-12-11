<?php
$messagesFile = 'messages.txt';
$messages = file_exists($messagesFile) ? file($messagesFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
 
$messagesHtml = '';
foreach ($messages as $message) {
    // 移除时间戳（如果保留时间戳，则不需要这一步）
    // $message = preg_replace('/^\[.*?\] /', '', $message);
    $messagesHtml .= "<div class='message'>" . htmlspecialchars($message) . "</div>";
}
 
echo $messagesHtml;
?>