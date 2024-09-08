//import express module
const express = require('express')
const cookieParser = require('cookie-parser');
const session = require('express-session');

//init variable
const PORT = 3000;

// import middleware
const path = require("path");
const bodyParser = require("body-parser");
const bootstrap = require("./src/bootstrap");

// app start
const app = express();

// set up session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60 * 60 * 1000}
  }))
  
//setup ejs
app.set('view engine', 'ejs');
app.set('views', path.resolve('./src/views'));

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());

const router = express.Router();
app.use(router);

bootstrap(app,router);

// use routes

router.use((err, req, res, next)=>{
    if(err){
        //
        return res.send(err.message);
    }
})

// final app
app.listen(PORT, (err)=>{
    if(err) return console.log("connot start server ...")
    console.log("server launch");
})