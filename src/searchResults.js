import React, {Component} from 'react';
import CommentPost from './CommentPost'
import './App.css';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
//Change to hook
//Make error if no user

class SearchResults extends Component {
  constructor(props){
  super(props);
  this.state={

  }
 }

 searchClick(username) {
   this.props.history.push('/profile/'+username)
 }

 render() {

  return (
      <div>
        <button onClick={() => this.searchClick(this.props.result.username)}>{this.props.result.username}</button>
      </div>
  );
 }
}
export default withRouter(SearchResults)
