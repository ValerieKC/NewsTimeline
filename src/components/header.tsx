import React ,{useState} from "react"
import styled from "styled-components"
import SearchInput from "../utils/search"

const HeaderDiv = styled.div`
  width: 100%;
  height: 90px;
  outline: 2px solid salmon;
`;

function Header(){
  return(
    <HeaderDiv>
<SearchInput />
      </HeaderDiv>
  )
}

export default Header