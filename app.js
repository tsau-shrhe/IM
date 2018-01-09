var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/**
 * 路由設置
 */

// var index = require('./routes/index');
// var users = require('./routes/users');
var chat_server = require('./routes/chat_server');
var member = require('./routes/member_r');

// mysql
var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "test"
});

con.connect(function(err) {
    if (err) {
        console.log('資料庫連線失敗');
        return;
    }
    console.log('資料庫連線成功');
});


var app = express();


/**
 * Socket.io設置
 */
var socket_io = require("socket.io");
var io = socket_io();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'chat.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// db state
app.use(function(req, res, next) {
    req.con = con;
    next();
});

// app.use('/', index); 預設
// app.use('/users', users); 預設
app.use('/', chat_server);
app.use('/member', member);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error',{title:"Ooops!!"});
});

/**
 * 聊天室
 */

//定義會員
var member = new Object();

// socket.io 事件
io.on("connection", function(socket) {

    //定義時間
    var d = new Date();
    var now_time = "【" + d.toLocaleString() + "】";

    //抓取使用者暱稱連線歡迎詞
    socket.on('member', function(info) {
        member[socket.id] = info.nickname;
        io.emit('print_msg', now_time + member[socket.id] + ' 進入聊天室囉!!');
        io.emit('online', { "count": Object.keys(member).length });
    });

    //推送聊天訊息
    socket.on('send_msg', function(data) {
        io.emit('print_msg', now_time + member[socket.id] + ': ' + data.msg);
    });

    //斷開連線
    socket.on('disconnect', function() {
        io.emit('print_msg', now_time + member[socket.id] + ' 離開聊天室囉!!');
        delete member[socket.id]; //清除會員陣列
        io.emit('online', { "count": Object.keys(member).length });
    });
});

module.exports = app;