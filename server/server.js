require('./config/config');
const _ = require('lodash');
const express = require('express');
var bodyParser = require('body-parser');
var  {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} =  require('./models/user');
const {authenticate} =  require('./middleware/authenticate');


var app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

//post login
app.post('/users/login',(req,res) => {
    var body = _.pick(req.body,['email','password']);

    User.finByCredentails(body.email,body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth',token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});
//get user with token
app.get('/users/me',authenticate,(req,res) => {
    res.send(req.user);
//    var token = req.header('x-auth');
//    User.findByToken(token).then((user) => {
//     if(!user){
//        return Promise.reject();
//     }
//        res.send(user);
//    }).catch((e) => {
//     res.status(401).send();
//    });
});
//////////add user 
app.post('/users',(req,res) => {
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);
  user.save().then((user) => {
      return user.generateAuthToken();
      //res.status(200).send(user);
  }).then((token) =>{
      res.header('x-auth',token).send(user);
  }).catch((e) => {
      res.status(400).send(e);
  });
});
//post todo
app.post('/todos',(req,res) =>{
    var todo = new Todo({
        text:req.body.text
    });
    todo.save().then((doc) => {
        res.status(200).send(doc);
    },(e) => {
        res.status(400).send(e);
    });
});
//get all todo
app.get('/todos',(req,res) =>{
    Todo.find().then((todos) => {
        res.status(200).send({todos});
    },(e) => {
        res.status(400).send(e);
    });
});
//delete todo
app.delete('/todos/:id',(req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send({msg:'Invalid Id'});
    }
    Todo.findByIdAndRemove(id).then((todo) => {
         if(!todo){
            return res.status(400).send({msg:'No Todo Found'});
        }
        res.status(200).send({todo});
    },(e) => {
        res.status(400).send(e);
    });
});
// get single todo
app.get('/todos/:id',(req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send({msg:'Invalid Id'});
    }
    Todo.findById(id).then((todo) => {
        if(!todo)
        {
            return res.status(400).send({msg:'No User Found'});
        }
        res.status(200).send({todo});
    },(e) => {
        res.status(400).send(e);
    });
});
//update todo
app.patch('/todos/:id',(req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(400).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null; 
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo) =>{
        if(!todo){
            res.status(400).send();
        }
        res.status(200).send({todo});
     }).catch((e) => {
        res.status(400).send();
    });
});


app.listen(port,() => {
    console.log(`Start on Port ${port}`);
});

module.exports = {app};