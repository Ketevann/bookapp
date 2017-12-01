
import * as types from '../actions/action-types';

 const reducers = (state = [], action) => {

    switch (action.type) {

        case types.GET_BOOKLIST_DATA_RECIEVED:
            console.log("GET_BOOKLIST_DATA_RECIEVED");
            return Object.assign({}, state, {
                bookListData: action.data,
            })

        default:
            return state
    }
}

export default reducers
