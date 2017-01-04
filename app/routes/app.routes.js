var Yelp = require("yelp");
var User = require("../models/user.model");

var routes = (app, router) => {
    
    var performSearch = function(params, cb){
        
        var yelp = new Yelp({
            consumer_key: process.env.YELP_CONSUMER_KEY,
            consumer_secret: process.env.YELP_CONSUMER_SECRET,
            token: process.env.YELP_TOKEN,
            token_secret: process.env.YELP_TOKEN_SECRET
        });
        
        yelp.search(params)
        .then((data) => { 
            
            var business = [];
            
            business = data.businesses.map((b) => {
                return { id: b.id, name: b.name, image_url: b.image_url, review: '', assistants: 0 };
            });
            
            //get first review 
            var promises = data.businesses.map((b) => {
                return yelp.business(b.id).then((data) => {
                    var target = business.find((item) => { return item.id === b.id; });
                    if(target) {
                        //var idx = Math.floor(Math.random() * (b.review_count - 0));
                        //console.log(idx + " => " + data.reviews[idx].excerpt);
                        target.review = data.reviews[0].excerpt;
                    }
                    //count assistants
                    try{
                        User.count({ 'rsvps.business': target.id }, (err, count) => {
                            if(!err) target.assistants = count;    
                        });
                    }catch(err) { console.log(err); }
                    
                    return target;
                });
            });
            
            //Wait until all reviews are collected
            Promise.all(promises)
            .then((business) => {
                return cb(null, business);
            })
            .catch((err) => {
                return cb(err, null);
            });
        })
        .catch((err) => { return cb(err, null); });
    };
  
    /****************
     * 
     * GET Search bars from a given location
     * 
     ***************/
    router.get('/bars/search', (req, res) => {
        
        console.log(req.url);
        
        var params = { term: req.query.term }; 

        //get location or coordinates
        if(req.query.location){
            params.location = req.query.location;
        }else if(req.query.latitude && req.query.longitude){
            params.ll = req.query.longitude + ',' + req.query.latitude;
        }else{
            return res.status(500).json({
                title: 'An error occurred',
                error: { message: 'Invalid location' }
            });
        }
        
        performSearch(params, (err, business) => {
            if(err){
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            return res.status(200).json(business);
        });
    });
        
    /******************************
     * 
     * POST An assitence for a bar
     * 
     * ***************************/
    router.post('/bars/rsvp', (req, res) => {
       
       console.log(req.url);
       
       var body = req.body;
       
       User.findOne({ provider_id: body.user.provider_id }, (err, user) => {
           if(err) { 
               return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
           }
           
           if(!user){
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
                  
                  user = data;
                });
           }
           
           if(user){
               var rsvps = user.rsvps.find((item) => { return item.business === body.bar.id });
               if(rsvps){
                   //If user had rsvps, now doesn't
                   var idx = user.rsvps.indexOf(rsvps, 0);
                   user.rsvps.splice(idx, 1);
                   console.log("not going");
               }
               else{
                   //User will go
                   user.rsvps.push({ business: body.bar.id, date: new Date() });
                   console.log("going");
               }
               
               user.save((err, savedUser) => {
                   if(err) { 
                       return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        });
                   }
                   
                   //Return the updated list of bars
                   performSearch({ term: body.term, location: body.location }, (err, business) => {
                        if(err){
                            return res.status(500).json({
                                title: 'An error occurred',
                                error: err
                            });
                        }
                        
                        business
                        
                        return res.status(200).json(business);
                    });
               });
           }
           
       });
    });
    
};


module.exports = routes;