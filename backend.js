const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb')
const fs = require('fs')
const app = express()
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
  const user = {username:username, password:password, post:[], follow: [], followers: [], email:email}
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
          return res.send(user)
        }
    }).catch(err=>{
      return res.send({error: "LOGIN_ERROR"})
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
  posts.insertOne(req.body.postData)
    .then((result)=>{
      users.findOneAndUpdate({username: req.params.user}, {$push: {post:{_id: result.ops[0]._id.toHexString()}}})
        .then((userPost)=>{
          console.log(userPost)
        })
    })
})

app.post('/postRemove/:user', (req,res) => {
  const users = db.collection('users')
  const posts = db.collection('post')
  console.log(req.body)
  console.log("space")
  users.findOneAndUpdate({username: req.params.user}, {$pull: {post:{_id: req.body.id}}})
  .then(result=> {console.log(result.value.post)})
  posts.findOneAndDelete({_id: ObjectId(req.body.id)})
  .then(result=> {console.log(result)})
})

client.connect()
  .then(() => {
    db = client.db("media")
    app.listen(port, () => console.log(`App listening on port ${port}!`))
  })
