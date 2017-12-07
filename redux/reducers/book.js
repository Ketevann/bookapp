import {
  BOOK_SAVED,
  BOOK_NOT_SAVED,
  BOOK_SUGGESTIONS_DATA_RECIEVED
} from '../actions/action-types'

const INITIAL_STATE = { saved:null, bookSuggestions:null, error:''}

export default (book = INITIAL_STATE, action) => {
  switch (action.type) {
    case BOOK_SAVED:
      return {...book, saved: true }
    case BOOK_NOT_SAVED:
      return {...book, saved: false, error: 'error saving book'}
    case BOOK_SUGGESTIONS_DATA_RECIEVED:
      return {...book, bookSuggestions: action.payload }
    default:
      return book
  }
}
