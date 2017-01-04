var authRoutes = require("./routes/auth.routes"),
    appRoutes = require("./routes/app.routes");


var routes = (app, router, passport) =>{
    
    //### Middelwares
    
    // For secure routes
    var auth = (req, res, next) => {
        if(!req.isAuthenticated()){
            res.send(401);
        }else{
            next();
        }
    };
    
    // For admin privileges
    var admin = (req, res, next) => {
        if(!req.isAuthenticated() || req.user.role !== 'admin'){
            res.send(401);
        }else{
            next();
        }
    };
    
    //### Server Routes
    
    //Login, logout, Signup routes
    authRoutes(app, routes, passport, auth, admin);
    
    //Application routes
    appRoutes(app, router);
    
    //Register all routes (no prefix)
    app.use('/', router);
    
    //Default angular index.html
    app.get('*', (req, res) => {
       return res.render('index', { title: process.env.MY_APP_NAME, layout: 'layout' });
    });
};

module.exports = routes;