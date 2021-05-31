var passport = require('passport');
var LdapStrategy = require('passport-ldapauth').Strategy;

var OPTS = {
  server: {
    url: '<ldap server>',
    bindDn: '<admin username>',
    bindCredentials: '<admin password>',
    searchBase: '<base dn>',
    searchFilter: '(sAMAccountName={{username}})'
  }
};

passport.use(new LdapStrategy(OPTS));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
