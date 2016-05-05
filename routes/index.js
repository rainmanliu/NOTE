var express = require('express');
var AV = require('avoscloud-sdk');
var router = express.Router();
AV.initialize('xaAtMndkHnzwBq2sxtsdnYsl-gzGzoHsz', 'nFF1TPrkPHUezUhGnWuB9reb');

/* GET home page. 
router.get('/', function(req, res, next) {
  var currentUser = AV.User.current();
  if(currentUser){
    AV.User.become(currentUser._sessionToken).then(function(users){
      console.log(users._serverData.username);
    res.render('index.ejs', { 
    title: '应该登录了吧',
    user: users._serverData.username,
    page: 'login'
  });
  })
  }else{
    res.render('index.ejs', { 
    title: 'hanyu',
    user: '',
    page: 'login'
  });
  }

  
});
*/

//注册界面
router.get('/reg', function(req, res, next) {
  res.render('register.ejs',{
    title:'注册',
    user: '',
    page: 'reg' 
  });
});
router.post('/reg',function(req,res){
    var user_name = req.body.username,
        pass_word = req.body.password,
        password_Repeat = req.body.passwordRepeat;
    if((user_name != '')&&(pass_word != '')){
        if(pass_word != password_Repeat){
            console.log('两次输入的密码不一致');
            return res.redirect('/reg');
        }
        
        var user = new AV.User();
        user.set('username', user_name);
        user.set('password', pass_word);
        //user.set('email', 'hang@leancloud.rocks');
        user.signUp().then(function(user){
          console.log('成功注册：'+user)
          return res.redirect('/login');
        },function (err) {
          console.log('Error: ' + err.code + ' ' + err.message)
          return res.redirect('/reg');
        })
    }else{
      return res.redirect('/reg');
    }
});

//登录界面
router.get('/login', function(req, res, next) {
  var currentUser = AV.User.current();
  if(currentUser){
    AV.User.become(currentUser._sessionToken).then(function(users){
      console.log(users._serverData.username);
      var name = users._serverData.username;
    res.render('login.ejs', { 
    title: '已经登录',
    user: name,
    page: 'login'
  });
  })
  }else{
    res.render('login.ejs', { 
    title: '登录',
    user: '',
    page: 'login'
  });
  }
});

router.post('/login', function (req,res) {
      var user_name = req.body.username,
          pass_word = req.body.password;
      if((user_name.length > 0)&&(pass_word.length > 0)){
          AV.User.logIn(user_name, pass_word).then(function() {
          return res.redirect('/');
        }, function(err) {
          // 失败了
          console.log('Error: ' + err.code + ' ' + err.message);
          return res.redirect('/reg');
        });
      }else{
        return res.redirect('/login');
      }
});

//退出界面
router.get('/quit', function(req, res){
  AV.User.logOut();
  var currentUser = AV.User.current(); 
  console.log('退出成功！');
  return res.redirect('/');
});

//发布界面
router.get('/post', function(req, res, next) {
  var currentUser = AV.User.current();
  if(currentUser){
      AV.User.become(currentUser._sessionToken).then(function(users){
          var name = users._serverData.username;
          console.log(name);
        res.render('post.ejs', { 
        title: '发布界面',
        user: name,
        page: 'post'
        });
      })
  }else{
    res.render('login.ejs', { 
        title: '登录界面',
        user: '',
        page: 'login'
        });
  }
});

router.post('/post', function (req,res) {
  var currentUser = AV.User.current();
  AV.User.become(currentUser._sessionToken).then(function(users){
    var name = users._serverData.username;
    var Note = AV.Object.extend('note');
    var note = new Note();
    note.set('title',req.body.title);
    note.set('author', name);
    note.set('tag',req.body.tag);
    note.set('content',req.body.content);
      
    note.save().then(function(note){
      console.log('New object created with objectId: ' + note.id);
      return res.redirect('/post');
      },function(err){
      console.log('文章发表失败！')
      return res.redirect('/post');
      })
  });
});
  
  


//笔记列表
router.get('/', function(req, res){
  var currentUser = AV.User.current();
  if(currentUser){
    AV.User.become(currentUser._sessionToken).then(function(users){
      var name = users._serverData.username;
      var note = new AV.Query('note');
      note.equalTo('author',name);
      note.find().then(function(art){
        console.log(art);
        res.render('index', {
                  title: '笔记列表',
                  user: req.name,
                  page: 'list',
                  arts: art,
                  moment: ''
              });
      },function(err){
        console.log('Error: ' + error.code + ' ' + error.message);
      }) 
    });
  }else{
    
      return res.redirect('/login');
  }
});

module.exports = router;
