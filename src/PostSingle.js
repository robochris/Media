import React, {Component} from 'react';
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

class SinglePost extends Component {
  constructor(props){
  super(props);
  this.state={
  }
 }

 removeClick(id){
   console.log("removeID: "+id)
   removePost(id)
 }

 render() {
  console.log(this.props.post)
  const post = this.props.post
  return (
      <div>
        <div className="loginContainer">
          <img src={post.result.img}/>
          <button onClick={() => this.removeClick(post._id)}>Remove</button>
        </div>
      </div>
  );
 }
}
export default SinglePost
