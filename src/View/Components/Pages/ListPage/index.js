import React, { useEffect, useRef, useState, useCallback } from 'react'
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
import { changeHeaderWidth, changePanelWidth } from '../../../Actions'

import 'react-virtualized/styles.css'
import 'react-resizable/css/styles.css'

import Dropper from './Dropper'

const ListPage = (props) => {
  const dispatch = useDispatch()
  const sidePanel_width  = useSelector((state) => state.ui.sidePanel_width)
  const [dragOn, setDragOn] = useState(false)

   

  return (
    <Container>
      
      <Dropper disp={dragOn} />
      <Header />
      <ListContainer>
        <SplitPane
          split="vertical"
          minSize={80}
          defaultSize={sidePanel_width}
          maxSize={200}
          onDragFinished={(size) => dispatch(changePanelWidth(size))}
        >
          <SidePanel />

          <ListPanel>
            <ListHeader />
            <ListBody />
          </ListPanel>
        </SplitPane>
      </ListContainer>
    </Container>
  )
}

const Container = styled.div`
  background-color: #ffffff;
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
`

export default ListPage
