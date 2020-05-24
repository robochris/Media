import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import SearchField from './SearchField'
import Post from './Post'
import './App.css';

const mapStateToProps = (state) => ({
  user: state.session.user
})

class Home extends Component {
  constructor(props){
  super(props);
  this.state={
  }
 }
 render() {
  if(!this.props.user) {
    return (<div>No User</div>)
  } else {
    return (
      <div>
        <SearchField user={this.props.user}/>
        <Post/>
      </div>
    );
  }
 }
}
export default withRouter(connect(mapStateToProps)(Home))
