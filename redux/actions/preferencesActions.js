import { 
    UPDATE_TITLE,
    UPDATE_AUTHOR,
    UPDATE_GENRE
} from './action-types'

console.log('PREFERENCES CHANGED!!!');

export const updatedTitle = (title) => {
  console.log('UPDATE TITLE',title);
  return {
    type: UPDATE_TITLE,
    payload: title
  }
}

export const updatedAuthor = (author) => {
  console.log('UPDATE AUTHOR',author);
  return {
    type: UPDATE_AUTHOR,
    payload: author
  }
}

export const updatedGenre = (genre) => {
  console.log('UPDATE GENRE',genre);
  return {
    type: UPDATE_GENRE,
    payload: genre
  }
}
