import React from 'react'
import styled from 'styled-components'

const Dropper = props => {


  return(
    <Container disp={props.disp}><h1>DROP FILE</h1></Container>
  )
}

const Container = styled.div`
  display: ${(props) => props.disps ? 'flex' : 'none'};
  position: absolute;
  height:100%;
  width: 100%;
   
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: saturate(180%) blur(10px);
  margin-top: auto;
  margin-bottom: auto;
  z-index: 9999;
  align-content: center;
  justify-content: center;
   & > h1 {
     align-self : center;
     color : #fff;

   }
`

export default Dropper 