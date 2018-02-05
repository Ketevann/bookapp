import {
  BOOK_SAVED,
  BOOK_NOT_SAVED,
  BOOK_SUGGESTIONS_DATA_RECIEVED,
  BOOK_SEARCH,
  READ,
  CHANGE_SEARCH,
  SEARCH_TYPE,
  GET_SAVED_BOOK,
  CLEAR,
  LOAD_SAVED_BOOKS,
  BOOK_SEARCH_CLEAR,
  LOADING,
  SEARCH_QUERY_SUCCESS,
  SEARCH_BOOKS_CLEAR,
  SEARCH_PARAMS_CLEAR,
  SAVED_ERR,
  DISPLAY_ERR,
} from '../actions/action-types';

const INITIAL_STATE = { saved: null, bookSuggestions: null, errorActive: false , duplicateTitle:'', error: '', searchbooks: '', similarbooks: null, booksbool: true, authors: false, placeholder: 'books', savedBooks: [], user: null, read: false, loading: true, loadingSavedBook: false, searchQuery:null }

export default (book = INITIAL_STATE, action) => {
  switch (action.type) {
    case BOOK_SAVED:
      return { ...book, saved: true };
    case BOOK_NOT_SAVED:
      return { ...book, saved: false, error: 'error saving book' };
    case BOOK_SUGGESTIONS_DATA_RECIEVED:
      return { ...book, bookSuggestions: action.payload };
    case CHANGE_SEARCH:
      return { ...book, searchbooks: action.payload };
    case BOOK_SEARCH:
      return { ...book, similarbooks: action.payload, loadingSavedBook: false };
    case SAVED_ERR:
      return { ...book, error: 'already exists in saved books', duplicateTitle: action.payload };
    case DISPLAY_ERR:
      return { ...book, errorActive:action.payload };
    case SEARCH_TYPE:
      return { ...book, booksbool: true, authors: false, placeholder: action.query };
    case GET_SAVED_BOOK:
      return { ...book, loading: false, savedBooks: action.payload, user: action.user };//when saved books are loaded, loading = false
    case READ:
      let newBook = { ...book };
      let newSavedBooks = newBook.savedBooks.map(element => {
        if (element.title === action.title) {
          element.read = action.payload;
        }
        return book;
      });
      return { ...book, savedBooks: newSavedBooks };
    case CLEAR:
      return { ...book, savedBooks: null };
    case BOOK_SEARCH_CLEAR:
      return { ...book, similarbooks: null };
    case LOAD_SAVED_BOOKS:
      return { ...book, loadingSavedBook: true, similarbooks: null };
    case LOADING:
      return { ...book, loading: true };//upates to true when user is reloading saved books or loading searched books results 
    case SEARCH_QUERY_SUCCESS:
      return { ...book, searchQuery: action.payload, loading:false } //sets searched books to state 
    case SEARCH_PARAMS_CLEAR:
      return { ...book, /*placeholder: "books". */ searchbooks:'' }//clearing search bar
    case SEARCH_BOOKS_CLEAR:
      return {...book, searchQuery:'' , searchbooks:''}//clearing search book results
    default:
      return book;
  }
}
