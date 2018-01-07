import {
  TOGGLE_CAMERAROLL
} from '../actions/action-types'

const INITIAL_STATE = {showComponent: false }

export default (cameraRoll = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_CAMERAROLL:
      return {...cameraRoll, showComponent: action.payload }

    default:
      return cameraRoll
  }
}
