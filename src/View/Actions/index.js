import * as consts from './types'

export const changeHeaderWidth = (id, neWidth) => {
 
  return { type: consts.CHANGE_HEADER_WIDTH, payload: { id, neWidth } }
}

export const changePanelWidth = (width) => {
  return{type:consts.CHANGE_SIDE_PANEL_WIDTH, payload: width}
}

export const changeHeaderIcon = (id, status) => {
  return {type:consts.CHANGE_HEADER_BUTTON_STATUS, payload:{id:id , status: status}}
}

export const toggleSidePanel = () => {
  return {type:consts.TOGGLE_SIDEPANEL}
}

export const unSelectAll = () => {
  return { type: consts.UNSELECT_ALL_ITEM }
}
export const setSelected = (id) => {
  return { type: consts.SELECT_ITEM , payload: id}
}

export const sortColumn = (id) => {
  return {type: consts.SORT_COLUMN, payload: id}
}

export const setDownloadList = (list) => {
  return { type: consts.STORE_DOWNLOAD_LIST , payload: list}
}