import {
  BOOK_SAVED,
  BOOK_NOT_SAVED,
  BOOK_SUGGESTIONS_DATA_RECIEVED,
  BOOK_SEARCH,
  READ,
  CHANGE_SEARCH,
  BOOK_BOOL,
  AUTHOR_BOOL,
  GET_SAVED_BOOK,
  CLEAR,
  LOAD_SAVED_BOOKS,
  BOOK_SEARCH_CLEAR
} from '../actions/action-types'

const INITIAL_STATE = { saved:null, bookSuggestions:null, error:'', searchbooks: '', similarbooks: null, booksbool: true, authors: false, placeholder: 'books', savedBooks: [], user: null, read:false, loading: true}

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
            return {...book, savedBooks: action.payload, user: action.user }
            case READ:
             let newBook = { ...book };
             console.log(action.title, ' title')
               let newSavedBooks = newBook.savedBooks.map(book =>{
                 if (book.title === action.title ){
                   console.log('equal')
                   book.read = action.payload;
                 }
                 return book;
               })
              return {...book, savedBooks: newSavedBooks}
            case CLEAR :
               return {...book, savedBooks: null }
               case BOOK_SEARCH_CLEAR:
          return  {...book, similarbooks: null }
            case LOAD_SAVED_BOOKS:
              return {...book, loading: action.payload };

    default:
      return book
  }
}
