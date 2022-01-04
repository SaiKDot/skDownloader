import * as consts from '../Actions/types'

const initial_state = {
  currentList: 'active',
}
export default (state = initial_state, actions) => {
  switch (actions.type) {
    case consts.FETCH_LIST:
      return { ...state, download_list: actions.payload }
      break
    default:
      return state
      break
  }
}
