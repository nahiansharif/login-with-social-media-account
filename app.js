// Import necessary packages and modules

import express from "express";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import expressSession from "express-session";
import bodyParser from "body-parser";

// Create an instance of Express app
const app = express();
app.use(bodyParser.urlencoded({extended: true})); 

// Retrieve the client ID and secret from Facebook Developer Console
const FACEBOOK_CLIENT_ID = '172149585519576';
const FACEBOOK_CLIENT_SECRET = 'd9a1529de2897d2bccec13316adde8a5'; 

// Configure Passport to use the Facebook strategy for authentication
    passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL:'/facebook', 
    profileFields: ['emails', 'displayName', 'name', 'picture']}, 
   
    (accessToken, refreshToken, profile, callback)=>{
 // Passport authentication callback function
        callback(null, profile)
    }))

// Configure Passport to serialize and deserialize the user object
    passport.serializeUser((user, callback)=>{
        callback(null, user); 
    })

    passport.deserializeUser((user, callback)=>{
        callback(null, user); 
    })
// Configure Express to use express-session middleware
    app.use(expressSession({
        secret: 'd9a1529de2897d2bccec13316adde8a5',
        resave: true,
        saveUninitialized: true
    }));
    

// Initialize Passport and use it for session management
    app.use(passport.initialize());
    app.use(passport.session()); 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//routes
// Define the login route that redirects to Facebook for authentication
app.get("/login/facebook", passport.authenticate("facebook", { scope: ["email"] }));


// Define the callback route for Facebook authentication
app.get("/facebook", passport.authenticate('facebook'),(req, res)=>{

    const userName = req.user.displayName;
    res.render("fbs", { userName }); 
})




// Set the view engine to EJS
app.set("view engine", "ejs"); 

// Define the home route
app.get("/", (req, res) => {
    
    res.render("home"); 

});

// Define the route for submitting the home form
app.post("/home", (req, res) => {
    res.redirect("login/facebook"); 
})

// Define the route for logging out
app.post("/facebook", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

app.listen(3000)
