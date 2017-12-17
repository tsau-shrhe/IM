var express = require('express');
var router = express.Router();

//首頁
router.get('/', function(req, res, next) {
    //轉址至聊天室輸入暱稱頁
    res.redirect('chat/signin');
});

//暱稱登入頁
router.get('/chat/signin', function(req, res, next) {
    res.render('singin', { title: "聊天室登入頁" });
});

//聊天室
router.post('/chat/room', function(req, res, next) {
    res.render('chat_room', { title: "聊天室" });
});

module.exports = router;