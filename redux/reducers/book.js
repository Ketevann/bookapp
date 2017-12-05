import {
  BOOK_SAVED_SUCESSFULLY,
  BOOK_NOT_SAVED,
  GET_BOOKLIST_DATA_RECIEVED,
  DEFAULT_BOOKLIST_DATA_RECIEVED
} from '../actions/action-types'

const INITIAL_STATE = { saved:null, bookListData:null, defaultBookList:null, error:''}

export default (book = INITIAL_STATE, action) => {
  console.log(action, 'ACTIONNN');
  switch (action.type) {
    case BOOK_SAVED_SUCESSFULLY:
      return {...book, saved: true }
    case BOOK_NOT_SAVED:
      return {...book, saved: false, error: 'please login'}
    case GET_BOOKLIST_DATA_RECIEVED:
      // console.log("GET_BOOKLIST_DATA_RECIEVED");
      return {...book, bookListData: action.payload }
    case DEFAULT_BOOKLIST_DATA_RECIEVED:
      // console.log("DEFAULT_BOOKLIST_DATA_RECIEVED");
      return {...book, defaultBookList: action.payload }
    default:
      return book
  }
}
