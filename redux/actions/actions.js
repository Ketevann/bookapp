import * as types from './action-types';

export const getBookListDataRedux = (title) => {
  console.log("getBookListDataRedux",title);
  return {
    type: 'GET_BOOKLIST_DATA',
    title:title
  };
};



export const loadDefaultBookListData = (bookList) => {
  console.log("loadDefaultBookListData",bookList);
  return {
    type: 'LOAD_DEFAULT_BOOKLIST_DATA',
    defaultBookList:bookList
  };
};

