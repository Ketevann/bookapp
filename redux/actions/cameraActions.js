import {

  TOGGLE_CAMERAROLL
} from '../actions/action-types'


 const toggleCameraRoll = (bool) => ({type: TOGGLE_CAMERAROLL, payload: bool})

export const dispatchCamera = (bool,dispatch) =>
  dispatch =>
    dispatch(toggleCameraRoll(bool))
