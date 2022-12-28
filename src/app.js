require("dotenv").config();
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const app = express();
const fs = require("fs");
const http = require('http');
const https = require('https');
const MongoClient = require("mongodb").MongoClient;
const body_parser = require('body-parser');
const session = require("express-session");
const abs_path = path.join(__dirname, "../public");
// const url = "mongodb://localhost:27017/";
const DB_PASS = process.env.DATABASE_PASSWORD;
const DB_NAME = process.env.DATABASE_NAME;
const url = `mongodb+srv://akashKumarMongoDb:${DB_PASS}@cluster0.jmngmem.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
console.log(abs_path);
app.use(express.static(abs_path));
let routes = require("../public/controllers") ;
let msg = "";
const PORT = process.env.PORT || 3009
app.set(body_parser.urlencoded({
    extended:true
}))

app.use(session({
    secret: "Newsify",
    saveUninitialized: true,
    cookie: {maxAge: 86400000},
    resave: false
}))
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "../partials"));

    // 123c52639f17444db03dc3dbd2a13000
    // f4242a90704d4894b73ec0dd52c7ea19
    // 011e3cd81e7a44239e332ef9b3c83506

app.use("/", routes);
app.use("/register", (req, res) => {
   if(req.body.username === "" || req.body.password ===""){
    req.session.err_success = "Please Provide some information!";
    res.redirect("/registration");
   }else{
    if(req.body.password === req.body.re_password){
        MongoClient.connect(url, (err, client) => {
            if(err){
                console.log("Server is not Connected!");
            }else{
                let dbo = client.db("Newsify");
                dbo.collection("users").findOne({username_email: req.body.username}, (err, result) => {
                    if(err){
                        console.log("Some error found");
                    }else{
                        if(result === null){
                            dbo.collection("users").insertOne({
                                username_email: req.body.username,
                                password: req.body.password,
                                confirm_password: req.body.re_password
                            }, (err, resp) => {
                                if(err){
                                    req.session.err_success = "User is not registered, try again!";
                                    res.redirect("/registration");
                                }else{
                                    req.session.err_success = "User successfully created, Please login now!";
                                    res.redirect("/login");
                                }
                            })
                        }else{
                            req.session.err_success = "User is already exist to our database!";
                        res.redirect("/login");
                    }
                }
            })
        }
    })
    }else{
        req.session.err_success = "Password and Confirm password not matched";
        res.redirect("/registration");
    }
   }
});

app.use("/logged", (req, res) => {
    if(req.body.username === "" && req.body.password ===""){
        req.session.err_success = "Please Provide some information!";
        res.redirect("/login");
    }else{
        let user_name = req.body.username;
        MongoClient.connect(url, (err, client) => {
            if(err){
                console.log("Server is not connected");
            }else{
                let dbo = client.db("Newsify");
                dbo.collection("users").findOne({username_email: user_name}, (err, result) => {
                    if(err){
                        req.session.err_success = "Some internal error found please try after some time!";
                        res.redirect("/login");
                    }else{
                        if(result){
                            if(req.body.password === result.password){
                                req.session.loggedIn = result.username_email;
                                res.redirect("/");
                            }else{
                                req.session.err_success = "Invalid credentials!";
                                res.redirect("/login");
                            }
                        }else{
                            req.session.err_success = "User is not found in our database!";
                            res.redirect("/registration");
                        }
                    }
                });
            }
        })
    }
});

app.use("/logout", (req, res) => {
    delete req.session.loggedIn;
    res.redirect("/");
})
app.listen(PORT, '0.0.0.0', ()=> {
    console.log("Server is " + PORT);
});

// https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=011e3cd81e7a44239e332ef9b3c83506