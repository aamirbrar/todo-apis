const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
var data = {
 id:10
}
var token = jwt.sign(data,'1con23Aamir');
console.log(token);
var decode = jwt.verify(token,'1con23Aamir');
console.log('decoded:',decode);
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