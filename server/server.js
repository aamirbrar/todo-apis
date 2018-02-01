const _ = require('lodash');
const express = require('express');
var bodyParser = require('body-parser');
var  {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} =  require('./models/user');

var app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

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

app.get('/todos',(req,res) =>{
    Todo.find().then((todos) => {
        res.status(200).send({todos});
    },(e) => {
        res.status(400).send(e);
    });
});

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