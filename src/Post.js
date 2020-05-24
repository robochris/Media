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
  return await axios.get('http://localhost:6969/post/'+username).then(function(res){
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
   postGet(this.props.user.username)
   .then(posts => {
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
    return (
      <div>
        <button onClick={() => this.props.history.push('/addPost')}>ADD</button>
      </div>
    )
  } else {
    return (
      <div>
        <div className="post-container">
        {this.state.posts.map(post => (
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
