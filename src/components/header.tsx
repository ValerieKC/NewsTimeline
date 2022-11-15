import React, { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
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
  align-items: center;
`;

const InputDiv = styled.input`
  width: 100px;
  height: 40px;
  margin-left: auto;
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

const HomeBtn = styled.button``;

const LogInBtn = styled.button``;

const MemberBtn = styled.button``;

function Header({
  keyword,
  setKeyword,
}: {
  keyword: string;
  setKeyword: Function;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { userState } = useContext(AuthContext);

  async function savedKeywords(keyword: string) {
    if (!inputRef.current?.value.length) return;

    const useRef = doc(db, "users", userState.uid);
    await updateDoc(useRef, {
      savedKeyWords: arrayUnion(keyword),
    });
    inputRef.current.value = "";
  }

  return (
    <HeaderDiv>
      <Link to="/">
        <HomeBtn>首頁</HomeBtn>
      </Link>
      <Link to="./account">
        <LogInBtn>登入</LogInBtn>
      </Link>
      <Link to="./member">
        <MemberBtn>會員頁</MemberBtn>
      </Link>
      <InputDiv ref={inputRef} />
      <Button
        onClick={() => {
          setKeyword(inputRef.current!.value);
        }}
      >
        Search
      </Button>
      <SavedButton
        onClick={() => {
          savedKeywords(inputRef.current!.value);
        }}
      >
        儲存關鍵字
      </SavedButton>
    </HeaderDiv>
  );
}

export default Header;
