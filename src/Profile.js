import React, {Component} from 'react';
import './App.css';
import ProfilePost from './ProfilePost'
import axios from 'axios'
import { withRouter, useParams } from 'react-router-dom';
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  user: state.session.user
})

const getProfile = async (user) => {
  return await axios.post('http://localhost:6969/search/result', {user}).then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

const postGet = async (username) => {
  return await axios.get('http://localhost:6969/post/'+username).then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

const addFollow = async (userFollow, userId) => {
  return await axios.post('http://localhost:6969/addFollow', {userFollow, userId}).then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

class Profile extends Component {
  constructor(props){
  super(props);
  this.state={
    profile: [],
    posts: []
  }
 }
 componentDidMount() {
   const username = this.props.match.params.username
   getProfile(username).then(profile=>{
     postGet(username)
     .then(posts => {
       this.setState({
         profile,
         posts
       })
     })
   })
 }

 followClick() {
   addFollow(this.state.profile._id, this.props.user._id)
 }

 render() {
  console.log("Penis",this.props)
  const profile = this.state.profile
  //const thing = profile.followers.some((element) => element)
  console.log(profile.followers)
  console.log(this.props.user)

  return (
      <div>
        <div>
          <span>Username: {profile.username}</span>
          <span>Following: {profile.follow === undefined ? 0 : profile.follow.length}</span>
          <span>Followers: {profile.followers === undefined ? 0 : profile.followers.length}</span>
        </div>
        <div>
        {(this.props.user === undefined || this.props.user.username === profile.username) ? console.log("im the user") : <button onClick={() => this.followClick()}> Follow </button>}
        </div>
        {(this.state.posts || []).map(post => (
          <ProfilePost key={post._id} post={post}/>
        ))}
      </div>
  );
 }
}
export default withRouter(connect(mapStateToProps)(Profile))
