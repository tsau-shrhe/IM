var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* 查詢頁面 */
router.get('/query', function(req, res, next) {
    var db = req.con;
    var data = "";

    db.query('SELECT * FROM `member`', function(err, rows) {
        if (err) {
            console.log(err);
        }
        var data = rows;

        res.render('member_query_v', { title: '資料庫查詢', data: data });
    });
});

/* 新增會員頁面 */
router.get('/add', function(req, res, next) {
    res.render('member_add_v', { title: '新增會員資料' });
});

/* 新增會員 */
router.post('/add_member', function(req, res, next) {
    var db = req.con;

    // 定義查詢最後會員ID功能
    function last_member_id(callback) {
        db.query('SELECT id FROM `member` ORDER BY id DESC LIMIT 1', function(err, result) {
            if (err)
                callback(err, null);
            else
                callback(null, result[0].id);
        });
    }

    // 定義寫入會員功能
    function add_member(last_id) {
        var sql = {
            id: last_id + 1,
            name: req.body.name,
            gender: req.body.gender
        };
        db.query('INSERT INTO `member` SET ?', sql, function(err, rows) {
            if (err) {
                // 錯誤代碼
                console.log(err);
            }
            res.setHeader('Content-Type', 'application/json');
            res.redirect('/member/query');
        });
    }

    // 執行查詢會員最後ID
    last_member_id(function(err, data) {
        if (err) {
            // 錯誤代碼
            console.log(err);
        } else {
            // 執行加入會員資料
            add_member(data);
        }

    });
});

module.exports = router;