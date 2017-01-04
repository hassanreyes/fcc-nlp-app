var User = require("./app/models/user.model");
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = (app, passport, mongoose) => {
    
    passport.serializeUser((user, done) => {
        console.log("serialize: " + user);
        done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
        console.log("serialize: " + user.user);
        done(null, user);
        //  User.findOne({ "provider_id": user.id}, (err, user) => {
        //      console.log("deserialize, user: " + user);
        //      done(err, user);
        //  });
    });
    
    //Passport authentication with Twitter
    passport.use(new TwitterStrategy({
        consumerKey:    process.env.TWITTER_API_KEY,
        consumerSecret: process.env.TWITTER_API_SECRET,
        callbackURL:    '/auth/twitter/callback'
    }, (accessToken, refreshToken, profile, done) => {
        console.log("looking for user...");
        //Find user
        return User.findOne({provider_id: profile.id}, (err, user) => {
            //If error, just return error
            if(err) return done(err);
            
            //If user found, return the user
            if(user){
                console.log("user found: " + user);
                return done(null, user);
            }else{
                console.log("new user...");
                
                //otherwise create a new user
                var newUser = new User();
                
                newUser.provider_id = profile.id;
                newUser.provider    = profile.provider;
                newUser.name        = profile.displayName;
                newUser.photo       = profile.photos;
                
                //Save new user and return it
                newUser.save((err, data) => {
                   if(err) return done(err);
                   
                   return done(null, data);
                });
            }
            return done(err, user);
        });
    }));
};