module.exports = function (app) {
    var passport = require('passport');
    var facebook_config = require('./auth-config.json');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password();
    var db = require('./db')();

    app.use(passport.initialize());
    app.use(passport.session());


    /*
    처음에는 LocalStrategy 호출하고
    done(null, user)가 실행될때 콜백 함수

    done(null, user정보)를 호출 -->
    session에 저장 -->
    deserializeUer() 호출

    세션 저장 이후부터는 deserializeUer()만 호출
 */

    passport.use(new LocalStrategy(
        function (username, password, done) {
            var uname = username;
            var pwd = password;
            var sql = 'SELECT * FROM user WHERE authId=:authId';
            db.query(sql, {params:{authId:'local:'+uname}}).then(function (result) {
                if(result.length === 0) {
                    return done(null, false);
                }
                var user = result[0];
                return hasher({password:pwd, salt:user.salt}, function (err, pass, salt, hash) {
                    if (hash === user.password) {
                        console.log("LocalStrategy", user);
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            });
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: facebook_config.facebook_clientID,
            clientSecret: facebook_config.facebook_clientSecret,
            callbackURL: "/auth/facebook/callback",
            profileFields:['id', 'email', 'gender', 'link', 'locale',
                'name', 'timezone', 'updated_time', 'verified', 'displayName']
        },
        function(accessToken, refreshToken, profile, done) {
            //  profile에 사용자 id 값이 넘어옴
            console.log(profile);

            var authId = 'facebook:'+profile.id;
            var sql = 'SELECT FROM user WHERE authId=:authId';
            db.query(sql, {params:{authId:authId}}).then(function (results) {
                if(results.length === 0) {
                    var newuser = {
                        'authId'        : authId,
                        'displayName'   : profile.displayName,
                        'email'         : profile.emails[0].value
                    };
                    var sql = 'INSERT INTO user (authId, displayName, email) VALUES(:authId, :displayName, :email)';
                    db.query(sql, {params: newuser}).then(function () {
                        done(null, results[0]);
                    }, function (error) {
                        console.log(error);
                        done('Error');
                    });
                }else {
                    return done(null, results[0]);
                }
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        // console.log("serializeUser", user);
        done(null, user.authId);
    });

//session에 저장되서 한번 로그인 후에는 이 함수를 호출
    passport.deserializeUser(function(id, done) {
        // console.log("deserializeUser", id);
        var sql = "SELECT FROM user WHERE authId=:authId";
        db.query(sql, {params:{authId:id}}).then(function (results) {
            if(results.length === 0) {
                done('There is no user.');
            }else {
                return done(null, results[0])
            }
        });
    });

    return passport;
};