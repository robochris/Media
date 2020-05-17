import React, {Component} from 'react';
import CommentPost from './CommentPost'
import './App.css';
import axios from 'axios'
//Change to hook

const removePost = async (id) => {
  console.log("removepost")
  return await axios.post('http://localhost:6969/postRemove/q', {id}).then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

const commentPost = async (id, comment) => {
  console.log("commentpost")
  return await axios.post('http://localhost:6969/postComment/q', {id, comment}).then(function(res){
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

 removeClick(id){
   console.log("removeID: "+id)
   removePost(id)
 }

 commentClick(id, comment) {
   commentPost(id, comment)
 }

 render() {
  console.log(this.props.post)
  const post = this.props.post
  return (
      <div>
        <div className="loginContainer">
          <div className="Postuser">
            {post.result.user}
          </div>
          <img src={post.result.img}/>
          <div className="caption">
            {post.result.caption}
          </div>
          <div classname="commentContainer">
          {post.result.comments.map(comments => (
            <CommentPost comment={comments}/>
          ))}
          </div>
          <button onClick={() => this.removeClick(post._id)}>Remove</button>
          <input type="text" onChange={(event) => this.setState({comment:event.target.value})}/>
          <button onClick={() => this.commentClick(post._id, this.state.comment)}>comment</button>
        </div>
      </div>
  );
 }
}
export default SinglePost
