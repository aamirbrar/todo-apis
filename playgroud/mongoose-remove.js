const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// },(e) => {
//     console.log(e);
// });

// Todo.findOneAndRemove({_id:'5a71b055aca1e252e05f4022'}).then((result) => {
//     console.log(result);
// },(e) => {
//       console.log(e);
// });

Todo.findByIdAndRemove('5a71b055aca1e252e05f4022').then((todo) => {
    console.log(todo);
},(e) => {
      console.log(e);
});