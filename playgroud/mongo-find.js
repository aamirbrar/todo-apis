const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
if(err)
{
     return console.log('unable to connect');
}
console.log('Connected sucessfully');
// db.collection('Todos').find({
//                             _id:new ObjectID('5a70182a2edc4d9068c50eb0')
//                             }).toArray().then((docs) => {
//   console.log('Todos')
//   console.log(JSON.stringify(docs,undefined,2));
// },(err) => {
//     console.log('Unable to fetch todos',err);
// });


db.collection('Todos').find().count().then((count) => {
  console.log(`Todos count:${count}`)
},(err) => {
    console.log('Unable to fetch todos',err);
});

//db.close();
});