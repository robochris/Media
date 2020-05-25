import React, {Component} from 'react';
import CommentPost from './CommentPost'
import './App.css';
import axios from 'axios'
//Change to hook

const removePost = async (id, username) => {
  return await axios.post('http://localhost:6969/postRemove/'+username, {id}).then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

const commentPost = async (id, comment, username) => {
  return await axios.post('http://localhost:6969/postComment/'+username, {id, comment}).then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

class SinglePost extends Component {
  constructor(props){
  super(props);
  this.state={
    comment: '',
  }
 }

 removeClick(id, username){
   removePost(id, username)
 }

 commentClick(id, comment, username) {
   commentPost(id, comment, username)
 }

 render() {
  const username = this.props.user.username
  const post = this.props.post
  return (
      <div>
        <div className="loginContainer">
          <div className="Postuser">
            {post.user}
          </div>
          <img src={post.img}/>
          <div className="caption">
            {post.caption}
          </div>
          <div classname="commentContainer">
          {post.comments.map(comments => (
            <CommentPost comment={comments}/>
          ))}
          </div>
          <button onClick={() => this.removeClick(post._id, username)}>Remove</button>
          <input type="text" onChange={(event) => this.setState({comment:event.target.value})}/>
          <button onClick={() => this.commentClick(post._id, this.state.comment, username)}>comment</button>
        </div>
      </div>
  );
 }
}
export default SinglePost
