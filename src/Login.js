import React, {Component} from 'react';
import './App.css';
import { withRouter } from 'react-router-dom';
import Home from './Home.js'
import axios from 'axios'
import SingUp from './SignUp'
import { connect } from 'react-redux'
import { loginUser } from './Redux/Actions'
import io from "socket.io-client";


const mapDispatchToProps = {
  loginUser
}

const setSocket = async (userId, socket) => {
  socket.emit("updateUserSocket", {
    userId
  });
}

const mapStateToProps = (state) => ({
  loginError: state.session.error,
  user: state.session.user
})

class Login extends Component {
  constructor(props){
  super(props);
  this.state={
    username:'',
  password:'',
  UserError: false,
  PasswordError: false
  }
 }

 handleClick(history){
   if (this.state.username !== '' && this.state.password !== '') {
    this.setState({UserError:false})
    this.setState({PasswordError:false})
    this.props.loginUser(this.state.username, this.state.password)
    .then(()=>{
      if(this.props.loginError){
        this.setState({UserError:true})
        this.setState({PasswordError:true})
      } else {
        setSocket(this.props.user._id, this.props.user.socket)
        history.push('./')
      }
    })
  } else {
    if(this.state.username === '') {
      this.setState({UserError:true})
    }
    if(this.state.password === '') {
      this.setState({PasswordError:true})
    }
  }
    history.push('./login')
 }

 testClick(props) {
   console.log(props.history)
 }

 render() {
  const history=this.props.history
  return (
      <div>
        <div className="loginContainer">
         <input label="Username" id="username" onChange={(event) => this.setState({username:event.target.value})}/>
         <br/>
         <input label="Password" id="password" onChange={(event) => this.setState({password:event.target.value})}/>
         <br/>
         <button onClick={() => this.handleClick(history)}>Login</button>
         <button onClick={() => history.push('/SignUp')}>Sign-Up</button>
        </div>
      </div>
  );
 }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
