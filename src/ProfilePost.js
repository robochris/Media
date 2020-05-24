import React, {Component} from 'react';
import CommentPost from './CommentPost'
import './App.css';
import axios from 'axios'
//Change to hook

class ProfilePost extends Component {
  constructor(props){
  super(props);
  this.state={
    posts: []
  }
 }

 render() {
  const post = this.props.post
  console.log(post)
  return (
      <div>
        <img src={post.result.img}/>
      </div>
  );
 }
}
export default ProfilePost
