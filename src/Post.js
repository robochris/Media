import React, {Component} from 'react';
import SinglePost from './PostSingle'
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import './App.css';

const mapStateToProps = (state) => ({
  user: state.session.user
})

const postGet = async () => {
  return await axios.get('http://localhost:6969/post/q').then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

const addPost = async (postData) => {
  //change user to user
  return await axios.post('http://localhost:6969/post/q', {postData}).then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

const removePost = async () => {
  return await axios.post('http://localhost:6969/post/q').then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

class Post extends Component {
  constructor(props){
  super(props);
  this.state={
    loading:true,
    posts: []
  }
 }
 componentDidMount() {
   postGet()
   .then(posts => {
     console.log(posts)
     this.setState({
       loading: false,
       posts
     })
   })
 }

 addClick() {
   //change url to actual img
   const postData = {img: "https://picsum.photos/200/300"}
   addPost(postData)
   this.props.history.push('/')
 }

 render() {
   console.log(this.props.user)
   console.log(this.state.posts)
  if (this.state.loading) {
    return (
      <div>No Post were made
        <br/>
          <button onClick={() => this.addClick()}>ADD</button>
        </div>);
  } else {
    return (
      <div>
        <div className="post-container">
        {this.state.posts.map(post => (
          <SinglePost key={post._id} post={post}/>
        ))}
        <button onClick={() => this.addClick()}>ADD</button>
      </div>
    </div>
  );
  }
 }
}
export default withRouter(connect(mapStateToProps)(Post))
