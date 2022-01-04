import * as consts from './types'
 import api from '../Api'
// import Aria2 from 'aria2'
// import ws from 'ws'

 
export const fetchList = () => {
  return ( dispatch, state) => {
     api.fetchTaskList({ type: 'active' })
      .then((data) => {
       console.log(data)

       
      })
  }
}
