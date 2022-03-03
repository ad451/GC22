const express = require('express')
const port = process.env.PORT || 5000;
const path = require('path');
const mongoose=require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const passport=require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userschema=new mongoose.Schema({
    name:{
        type:String,
        default:'abc'
    },
    email:{
        type:String,
        default:'abc@gmail.com'

    }

    
})
const User =mongoose.model('collectionname',userschema);

const DB="mongodb+srv://amrit:Xt1htrp8xUYNXo3X@cluster0.nysrz.mongodb.net/amrit?retryWrites=true&w=majority";
MongoClient.connect(DB
,{
  useUnifiedTopology: true
}).then(client => {
    console.log('Connected to Database');
    let db = client.db('db')
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: 'SECRET'
      }));
    app.use(passport.initialize());
    const GOOGLE_CLIENT_ID = "764300361135-2eo2vq79qdes3vbh86m2cruipvq2npu7.apps.googleusercontent.com";
    const GOOGLE_CLIENT_SECRET = "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";
    
    passport.use(new GoogleStrategy({
      clientID:GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    function(request, accessToken, refreshToken, profile, done) {
      const username = profile.displayName;
      const useremail = profile.emails[0].value;
      var update = { $set : {} };
      app.post("/Webathon", async (req, res) => {
        const name = username;
        if(!name){
            return res.status(422).render('error.ejs');
        }
        const up=await db.collection('collectionname').findOne({name:username});
        console.log(up);
        if(up){
            update.$set["webathon"]=1;
            db.collection('collectionname').findOneAndUpdate(
                { "name" : username },
                update)
        }       
        res.status(200);
        res.render('RegistrationForm.ejs', {eventList });  
         
    });
    app.post("/Marathon", async (req, res) => {
        const name = username;
        if(!name){
            return res.status(422).render('error.ejs');
        }
        const up=await db.collection('collectionname').findOne({name:username});
        console.log(up);
        if(up){
            update.$set["Marathon"]=1;
            db.collection('collectionname').findOneAndUpdate(
                { "name" : username },
                update)
        }       
        res.status(200);
        res.render('RegistrationForm.ejs', {eventList });   
    });
      db.collection('collectionname').findOne({ name : username } , function(err, user) {
        if (err){
            return done(err);
        }
        else if(user){
            console.log(user);
        }
        else{
            db.collection('collectionname').insertOne({
                "name":username,
                "email":useremail,
                
                
    
              })
        }
      return done(null, profile);
    })
    }));
    
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    
    passport.deserializeUser(function(user, done) {
      done(null, user);
    });
 

});



const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static('public'))
//authentication


const eventList = [
    "Webathon",
    "Poster",
    "Marathon",
    "Dualthon",
    "Singing",
    "Football",
    "Hackathon",
    "Cricket",
    "Tennis",
];

app.get("/", (req, res) => {
      res.render('index.ejs');
    
})
app.get('/lbd', (req, res) => {
    res.render('lbd.ejs');
  
})
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email',],
    accessType: 'offline', prompt:'consent' })
  );
app.get('/auth/google/callback',
passport.authenticate('google', {
    failureRedirect: '/auth/google'
}) ,
  (req, res) => {
      console.log("login done");
      res.redirect('/RegistrationForm');
  }
);
app.get("/RegistrationForm",(req,res)=>{
    res.render('RegistrationForm.ejs',{eventList});
})
app.get("/logout", (req, res) => {
    res.render('index.ejs');
    req.session.destroy();
  
})
app.get("/register", (req, res) => {
    res.render("RegistrationForm.ejs", {eventList });
});
app.get("/profile", (req, res) => {
    res.render("ProfilePage", { title: "Profile", eventList });
});

app.listen(port, () => {
    console.log(`server started at https://localhost:${port}`)
})