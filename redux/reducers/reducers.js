
import * as types from '../actions/action-types';

 const reducers = (state = initialState, action) => {

    switch (action.type) {

        case types.GET_BOOKLIST_DATA_RECIEVED:
            console.log("GET_BOOKLIST_DATA_RECIEVED");
            return Object.assign({}, state, {
                bookListData: action.data,  
            })
        case types.DEFAULT_BOOKLIST_DATA_RECIEVED:
            console.log("DEFAULT_BOOKLIST_DATA_RECIEVED");
            return Object.assign({}, state, {
                defaultBookList: action.data,  
            })

        
            
        default:
            return state
    }
}

export default reducers