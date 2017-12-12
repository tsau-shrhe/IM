var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

//定義會員
var member = new Object();

//抓首頁
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

//連線動作
io.on('connection', function(socket) {

    //抓取使用者暱稱連線歡迎詞
    socket.on('member', function(info) {
        member["nikename"] = info.nickname;
        io.emit('print_msg', member["nikename"] + ' 進入聊天室囉!!');
    });

    //推送聊天訊息
    socket.on('send_msg', function(data) {
        io.emit('print_msg', member["nikename"] + ': ' + data.msg);
    });

    //斷開連線
    socket.on('disconnect', function() {
        io.emit('print_msg', member["nikename"] + ' 離開聊天室囉!!');
    });

});

//監聽3000 port
http.listen(port, function() {
    console.log('listening on *:' + port);
});