import React, { useState, useRef } from "react";
import styled from "styled-components";
// import { SearchKeyword } from "../pages/home";

const HeaderDiv = styled.div`
  width: 100%;
  height: 90px;
  outline: 2px solid salmon;
`;

const InputDiv = styled.input`
  width: 100px;
  height: 40px;
`;

const Button = styled.button`
  width: 60px;
  height: 40px;
`;




function Header({keyword,setKeyword}:{keyword:any,setKeyword:any}) {
    const inputRef = useRef<any>("");
    
  return (
    <HeaderDiv>
      <InputDiv ref={inputRef} />
      <Button onClick={()=>{setKeyword(inputRef.current.value);}}>
        Search
      </Button>
    </HeaderDiv>
  );
}

export default Header;
