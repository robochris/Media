
const session = (state={}, action) => {
  switch (action.type) {
    case 'LOGIN_LOADING':
      return {loginLoading: true}
    case 'LOGIN_SUCCESS':
      return {
        loginLoading: false,
        user: action.user
      }
    case 'LOGIN_ERROR':
      return {
        loginLoading: false,
        error: true,
        loginText: action.err,
      }
    default:
      return {}
  }
}

export default session
