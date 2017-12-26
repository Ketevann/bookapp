import {
  BOOK_SAVED,
  BOOK_NOT_SAVED,
  BOOK_SUGGESTIONS_DATA_RECIEVED,
  BOOK_SEARCH,
  CHANGE_SEARCH,
  BOOK_BOOL,
  AUTHOR_BOOL,
  GET_SAVED_BOOK,
  CLEAR
} from '../actions/action-types'

const INITIAL_STATE = { saved:null, bookSuggestions:null, error:'', searchbooks: '', similarbooks: '', booksbool: true, authors: false, placeholder: 'books', savedBooks: null, user: null}

export default (book = INITIAL_STATE, action) => {
  switch (action.type) {
    case BOOK_SAVED:
      return {...book, saved: true }
    case BOOK_NOT_SAVED:
      return {...book, saved: false, error: 'error saving book'}
    case BOOK_SUGGESTIONS_DATA_RECIEVED:
      return {...book, bookSuggestions: action.payload }
      case CHANGE_SEARCH:
        return {...book, searchbooks: action.payload }
        case BOOK_SEARCH:
          return  {...book, similarbooks: action.payload }
          case BOOK_BOOL:
          return  {...book,booksbool: true, authors:false,placeholder: 'books'}
          case AUTHOR_BOOL:
          return  {...book, booksbool: false, authors:true, placeholder: 'authors'}
          case GET_SAVED_BOOK:
          case CLEAR:
            return {...INITIAL_STATE }

            return {...book, savedBooks: action.payload, user: action.user }
    default:
      return book
  }
}
