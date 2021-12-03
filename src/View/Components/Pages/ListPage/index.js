import React, { useEffect, useRef, useState, useCallback,useLayoutEffect } from 'react'
import Draggable from 'react-draggable'
import _ from 'underscore'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import SplitPane from 'react-split-pane'
import styled from 'styled-components'
import moment from 'moment'

import ListBody from './ListBody'
import ListHeader from './ListHeader'
import SidePanel from './SidePanel'
import Header from '../../Header'
import NewTaskModal from '../../Modal/NewTaskModal'
import { changeHeaderWidth, changePanelWidth } from '../../../Actions'

import 'react-virtualized/styles.css'
import 'react-resizable/css/styles.css'

import Dropper from './Dropper'

const ListPage = (props) => {
  const dispatch = useDispatch()

 
  const [width, setWidth] = useState(sidePanel_width)

  const sidePanel_width  = useSelector((state) => state.ui.sidePanel_width)
  const header_ = useSelector((state) => state.ui.header_)
  const containerRef = useRef(null) 
 
  useEffect(() => {
    setWidth(sidePanel_width)
     
  }, [sidePanel_width])

  return (
    <Container>
      <NewTaskModal />
      <Header />

      <ListContainer ref={containerRef}>
        <SplitPane
          split="vertical"
          minSize={75}
          defaultSize={sidePanel_width}
          maxSize={200}
          onDragFinished={(size) => dispatch(changePanelWidth(size))}
          className={sidePanel_width == 0 ? 'soloPane1' : ''}
          allowResize={sidePanel_width == 0 ? false : true}
          //onDragFinished={(size) => setWidth(prev => size)}
        >
          <SidePanel />

          <ListPanel width={width}>
            <Xcontainer>
              <ListHeader header_={header_} />
              <ListBody />
            </Xcontainer>
          </ListPanel>
        </SplitPane>
      </ListContainer>
    </Container>
  )
}

const Container = styled.div`
  background-color: #fff;
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`
const ListContainer = styled.div`
  height: calc(100% - 45px);
  width: 100%;
  position: absolute;
  top: 45px;
`
const ListPanel = styled.div`
  /* width: calc(100% - ${(props) => props.width}px); */
  height: 100%;
  /* width : ${({ width }) => width}; */
  display: inline-block;
  overflow-x: scroll;
  overflow-y: hidden;
  width: calc(100vw - ${(props) => props.width}px);
`

const Xcontainer = styled.div`
  
  height: 100%;  
  max-width: fit-content;
  display: inline-flex;
  flex-direction: column;
`



export default ListPage
