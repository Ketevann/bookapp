const INITIAL_STATE = { email: '', password: '', passwordConfirm: '', error: '', loading: false, loggedIn: false, userId: '',
forgotError: '',
loadingCreditionals:true, sentMessage: null };
import {
  EMAIL_CHANGED, PASSWORD_CHANGED, LOGIN_USER_SUCESS, LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGGEDIN,
  NOTLOGGEDIN,
  FORGOT,
  PASSWORD_CONFIRM,
  CLEARFORM,
  FORGOT_FAIL,
  FORGOT_SUCCESS
} from '../actions/action-types';

export default (auth = INITIAL_STATE, action) => {
  switch (action.type) {
    case EMAIL_CHANGED:
      return { ...auth, email: action.payload };
    case PASSWORD_CHANGED:
      return { ...auth, password: action.payload };
    case PASSWORD_CONFIRM:
      return { ...auth, passwordConfirm: action.payload };
    case LOGIN_USER_SUCESS:
      return { ...auth, userId: action.payload.uid, loadingCreditionals:false };//added credential variable for spinner
    case LOGIN_USER_FAIL:
      return { ...auth, error: action.error, loading: false };
    case LOGIN_USER:
      return { ...auth, loading: true, error: '' };
    case LOGGEDIN:
      return { ...auth,loggedIn: true, userId: action.payload,  loadingCreditionals:false, loading:false };//terminate loading credentials
    case NOTLOGGEDIN:
      return { ...auth, loggedIn: false, loadingCreditionals:false ,  userId:null};//terminate loading credentials
    case FORGOT:
      return { ...auth, email: '', forgotError: '', sentMessage: null };
    case CLEARFORM:
        return { ...auth, email:'', password: '', passwordConfirm: '', error:'', sentMessage: null };
    case  FORGOT_FAIL:
        return {...auth, forgotError: action.error, sentMessage: null}
    case  FORGOT_SUCCESS:
      return {...auth, sentMessage: 'Reset instructions have been sent to your email'}
    default:
      return auth;
  }
}
