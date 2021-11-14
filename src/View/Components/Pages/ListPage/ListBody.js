import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'underscore'
import {List as VList, AutoSizer} from 'react-virtualized'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import ProgressBar from './ProgressBar'
import Dropper from '../../Pages/ListPage/Dropper'
import vlcIcon from '../../../Images/zip.png'
import styled from 'styled-components'
import * as moment from 'moment'
import {
  changeHeaderIcon,
  setSelected,
  setDownloadList,
} from '../../../Actions'
import listArr from '../../../list.json'


const areEqual = (prevProps, nextProps) => true
 
const StyledRow = React.memo(({ style, index, keys, item }) =>{
  const dispatch = useDispatch()
  const {header_,  selectedItem } = useSelector((state) => state.ui, _.isEqual)
  
  const handleRowClick = useCallback((id) => {
    dispatch(setSelected(id), changeHeaderIcon('delete', false))
  }, [])
    const getWidth = (id) => {
      const l = _.find(header_, function (item) {
        return item.id === id
      })
      return l.width
    }
  return (
    <Row
      key={keys}
      style={style}
      onClick={() => handleRowClick(index)}
      isSelected={selectedItem === index}
    >
      <Cell width={getWidth('name')}>
        <AvItem>
          <Av src={vlcIcon} variant={'square'} />
        </AvItem>
        <ListText primary={item.name} />
      </Cell>
      <Cell width={getWidth('size')}>
        <span>5 GB</span>
      </Cell>
      <Cell width={getWidth('status')}>
        <ListText primary={item.status} />
      </Cell>
      <Cell width={getWidth('progress')}>
        <Progress>
          <ProgressBar />
          <span> 50% </span>
        </Progress>
      </Cell>
      <Cell width={getWidth('lasttry')}>
        <ListText primary={moment(item.date).format('d-m-Y')} />
      </Cell>
    </Row>
  )
}, areEqual)
const ListBody = (props) => {
  const download_list = useSelector((state) => state.app.download_list)
  const [dragging, setDragging] = useState(false)
  const [isBusy, setBusy] = useState(true)

  const dispatch = useDispatch()
  const dropRef = useRef()
   
  //  console.log('LIST bODY')
 
 

  useEffect(() => {
        
       let div = dropRef.current
       div.addEventListener('dragenter', handleDragIn)
       div.addEventListener('dragleave', handleDragOut)
       div.addEventListener('dragover', handleDrag)
       div.addEventListener('drop', handleDrop)
       console.log('LIST bODY')
       
        

    return () => {
      div.removeEventListener('dragenter', handleDragIn)
      div.removeEventListener('dragleave', handleDragOut)
      div.removeEventListener('dragover', handleDrag)
      div.removeEventListener('drop', handleDrop)
    }
  }, [ ])
 
  
    const handleDrag = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
    const handleDragIn = (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setDragging(true)
      }
    }
    const handleDragOut = (e) => {
      e.preventDefault()
      e.stopPropagation()
       setDragging(false)       
    }
    const handleDrop = (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log(e.dataTransfer);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          e.dataTransfer.clearData()          
           setDragging(false)
        }
        if (e.dataTransfer.getData('text')) {
           console.log(e.dataTransfer.getData('text'))
        }
    }

const getView = () => {
  if(dragging) {
    return <Dropper/>
  }
  else   {
    return (
      <AutoSizer>
        {({ width, height }) => (
          <VList
            width={width}
            height={height}
            rowHeight={40}
            rowCount={listArr.length}
            rowRenderer={({ key, index, style, parent }) => {
              const item = listArr[index]
              return (
                <StyledRow style={style} index={index} key={key} item={item} />
              )
            }}
          />
        )}
      </AutoSizer>
    )
  }
  
}


  return (
    <Body
      
      ref={dropRef}
    >
      <div style={{ width: '100%', height: '100%' }}>{getView()}</div>
    </Body>
  )
}
const Body = styled.div`
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);
  /* width: calc(100% - ${props => props.width}); */
`
const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  & > div {
    flex: 0 0 auto;
  }
  background-color: ${({ isSelected }) => isSelected ? '#CCE8FF' : '#fff'};
  &:nth-child(odd) {
    background-color: ${({ isSelected }) => isSelected ? '#CCE8FF' : '#f5f5f5'};
  }
  /* &:hover {
    background-color: #cce8ff;
  } */
`
const Cell = styled.div`
  display: flex;
  flex-direction: row;
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  width: ${(props) => props.width}px;
  padding: 4px 0 4px 0;
  pointer-events: none;
  user-select : none;
  > span {
    margin-left: 8px;
  }
`
const Item = styled(ListItem)`
  padding-left: 0px;
  padding-right: 0px;
  padding: 4px 0 4px 0;
  align-items: center;
`
const AvItem = styled(ListItemAvatar)`
  min-width: auto;
  margin-top: 0px;
`
const Av = styled(Avatar)`
  width: 30px;
  height: 30px;
  & > .MuiAvatar-img {
    pointer-events: none;
  }
`

const ListText = styled(ListItemText)`
  & .MuiListItemText-primary {
    /* display: inline-flex; */

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 8px;
    pointer-events: none;
  }
`
const Progress = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  pointer-events: none;
  & > span {
    font-size: 12px;
  }
`
export default ListBody
