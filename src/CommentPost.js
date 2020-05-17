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
  console.log(this.props.post)
  const comment = this.props.comment
  return (
      <div>
        {comment.comment}
        <button>reply</button>
      </div>
  );
 }
}
export default CommentPost
