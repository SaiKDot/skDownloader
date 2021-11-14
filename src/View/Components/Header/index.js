import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Icon from './Icon'

 
const Header = (props) => {
   const dispatch = useDispatch()
   const { headerButtons} = useSelector((state) => state.ui)
 
   useEffect(() => {
     
   })
  
   const getButtons = () => {
     return headerButtons.map((item) => {
       return (
         <HeaderIcon
          key={item.id}
           img={<Icon type={item.image} />}
           img_D={<Icon type={item.image_disabled}/>}
           text={item.text}
           disabled={item.disabled}
         />
       )
     })
   }
  return (
    <Head>
      {getButtons()}
    </Head>
  )
}

const Head = styled.div`
  display: flex;  
  align-items: center;
  width: 100%;   
  height: 45px;
  box-shadow: 0px 0px 9px 3px rgba(41, 41, 41, 0.25);
  background-color: #F5F5F5;
`

const HeaderIcon = props => {
  
   return (
     <IconContainer disabled={props.disabled}>
       {props.disabled == false ? props.img : props.img_D}
       
       <IconText disabled={props.disabled}>{props.text}</IconText>
     </IconContainer>
   )
}

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: ${(props) => props.disabled == true ? 'f5f5f5' : '#cce8ff'};
  }
  & svg {
    width: 20px;
    height: 20px;
  }
`
// const Icon = styled.a`
//   width: 40px;
//   height: 40px;
  
//   justify-content: center;

//   display: flex;
  
//   align-items: center;
//   cursor: pointer;
 
//   &:hover {
//     background-color: ${({ theme }) => theme.link_color_hover2};
//     color: ${({ theme }) => theme.link_color_active};
//   }  
// `
const IconText = styled.span`
  text-align: center;
  font-size: 12px;
  color: ${(props) => (props.disabled ? '#555' : '#dd4b39')};
  font-weight: 600;
`
export default Header