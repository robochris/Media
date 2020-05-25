import React, {Component} from 'react';
import SinglePost from './PostSingle'
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import './App.css';

const mapStateToProps = (state) => ({
  user: state.session.user
})

const postGet = async (username) => {
  console.log("Get Post Username: ", username)
  return await axios.get('http://localhost:6969/allPost/'+username).then(function(res){
    console.log(res.data)
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
   console.log("User: ", this.props.user)
   postGet(this.props.user.username)
   .then(posts => {
     console.log(posts)
     this.setState({
       loading: false,
       posts
     })
   })
 }

 render() {
  if (this.state.loading) {
    return (
      <div>
          loading
      </div>);
  } else if (this.state.posts <= 0) {
    console.log(this.state.posts)
    return (
      <div>
        <button onClick={() => this.props.history.push('/addPost')}>ADD</button>
      </div>
    )
  } else {
    console.log(this.state.posts)
    return (
      <div>
        <div className="post-container">
        {(this.state.posts || []).map(post => (
          <SinglePost key={post._id} post={post} user={this.props.user}/>
        ))}
        <button onClick={() => this.props.history.push('/addPost')}>ADD</button>
      </div>
    </div>
  );
  }
 }
}
export default withRouter(connect(mapStateToProps)(Post))
