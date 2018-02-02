const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {User} = require('./../models/user');
const {Todo} = require('./../models/todo');
const {todos,populateTodos,users,populateUser} = require('./seed/seed');
beforeEach(populateTodos);
beforeEach(populateUser);
describe('POST /todos',() => {
    it('should create a new todo',(done) => {
        var text = 'Test todo text'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) =>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)  => {
                if(err){
                    return done(err);
                }
            Todo.find({text}).then((todos) =>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data',(done) =>{
        request(app)
        .post('/todos')
        .send()
        .expect(400)
        .end((err,res)  => {
            if(err){
                return done(err);
            }
        Todo.find().then((todos) =>{
            expect(todos.length).toBe(2);
            done();
        }).catch((e) => done(e));
        });
    });
});


describe('GET /todos',() => {
    it('should get all todos',(done) =>{
        request(app)
          .get('/todos')
          .expect(200)
          .expect((res) => {
              expect(res.body.todos.length).toBe(2);
          })
          .end(done);
    } )
});

describe('GET /todos',() => {
  it('should return todo doc',(done) => {
      request(app)
         .get(`/todos/${todos[0]._id.toHexString()}`)
         .expect(200)
         .expect((res) =>{
             expect(res.body.todo.text).toBe(todos[0].text)
         })
         .end(done);
  })

  it('should return 404',(done) =>{
    request(app)
    .get(`/todos/5a707b5e0c9bfa4f3d9a3bc2`)
     .expect(400)
     .expect((res) =>{
         expect(res.body).toEqual({msg:'No User Found'})
     })
     .end(done);
  });

  it('should return 404 for non-object',(done) =>{
      request(app)
        .get(`/todos/123`)
         .expect(400)
         .expect((res) =>{
             expect(res.body).toEqual({msg:'Invalid Id'})
         })
         .end(done);
  });
});

describe('DELETE /todos',() => {
    it('should delete todo doc',(done) => {
        var haxid = todos[0]._id.toHexString();
        request(app)
           .delete(`/todos/${haxid}`)
           .expect(200)
           .expect((res) =>{
               expect(res.body.todo.text).toBe(todos[0].text)
           })
           .end((err,res) => {
               if(err){
                   return done(err);
               }
               Todo.findById(haxid).then((todo) => {
                   expect(todo).toBe(null);
                   done();
               }).catch((e) => done(e))
           });
    })
  
    it('should return 404',(done) =>{
      request(app)
      .delete(`/todos/5a707b5e0c9bfa4f3d9a3bc2`)
       .expect(400)
       .expect((res) =>{
           expect(res.body).toEqual({msg:'No Todo Found'})
       })
       .end(done);
    });
  
    it('should return 404 for non-object',(done) =>{
        request(app)
          .get(`/todos/123`)
           .expect(400)
           .expect((res) =>{
               expect(res.body).toEqual({msg:'Invalid Id'})
           })
           .end(done);
    });
  });


  describe('PATCH /todos/:id',() => {
      it('should updated todo',(done) => {
         var haxid = todos[0]._id.toHexString();
         var text = 'This Is new test'; 
         request(app)
         .patch(`/todos/${haxid}`)
         .send({
             completed:true,
             text
         })
         .expect(200)
         .expect((res) =>{
             expect(res.body.todo.text).toBe(text);
             expect(res.body.todo.completed).toBe(true);
             //expect(res.body.todo.completedAt).toBeA('number');
          })
         .end(done);
      });

      it('should clear completed when toso is not completed',(done) => {
        var haxid = todos[1]._id.toHexString();
        var text = 'This Is new test !!'; 
        request(app)
        .patch(`/todos/${haxid}`)
        .send({
            completed:false,
            text
        })
        .expect(200)
        .expect((res) =>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            //expect(res.body.todo.completedAt).toBeA('number');
         })
        .end(done);
      });
  });

  describe('GET /user/me',() => {
      it('sould return user if authcate',(done) => {
          request(app)
             .get('/users/me')
             .set('x-auth',users[0].tokens[0].token)
             .expect(200)
             .expect((res) => {
                 expect(res.body._id).toBe(users[0]._id.toHexString());
                 expect(res.body.email).toBe(users[0].email);
             })
             .end(done);
      });

      it('should return 401',(done) => {
          request(app)
          .get('/users/me')
          .expect(401)
          .expect((res) => {
              expect(res.body).toEqual({});
          })
          .end(done);
      });
  });


describe('POST /users',() => {
    it('should Create A user',(done) => {
        var email = "example@gmail.com";
        var password = "123mnb!";
        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if(err){
                return done(err);
            }
            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            }).catch((e) => done(e));
        });
    });
    it('should error validation error',(done) => {
        request(app)
          .post('/users')
          .send({email:"amd",password:"123"})
          .expect(400)
          .end(done);
    });
    it('should not create user if email in use',(done) => {
        request(app)
        .post('/users')
        .send({email:"amir@gmail.com",password:"1234567"})
        .expect(400)
        .end(done);
    });
});

describe('POST /user/Login',() => {
    it('should return login user and genrate token',(done) => {
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password:users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err,res) => {
            if(err){
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                //console.log(user);
                expect({access:user.tokens[0].access,token:user.tokens[0].token}).toEqual({
                    access:"auth",
                    token:res.headers['x-auth']
                });
                done();
            }).catch((e) => done(e));
        });
    });

    it('should reject login',(done) => {
          request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password:users[1].password + '1'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBe();
        })
        .end((err,res) => {
            if(err){
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                //console.log(user);
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));
        });
    });
});