const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email:"amir@gmail.com",
  password:"123456",
  tokens:[{
      access:'auth',
      token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
  }]
},{
    _id: userTwoId,
    email:"aamir@gmail.com",
    password:"userTwoPass"
}];
const todos = [{
    _id:new ObjectID(),
    text:'first'},{
    _id:new ObjectID(),
     text:'second',
     completed:true,
     completedAt:333
     }
   ];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUser = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne,userTwo]);
    }).then(() => done());
};
module.exports = {todos,populateTodos,users,populateUser};