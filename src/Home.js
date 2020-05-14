import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
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
        <Post/>
      </div>
    );
  }
 }
}
export default withRouter(connect(mapStateToProps)(Home))
