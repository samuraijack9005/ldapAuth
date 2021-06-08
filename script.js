

var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
 var LdapStrategy = require('passport-ldapauth').Strategy;
//passport.use(new LdapStrategy(OPTS));

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(passport.initialize());
//console.log(JSON.stringify(passport.authenticate('ldapauth', {session: false})))

var LdapAuth = require('ldapauth-fork');
let CustomStratergy=require('passport-custom').Strategy;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


/*app.post('/login', function(req, res, next) {
	let data=req.body;
  console.log(data)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var options = {
  url: 'ldap://localhost',
  bindDn:'cn=admin,dc=users,dc=com',
  bindCredentials:'demo1234',
    searchBase: 'dc=users,dc=com',
  searchFilter: 'mail='+data.mail'',
  reconnect: true
};
var auth = new LdapAuth(options);
//console.log(auth)
auth.on('error', function (err) {
  console.error('LdapAuth: ', err);
});
auth.authenticate(data.mail,data.password, function(err, user) { 
console.log(err,user)
if(err){
	res.send(err);
} else {
	auth.close(function(err) {  })
	res.send(user)
}



 });
})*/

app.use(passport.initialize())
app.use(passport.session());
passport.use('ldapauth',new CustomStratergy(
  function(req,callback){
    console.log(req.body)
    var options = {
      url: 'ldap://localhost',
      bindDn:'cn=admin,dc=users,dc=com',
      bindCredentials:'demo1234',
      searchBase: 'dc=users,dc=com',
      searchFilter: 'mail='+req.body.mail,
      reconnect: true
    };

    let auth = new LdapAuth(options);
    auth.on('error', function (err) {
      console.error('LdapAuth: ', err);
    });
    auth.authenticate(req.body.mail,req.body.password, function(err, user) { 
      console.log(err,user)
      if(err){
        return callback(null, false, 'bad password')
      } else {
        auth.close(function(err) { })
        return callback(null,user);

/*        passport.serializeUser(function(user, callback) {
          console.log('serializeUser')
          return callback(null, user);
        });
        passport.deserializeUser(function(user, callback) {
          console.log('d-serializeUser')
        return callback(null, user);
      });*/
      }
    });
  }

  ))
app.get('/fail',function(req,res){
  res.send('failed auth!!!')
})
app.get('/success',function(req,res){
  res.send('success auth!!!')
})
  app.post('/login',
  passport.authenticate('ldapauth', { failureRedirect: '/fail',session: false,failWithError:true }),
  function(req, res) {
    res.redirect('/success');
  }
);


var server = app.listen(8080, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("app is listening at http://localhost:%s", port)
})