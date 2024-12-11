document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交行为
 
    const message = document.getElementById('message').value;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_message.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 假设服务器返回了新留言的HTML片段
            const newMessageHtml = xhr.responseText;
            document.getElementById('messages').insertAdjacentHTML('beforeend', newMessageHtml);
            // 清空文本框
            document.getElementById('message').value = '';
        }
    };
    xhr.send('message=' + encodeURIComponent(message));
});
 
// 页面加载时从服务器获取所有留言并显示
window.onload = function() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'get_messages.php', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const messagesHtml = xhr.responseText;
            document.getElementById('messages').innerHTML = messagesHtml;
        }
    };
    xhr.send();
};