import React, {Component} from 'react';
import CommentPost from './CommentPost'
import './App.css';
import axios from 'axios'
import { connect } from 'react-redux'
import io from "socket.io-client";
//Change to hook

const mapStateToProps = (state) => ({
  user: state.session.user
})

class SingleFriend extends Component {
  constructor(props){
  super(props);
  this.state={
  }
 }

 callClick(id, friendSocket){
   this.props.callUser(friendSocket)
 }

 render() {
  const friend = this.props.friend
  return (
      <div>
        <div className="loginContainer">
          <div className="Postuser">
            {friend.username}
          </div>
          <button onClick={() => this.callClick(friend._id, friend.socket)}>Call</button>
          <button>message</button>
        </div>
      </div>
  );
 }
}
export default connect(mapStateToProps)(SingleFriend)
