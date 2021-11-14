import * as consts from '../Actions/types'
 const initial_state = {
   context_menu_display: false,
   cm_xPos: 0,
   cm_yPos: 0,
   dummy: false,
   defaultSidePanelWidth: 75,
   selectedItems: [],
   sidePanel_width: 75,
   columnSort: {column: 'name', sortBy: 'ASC'},
   headerButtons: [
     {
       id: 'add',
       image: 'Add',
       image_disabled: '',
       text: 'Add URL',
       disabled: false,
     },
     {
       id: 'resume',
       image: 'Resume',
       image_disabled: 'Resume_D',
       text: 'Resume',
       disabled: true,
     },
     {
       id: 'stop',
       image: 'Stop',
       image_disabled: 'Stop_D',
       text: 'Stop',
       disabled: true,
     },
     {
       id: 'cancel',
       image: 'Cancel',
       image_disabled: 'Cancel_D',
       text: 'Stop All',
       disabled: true,
     },
     {
       id: 'delete',
       image: 'Delete',
       image_disabled: 'Delete_D',
       text: 'Delete',
       disabled: true,
     },
     {
       id: 'deleteAll',
       image: 'DeleteAll',
       image_disabled: 'DeleteAll_D',
       text: 'Delete All',
       disabled: false,
     },
   ],
   header_: [
     {
       id: 'name',
       name: 'Name',
       width: 200,
       order: 1,
     },
     {
       id: 'size',
       name: 'Size',
       width: 70,
       order: 2,
     },
     {
       id: 'status',
       name: 'Status',
       width: 150,
       order: 3,
     },
     {
       id: 'progress',
       name: 'Progress',
       width: 200,
       order: 4,
     },
     {
       id: 'lasttry',
       name: 'Last Try At',
       width: 200,
       order: 5,
     },
     {
       id: 'eta',
       name: 'Time Left',
       width: 50,
       order: 6,
     },
   ],
 }


export default (state = initial_state, actions) => {
  switch (actions.type) {
     case consts.CHANGE_HEADER_WIDTH :  return {
       ...state,
       header_: state.header_.map((item) =>
         item.id === actions.payload.id
           ? // transform the one with a matching id
             { ...item, width: actions.payload.neWidth }
           : // otherwise return original todo
             item
       ),
     } 
       
     break;
    case consts.CHANGE_SIDE_PANEL_WIDTH : return {
      ...state, sidePanel_width : actions.payload
    }
    break
    case consts.CHANGE_HEADER_BUTTON_STATUS : {
       
       return {
         ...state,
         headerButtons: state.headerButtons.map((item) =>
           item.id === actions.payload.id
             ? // transform the one with a matching id
               { ...item, disabled: actions.payload.status }
             : // otherwise return original todo
               item
         ),
       }
    }
    break
    case consts.TOGGLE_SIDEPANEL : return { ...state, sidePanel_width : 0}
    break;
    case consts.SELECT_ITEM : {
      return { ...state, selectedItem : actions.payload}
    }
    break
    case consts.UNSELECT_ALL_ITEM: {
      return {...state , selectedItem: null}
    }
    break
    default: return state;
  }
}
