import React from 'react'
import styled from 'styled-components'

const Dropper = props => {


  return (
    <Container disp={props.disp}>
      <BorderBox>
        <h1>DROP FILE</h1>
      </BorderBox>
      {/* <Acrylic/> */}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  position: absolute;
  height: 100%;
  width: 100%;

  margin-top: auto;
  margin-bottom: auto;

  align-content: center;
  justify-content: center;
  z-index: 99999;
  background: rgba(3, 3, 3, 5%);
  /* box-shadow: 0 5px 20px 0 rgb(0 0 0 / 50%); */
  backdrop-filter: blur(5px);
`
const BorderBox = styled.div`
  width: 25%;
  height: 25%;
  border: 2px dashed #333;
  align-self: center;
  display: flex;;
  align-items: center;
  justify-content: center;
  & > h1 {
    align-self: center;
    color: #333;
  }
`
const Acrylic = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  width: 100%;

`
export default Dropper 