//make into hook
import React, {Component} from 'react';
import './App.css';
import axios from 'axios'

class CommentPost extends Component {
  constructor(props){
  super(props);
  this.state={

  }
 }

 render() {
  const comment = this.props.comment
  return (
      <div>
        {comment.user}{comment.comment}
        <button>reply</button>
      </div>
  );
 }
}
export default CommentPost
