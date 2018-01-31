const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '7b5e0c9bfa4f3d9a3bc8';

// if(!ObjectID.isValid(id)){
//   return console.log('ID Not Valid');
// }
// Todo.find({
//     _id:id
// }).then((todos) =>{
//     if(!todos){
//         return console.log('No Array Found');
//     }
//   console.log('Todos',todos)
// });

// Todo.findOne({
//     _id:id
// }).then((todo) =>{
//     if(!todo){
//         return console.log('No Record Found');
//     }
//     console.log('Todo',todo)
// });

// Todo.findById(id).then((todo) =>{
//     if(!todo){
//         return console.log('No Record Found');
//     }
//     console.log('Todo By Id',todo)
// }).catch((e) => console.log(e));

var id = "5a7064abd26842f42b6f1ca2"

if(!ObjectID.isValid(id)){
    return console.log('Id Is Not Valid');
}

User.findById(id).then((user) =>{
    if(!user){
        return console.log('User Not Found');
    }
    console.log('User Details',user)
}).catch((e) => console.log(e));