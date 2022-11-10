import React, { useState, useRef, useContext } from "react";
import styled from "styled-components";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";

const HeaderDiv = styled.div`
  width: 100%;
  height: 90px;
  outline: 2px solid salmon;
  display: flex;
`;

const InputDiv = styled.input`
  width: 100px;
  height: 40px;
`;

const Button = styled.button`
  width: 60px;
  height: 40px;
  &:hover {
    cursor: pointer;
  }
`;

const SavedButton = styled.button`
  width: 100px;
  height: 40px;
  &:hover {
    cursor: pointer;
  }
`;

function Header({
  keyword,
  setKeyword,
}: {
  keyword: string;
  setKeyword: Function;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { userState } = useContext(AuthContext);

  async function savedKeywords(keyword:string) {
    if (!inputRef.current?.value.length) return

    const useRef = doc(db, "users", userState.uid);
    await updateDoc(useRef, {
      savedKeyWords:arrayUnion(keyword)
    });
    inputRef.current.value=""
  }

  return (
    <HeaderDiv>
      <InputDiv ref={inputRef} />
      <Button
        onClick={() => {
          setKeyword(inputRef.current!.value);
        }}
      >
        Search
      </Button>
      <SavedButton onClick={() => {savedKeywords(inputRef.current!.value)}}>儲存關鍵字</SavedButton>
    </HeaderDiv>
  );
}

export default Header;
