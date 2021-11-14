import React, {useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { ResizableBox  } from 'react-resizable'
 
 
import { changeHeaderWidth, sortColumn } from '../../../Actions'
 
import { SortDirection } from 'react-virtualized'

const ListHeader = props => {
const dispatch = useDispatch()
let headerRef = useRef(new Array())
const {header_} = useSelector((state) => state.ui)

 useEffect(() => {
      console.log('Header')
     
  },[]  )
const onResize = ( e, {event, node, size}) => {
  console.log(size.width);
  dispatch(changeHeaderWidth(node.id, size.width))
}
const handleDrag = (ev) => {
  console.log('re');
}
const handleSort = id => {
  dispatch(sortColumn(id))
}

 return (
   <HeaderBody>
     {header_
       
       .map((header) => {
         const getRef = (element) => headerRef.current.push(element)
         return (
           <ResizableBox
             axis="x"
             width={header.width}
             height={20}
             key={header.id}
             handle={<DragHandle id={header.id} />}
             onResize={onResize}
             minConstraints={[50, 20]}
             maxConstraints={[300, 20]}
           >
             <Header
               key={header.id}
               width={header.width}
               handleDrag={handleDrag}
               onClick={handleSort(header.id)}
             >
               <HeaderText ref={getRef}>{header.name}</HeaderText>
             </Header>
           </ResizableBox>
         )
       })}
   </HeaderBody>
 ) 
}


const HeaderBody = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  & > * {
    flex: 0 0 auto;
  }
  height: 20px;
  border-bottom: 1px solid #666666;
  
`
export const Header = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  &::after {
    font-family: FontAwesome;
    content: '\f0dc';
    position: absolute;
    right: 8px;
    color: #999;
  }
`
export const HeaderText = styled.div`
  display: flex;
  vertical-align: middle;
  pointer-events: none;
  user-select: none;
  flex: auto;
  margin-left: 8px;
  /*justify-content: center; */ /* align horizontal */
  align-items: center; /* align vertical */
  display: inline-flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const DragHandle = styled.div`
  /* position: relative;
  top: 0;
  height: 100%;
  width: 2px;
  cursor: w-resize;
  background-color: darkgray;
  align-self: flex-end;
  margin-left: auto; */

  position: absolute;
  width: 2px;
  height: 100%;
  bottom: 0;
  right: 0px;
  cursor: col-resize;
  background: darkgray;
  z-index: 999;
`
export default ListHeader

 