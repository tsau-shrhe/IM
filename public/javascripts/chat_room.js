$(function() {
    //連線socket
    var socket = io();
    //寫入暱稱
    var Nick = sessionStorage.Nick;
    socket.emit('member', { nickname: Nick });

    //寫入聊天內容
    $('form').submit(function() {
        if ($('#msg_input').val() != '') {
            socket.emit('send_msg', { msg: $('#msg_input').val() });
            $('#msg_input').val('');
            return false;
        } else {
            alert('請輸入文字訊息內容!!');
            return false;
        }
    });

    //顯示訊息
    socket.on('print_msg', function(msg) {
        $('#messages').append($('<li>').text(msg));
        window.scrollTo(0, document.body.scrollHeight);
    });

    //修改再線人數
    socket.on('online', function(data) {
        $('#count').text(data.count);
        // alert(data.num);
    });

    //直播自動播放
    var player = videojs('video');
    player.play();
});