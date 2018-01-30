const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
if(err)
{
     return console.log('unable to connect');
}
console.log('Connected sucessfully');
// db.collection('Todos').findOneAndUpdate({
//                   _id:new ObjectID('5a6f1668a9b47d3791bd388c')},{
//                       $set:{
//                           completed:true
//                       }
//                   },{
//                       returnOriginal:false
//                   }).then((result) => {
//                       console.log(result);
//                   });
db.collection('Users').findOneAndUpdate({
        _id:new ObjectID('5a7044512edc4d9068c519de') },
            {
                $set:{
                     name:"Aamir Brar"
                },
                $inc:{
                     age:1
                }},{
                 returnOriginal:false
                }).then((result) => {
                    console.log(result);
                }
      );
//db.close();
});