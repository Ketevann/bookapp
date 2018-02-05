const INITIAL_STATE = { email: '', password: '', passwordConfirm: '', error: '', loading: false, loggedIn: null, userId: '', forgotError: '', loadingCreditionals:true };
import {
  EMAIL_CHANGED, PASSWORD_CHANGED, LOGIN_USER_SUCESS, LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGGEDIN,
  NOTLOGGEDIN,
  FORGOT,
  PASSWORD_CONFIRM,
  CLEARFORM,
   FORGOT_FAIL
} from '../actions/action-types';

export default (auth = INITIAL_STATE, action) => {
  switch (action.type) {
    case EMAIL_CHANGED:
      return { ...auth, email: action.payload };
    case PASSWORD_CHANGED:
      //console.log('passowrd', action)
      return { ...auth, password: action.payload };
    case PASSWORD_CONFIRM:
      return { ...auth, passwordConfirm: action.payload };
    case LOGIN_USER_SUCESS:
      return { ...auth, ...INITIAL_STATE, user: action.payload.uid, loadingCreditionals:false };//added credential variable for spinner
    case LOGIN_USER_FAIL:
      return { ...auth, error: action.error, loading: false };
    case LOGIN_USER:
      return { ...auth, loading: true, error: '' };
    case LOGGEDIN:
      return { loggedIn: true, userId: action.payload,  loadingCreditionals:false };//terminate loading credentials
    case NOTLOGGEDIN:
      return { ...auth, loggedIn: false ,  loadingCreditionals:false};//terminate loading credentials
    case FORGOT:
      return { ...auth, email: '', forgotError: '' };
    case CLEARFORM:
        return { ...auth, email:'', password: '', passwordConfirm: '', error:'' };
    case  FORGOT_FAIL:
        return {...auth, forgotError: action.error}
    default:
      return auth;
  }
}
