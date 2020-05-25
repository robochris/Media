import React, {Component} from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import './App.css';

const mapStateToProps = (state) => ({
  user: state.session.user
})

const addPost = async (username, addBody) => {
  return await axios.post('http://localhost:6969/post/'+username, addBody).then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

class AddPost extends Component {
  constructor(props){
  super(props);
  this.state={
    caption: ""
  }
 }

addClick(caption, username, userId) {
  const addBody = {caption, userId}
  addPost(username, addBody).then(result=>{
      this.props.history.push('/')
  })
}

 render() {
   console.log(this.props.user)
   console.log(this.state.posts)
   return (
      <div>
        <input type="text" onChange={(event) => this.setState({caption: event.target.value})}/>
        <button onClick={() => this.addClick(this.state.caption, this.props.user.username, this.props.user._id)}>ADD</button>
      </div>
  );
 }
}
export default withRouter(connect(mapStateToProps)(AddPost))
