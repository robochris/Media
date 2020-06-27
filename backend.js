const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb')
const socketIO = require('socket.io')
const http = require("http");
const path = require("path");
const fs = require('fs')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const port = 6969
app.use(express.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
const client = new MongoClient('mongodb://localhost:27017')

const register = (username, password, email) => {
  const collection = db.collection('users')
  const user = {username:username, password:password, alias: username, post:[], follow: [], followers: [], friends: [], email:email, socket: null}
  return collection.insertOne(user)
    .then((result) => {
      return result.ops[0]
    })
}

app.post('/register', (req, res) => {
  register(req.body.username, req.body.password, req.body.email)
    .then(user => {
      res.send(user)
    })
})

app.post('/login', (req, res) => {
  const users = db.collection('users')
  users.findOne({username: req.body.username, password: req.body.password})
    .then(user=>{
        if(!user) {
          return res.send({error: "LOGIN_ERROR"})
        } else {
          res.send(user)
        }
    }).catch(err=>{
      return res.send({error: "LOGIN_ERROR"})
    })
})

app.get('/allPost/:user', (req,res) => {
  const users = db.collection('users')
  const post = db.collection('post')
  users.findOne({username: req.params.user})
    .then(user => {
      post.find({userId: {$in: user.follow}}).sort({_id: -1}).toArray(function(e, result){
        res.send(result)
      })
    })
})

app.get('/post/:user', (req, res) => {
  const users = db.collection('users')
  const post = db.collection('post')
  const getPost = entry => {
    return post.findOne({_id: ObjectId(entry._id)})
      .then(result=> ({ ...entry, result }))}
  users.findOne({username: req.params.user})
    .then(user => {
      Promise.all(user.post.map(entry => getPost(entry)))
        .then(posts => res.send(posts))
    })
})

app.post('/post/:user', (req,res) => {
  const users = db.collection('users')
  const posts = db.collection('post')
  console.log(req.body)
  posts.insertOne({img: "https://picsum.photos/200/300", userId: ObjectId(req.body.userId), user: req.params.user, caption: req.body.caption, comments:[]})
    .then((result)=>{
      users.findOneAndUpdate({username: req.params.user}, {$push: {post:{_id: result.ops[0]._id.toHexString()}}})
        .then((userPost)=>{
          console.log(res.send(userPost))
        })
    })
})

app.post('/postRemove/:user', (req,res) => {
  const users = db.collection('users')
  const posts = db.collection('post')
  users.findOneAndUpdate({username: req.params.user}, {$pull: {post:{_id: req.body.id}}})
  posts.findOneAndDelete({_id: ObjectId(req.body.id)})
})

app.post('/postComment/:user', (req, res) => {
  const users = db.collection('users')
  const posts = db.collection('post')
  console.log(req.body.comment)
  posts.findOneAndUpdate({_id: ObjectId(req.body.id)}, {$push: {comments: {user: req.params.user, comment: req.body.comment, reply: []}}}).then((result)=>{console.log(result)})
})

app.post('/search', (req,res) => {
  const users = db.collection('users')
  const value = new RegExp("^"+req.body.searchValue, 'i')
  users.find({username: {$regex: value}}).toArray(function(e, result){
    res.send(result)
  })
})

app.post('/search/result', (req,res) => {
  const users = db.collection('users')
  users.findOne({username: req.body.user}).then(result=>{res.send(result)})
})

app.post('/addFollow', (req,res) => {
  const users = db.collection('users')
  users.findOneAndUpdate({_id: ObjectId(req.body.userId)}, {$push: {follow: ObjectId(req.body.userFollow)}})
  users.findOneAndUpdate({_id: ObjectId(req.body.userFollow)}, {$push: {followers: ObjectId(req.body.userId)}})
  users.findOne({_id: ObjectId(req.body.userId)}).then(user=>{
    if(user.followers.some(i=>{return req.body.userFollow===i.toString()})) {
        users.findOneAndUpdate({_id: ObjectId(req.body.userId)}, {$push: {friends: ObjectId(req.body.userFollow)}})
        users.findOneAndUpdate({_id: ObjectId(req.body.userFollow)}, {$push: {friends: ObjectId(req.body.userId)}})
    }
  })
})

app.post('/friends', (req, res) => {
  const users =db.collection('users')
  users.findOne({_id: ObjectId(req.body.userId)}).then(user=>{
    users.find({_id: {$in: user.friends}}).toArray(function(e, result){
      res.send(result)
    })
  })
})

//socket
app.post('/setSocket', (req, res) => {
  const users = db.collection('users')
  console.log(req.body.userId, req.body.socket)
  users.findOneAndUpdate({_id: ObjectId(req.body.userId)}, {$set: {socket: req.body.socket}})
})

io.on("connection", socket => {
  const users = db.collection('users')
  socket.on("updateUserSocket", data => {
      users.findOneAndUpdate({_id: ObjectId(data.userId)}, {$set: {socket: socket.id}})
  });

  socket.on("callUser", data => {
    socket.to(data.to).emit("gettingCalled", {
      offer: data.offer,
      socket: socket.id,
    })
  })

  socket.on("ICE", data => {
    socket.to(data.to).emit("ICERecieve", {
      candidate: data.candidate
    })
  })

  socket.on("makeAnswer", data => {
    socket.to(data.to).emit("answerMade", {
      socket: socket.id,
      answer: data.answer,
    })
  })

  socket.on("disconnect", () => {
    console.log("User disconnected with socket id: "+ socket.id)
  });
});

client.connect()
  .then(() => {
    db = client.db("media")
    server.listen(port, () => console.log(`App listening on port ${port}!`))
  })
