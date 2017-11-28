import * as types from './action-types';

export const getBookListDataRedux = (title) => {
  console.log("getBookListDataRedux",title);
  return {
    type: 'GET_BOOKLIST_DATA',
    title:title
  };
};

