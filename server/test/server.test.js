const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');

const {Todo} = require('./../models/todo');

const todos = [{
    _id:new ObjectID(),
    text:'first'},{
    _id:new ObjectID(),
     text:'second',
     completed:true,
     completedAt:333
     }
   ];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});
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