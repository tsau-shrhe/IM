var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

//定義會員
var member = new Object();

//首頁輸入暱稱
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/singin.html');
});

//首頁輸入暱稱
app.post('/chat', function(req, res) {
    res.sendFile(__dirname + '/chat.html');
});

//連線動作
io.on('connection', function(socket) {

    //抓取使用者暱稱連線歡迎詞
    socket.on('member', function(info) {
        member[socket.id] = info.nickname;
        io.emit('print_msg', member[socket.id] + ' 進入聊天室囉!!');
        io.emit('online', { "count": Object.keys(member).length });
    });

    //推送聊天訊息
    socket.on('send_msg', function(data) {
        io.emit('print_msg', member[socket.id] + ': ' + data.msg);
    });

    //斷開連線
    socket.on('disconnect', function() {
        io.emit('print_msg', member[socket.id] + ' 離開聊天室囉!!');
        delete member[socket.id]; //清除會員陣列
        io.emit('online', { "count": Object.keys(member).length });
    });

});

//監聽3000 port
http.listen(port, function() {
    console.log('listening on *:' + port);
});