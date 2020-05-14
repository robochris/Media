import axios from 'axios'


export const LOGIN_LOADING = 'LOGIN_LOADING'
function loginLoading() {
  return {
    type: LOGIN_LOADING
  }
}
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
function loginSucess(user) {
  return {
    type: LOGIN_SUCCESS,
    user
  }
}
export const LOGIN_ERROR = 'LOGIN_ERROR'
function loginError(err) {
  return {
    type: LOGIN_ERROR,
    err
  }
}

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
function logoutSuccess(){
  return {
    type: LOGOUT_SUCCESS,
    user: false
  }
}


export function loginUser(username, password) {
  console.log(username)
  return function(dispatch) {
    dispatch(loginLoading())
    return axios.post('http://localhost:6969/login', {username,password})
    .then(function(res){
      console.log(res.data)
      if(res.data.error === "LOGIN_ERROR") {
        dispatch(loginError(res.data.error))
      } else {
        dispatch(loginSucess(res.data))
      }
    })
    .catch(function(err){
        dispatch(loginError(err))
    });
  }
}

export function registerUser(username, password, email) {
  console.log("test")
  return function(dispatch) {
    dispatch(loginLoading())
    return axios.post('http://localhost:6969/register', {username,password,email})
    .then(function(res){
      console.log(res.data)
      if(res.data.error === "LOGIN_ERROR") {
        dispatch(loginError())
      } else {
        dispatch(loginSucess(res.data))
      }
    })
    .catch(function(err){
        dispatch(loginError(err))
    });
  }
}

export function updateUser(user) {
  return function(dispatch) {
    dispatch(loginSucess(user))
  }
}

export function logout() {
  return function(dispatch) {
    dispatch(logoutSuccess())
  }
}
