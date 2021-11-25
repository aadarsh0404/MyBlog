const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');

//to get url in form of www.url.com/XXX-YYY-ZZZ
const _ = require('lodash');

//Setup DB
mongoose.connect('mongodb://localhost:27017/blogs');

//Schema
const blogSchema = new mongoose.Schema({
    title: String,
    blog: String
});

const Blog = mongoose.model("Blog", blogSchema);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));

const home = " Lorem Ipsum is simply dummy text of the printing and "+
"typesetting industry. Lorem Ipsum has been the "+
"industry's standard dummy text ever since the 1500s,"+
 "when an unknown printer took a galley of type and "+
 "scrambled it to make a type specimen book. It has "+
 "survived not only five centuries, but also the leap "+
 "into electronic typesetting, remaining essentially "+
 "unchanged. It was popularised in the 1960s with the "+
 "release of Letraset sheets containing Lorem Ipsum "+
 "passages, and more recently with desktop publishing "+
 "software like Aldus PageMaker including versions of Lorem Ipsum.";

const about = "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32."

const contact = 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.';
app.get('/',function(req,res){
    Blog.find({},function(err,posts){
        res.render('home',{
            home: home
        });
    });
});

app.get('/home',function(req,res){
    Blog.find({},function(err,posts){
        res.render('index',{
            posts: posts
        });
    });
});

// app.get('/home',function(req,res){
//     res.render('index',{home: home, posts: posts});
// });

app.get('/about',function(req,res){
    res.render('about',{about: about});
});

app.get('/contact',function(req,res){
    res.render('contact',{contact: contact});
});

app.get('/new',function(req,res){
    res.render('new');
});

app.post('/new',function(req, res){
    
    const newBlog = new Blog({
        title: req.body.title,
        blog: req.body.blog
    });

    newBlog.save();
    res.redirect('/home');
});

app.get("/posts/:postName", function(req, res){
    const requestedTitle = _.lowerCase(req.params.postName);

    Blog.find(function(err, post){
        if(err){
            console.log(err);
        }
        else{
            post.forEach(function(post){
                const storedTitle = _.lowerCase(post.title);
                if (storedTitle === requestedTitle) {
                    res.render("page",{
                        title: post.title,
                        blog: post.blog
                    })
                }
            })
        }
    });
});

app.post("/:postName/delete", function(req, res){
    const requestedTitle = _.lowerCase(req.params.postName);
    Blog.find(function(err, post){
        if(err){
            console.log(err);
        }
        else{
            post.forEach(function(post){
                const storedTitle = post.title;
                if (_.lowerCase(storedTitle) === requestedTitle) {
                    Blog.deleteOne({title: storedTitle},function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                }
            });
            res.redirect('/home');
        }
    });
});

app.get("/:postName/edit",function(req,res){
    const requestedTitle = _.lowerCase(req.params.postName);
    Blog.find(function(err, post){
        if(err){
            console.log(err);
        }
        else{
            post.forEach(function(post){
                const storedTitle = post.title;
                if (_.lowerCase(storedTitle) === requestedTitle) {
                    res.render('edit',{title: _.lowerCase(storedTitle)});
                }
            });
        }
    });
});

app.post("/:postName/edit", function(req, res){
    const requestedTitle = _.lowerCase(req.params.postName);
    Blog.find(function(err, post){
        if(err){
            console.log(err);
        }
        else{
            post.forEach(function(post){
                console.log(post.title);
                const storedTitle = post.title;
                const storedBlog = post.blog;
                if(_.lowerCase(storedTitle)===requestedTitle){
                    console.log(_.lowerCase(storedTitle)+" "+requestedTitle);
                    res.render("Edit",{title: _.lowerCase(storedTitle)});
                    Blog.updateOne({title: storedTitle, blog:storedBlog},{title:req.body.title, blog:req.body.blog},function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                }
            });
        }
    });

    res.redirect('/home');
});

app.listen(3000,function(){
    console.log("Server running on port 3000");
});