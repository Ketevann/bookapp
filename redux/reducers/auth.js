const INITIAL_STATE = { email: '', password: '', passwordConfirm: '', error: '', loading: false, loggedIn: null }
import {
  EMAIL_CHANGED, PASSWORD_CHANGED, LOGIN_USER_SUCESS, LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGGEDIN,
  NOTLOGGEDIN,
  FORGOT,
  PASSWORD_CONFIRM
} from '../actions/action-types'



export default (auth = INITIAL_STATE, action) => {
  console.log(action, 'ACTIONNN');
  switch (action.type) {
    case EMAIL_CHANGED:
      return { ...auth, email: action.payload };
    case PASSWORD_CHANGED:
      console.log('passowrd', action)
      return { ...auth, password: action.payload };
    case PASSWORD_CONFIRM:
      return { ...auth, passwordConfirm: action.payload };
    case LOGIN_USER_SUCESS:
      return { ...auth, ...INITIAL_STATE, user: action.payload };
    case LOGIN_USER_FAIL:
      return { ...auth, error: "Authentication Failed", loading: false };
    case LOGIN_USER:
      return { ...auth, loading: true, error: '' };
    case LOGGEDIN:
      return { loggedIn: true };
    case NOTLOGGEDIN:
      return { ...auth, loggedIn: false };
    case FORGOT:
      return { ...auth, email: '', error: '' };
    default:
      return auth
  }
}
