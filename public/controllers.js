const express = require("express");
const rout = express.Router();
const https = require('https');
const axios = require('axios');
const body_parser = require('body-parser');

rout.use(body_parser.urlencoded({
    extended:true
}))

// rout.get('/',async(req,res)=>{
//     let country;
//    if(req.query.regarding){
//     country = req.query.regarding;
//    }else{
//     country = 'in';
//    }
//     try {
//         var url = 'http://newsapi.org/v2/top-headlines?' +
//         'country='+country+'&' +
//         'apiKey=011e3cd81e7a44239e332ef9b3c83506';
//         const news_get =await axios.get(url);
//         res.render('index',{articles:news_get.data.articles})

//     } catch (error) {
//         if(error.response){
//             console.log(error)
//         }

//     }
// })

rout.get('/',async(req,res)=>{
    let username = "";
    let logged = false;
    if(req.session.loggedIn){
        username = req.session.loggedIn;
        logged = true;
    }
    let hero_grid = [];
    let international_news = [];
    let latest_news = [];
    try {
        var url = 'http://newsapi.org/v2/top-headlines?' +
        'country=in&' +
        'apiKey=f4242a90704d4894b73ec0dd52c7ea19';
        let news_get =await axios.get(url);
        // console.log(news_get.data.articles);
        for(let i = 0; i < 20; i++){
            if(i < 5){
                if(i == 1){
                    news_get.data.articles[i].class = "row-2 col-2";
                    news_get.data.articles[i].text_size = "f-108rem";
                }
                hero_grid.push(news_get.data.articles[i]);
            }else{
                latest_news.push(news_get.data.articles[i]);
            }
        }
        news_get = await axios.get("http://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=f4242a90704d4894b73ec0dd52c7ea19")
        for(let i = 0; i < 6; i++){
            international_news.push(news_get.data.articles[i]);
        }
        res.render('index',{hero_grid: hero_grid, international: international_news, latest_news: latest_news, posts: "Latest News", logged: logged, username:username});

    } catch (error) {
        if(error.response){
            console.log(error)
        }

    }
})


rout.post("/search", async(req, res) =>{
    let search = req.body.search_query;
    try{
        let url = `http://newsapi.org/v2/everything?q=${search}&apiKey=f4242a90704d4894b73ec0dd52c7ea19`;
        const news_get = await axios.get(url);
        res.render("query", {latest_news: news_get.data.articles, posts: "Search : " + search});
    }catch(error){
        if(error.response){
            console.log(error);
        }
    }
})

rout.get("/category/:category", async(req, res) => {
    let category = req.params.category;
    try {
        let url = `http://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=f4242a90704d4894b73ec0dd52c7ea19`;
        let news_get = await axios.get(url);
        res.render("query", {latest_news: news_get.data.articles, posts: "Category : " + category});
    } catch (error) {
        if(error.message){
            console.log(error);
        }
        
    }
})
rout.get("/source/:source", async(req, res) => {
    let source = req.params.source;
    try {
        let url = `http://newsapi.org/v2/top-headlines?sources=${source}&apiKey=f4242a90704d4894b73ec0dd52c7ea19`;
        let news_get = await axios.get(url);
        res.render("query", {latest_news: news_get.data.articles, posts: "Source : " + source});
    } catch (error) {
        if(error.message){
            console.log(error);
        }
        
    }
})
rout.get("/country/:country", async(req, res) => {
    let country = req.params.country;
    try {
        let url = `http://newsapi.org/v2/top-headlines?country=${country}&apiKey=f4242a90704d4894b73ec0dd52c7ea19`;
        let news_get = await axios.get(url);
        res.render("query", {latest_news: news_get.data.articles, posts: "Country : " + country});
    } catch (error) {
        if(error.message){
            console.log(error);
        }
        
    }
});

rout.get("/login", async(req, res) => {
    let err_success = "";
    let show = false;
    if(req.session.err_success){
        err_success = req.session.err_success;
        delete req.session.err_success;
        show = true;
    }
    res.render("login-registration", {login_registration: "login", isLogin:true, err_success: err_success, show: show})
})
rout.get("/registration", async(req, res) => {
    let err_success = "";
    let show = false;
    if(req.session.err_success){
        err_success = req.session.err_success;
        delete req.session.err_success;
        show = true;
    }
    res.render("login-registration", {login_registration: "login", isRegistration:true, err_success: err_success, show: show})
})

module.exports = rout;
