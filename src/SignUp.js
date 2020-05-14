import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { registerUser } from './Redux/Actions'
import './App.css';

const mapDispatchToProps = {
  registerUser
}

class SignUp extends Component {
  constructor(props){
  super(props);
  this.state={
      username:'',
      password:'',
      email:'',
  }
 }

 handleClick() {
   console.log(this.state)
   this.props.registerUser(this.state.username, this.state.password, this.state.email)
   this.props.history.push('/')
 }

 render() {
  return (
      <div>
        <input label="Login" id="login" onChange={(event) => this.setState({username:event.target.value})}/>
        <br/>
        <input label="Password" id="password" onChange={(event) => this.setState({password:event.target.value})}/>
        <br/>
        <input label="Email" id="email" onChange={(event) => this.setState({email:event.target.value})}/>
        <br/>
        <button onClick={() => this.handleClick()}>Sign-up</button>
        <button onClick={() => this.props.history.push('/login')}>Login</button>
      </div>
  );
 }
}
export default withRouter(connect(undefined, mapDispatchToProps)(SignUp))
