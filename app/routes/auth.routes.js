var User = require("../models/user.model");

var routes = (app, router, passport, auth, admin) => {
  
  app.post('/login', (req, res, next) => {
    
    var body = req.body;
    
    User.findOne({ provider: body.user.provider, provider_id: body.user.provider_id }, (err, user) => {
      if(err){
        console.log(err);
        return res.status(500);
      }
      
      if(!user){
        
        console.log("New User => " + JSON.stringify(body));
        
        var newUser = new User({
          name        : body.user.name,
          provider    : body.user.provider,
          provider_id : body.user.provider_id,
          photo       : body.user.photo,
          rsvps       : []
        });
        
        newUser.save((err, data) => {
          if(err) { 
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
          }
          
          return res.status(200).json(data);
        });
      }
    });
  });
    
};


module.exports = routes