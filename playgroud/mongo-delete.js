const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
if(err)
{
     return console.log('unable to connect');
}
console.log('Connected sucessfully');
//deletemany
// db.collection('Todos').deleteMany({text:'eat lunch'}).then((result) => {
//     console.log(result);
// });

// db.collection('Users').deleteMany({name:'Aamir Brar'}).then((result) => {
//     console.log(result);
// });

//deleteOne
// db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result) => {
//      console.log(result);
// });

//findanddelete
// db.collection('Todos').findOneAndDelete({text:'Eat lunch'}).then((result) => {
//      console.log(result);
// });

// db.collection('Users').findOneAndDelete({name:'Atul Jain'}).then((result) => {
//      console.log(result);
// });
db.collection('Users').findOneAndDelete({_id:new ObjectID('5a7041002edc4d9068c518d8')}).then((result) => {
     console.log(result);
});
//db.close();
});