const bcrypt = require('bcryptjs');

var password = "123ab!";

// bcrypt.genSalt(10,(err,salt) => {
//   bcrypt.hash(password,salt,(err,hash) => {
//       console.log(hash);
//   });
// });

var hashPassword = "$2a$10$KWfPbUmWqD1Zi.ncBYKwLeceh6GW/GSbnhhGGZ5eMNgdPAHm34mU6";
bcrypt.compare(password,hashPassword,(err,res) => {
    console.log(res);
});
// const {SHA256} = require('crypto-js');
// const jwt = require('jsonwebtoken');
// var data = {
//  id:10
// }
// var token = jwt.sign(data,'1con23Aamir');
// console.log(token);
// var decode = jwt.verify(token,'1con23Aamir');
// console.log('decoded:',decode);
//jwt.verify
// var msg = "I am user number 3";
// var hash = SHA256(msg).toString();
// console.log(`Message : ${hash}`);

// var data = {
//     id:4
// }

// var token ={
//     data,
//     hash:SHA256(JSON.stringify(data) + 'somescreat').toString()
// }

// var reHash = SHA256(JSON.stringify(data) + 'somescreat').toString();

// if(reHash === token.hash){
//     console.log('data not changed');
// }else{
//     console.log('data changed');
// }