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
import NewsTimeline from "./NewsTimeline.png"

const HeaderDiv = styled.div`
  width: 100%;
  height: 90px;
  position: relative;
  /* outline: 2px solid salmon; */
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 1280px) {
    height: 50px;
  }
`;

const InputDiv = styled.input`
  width: 100px;
  height: 40px;
  position: absolute;
  right:180px;
  /* margin-left: auto; */
`;

const Button = styled.button`
  width: 60px;
  height: 40px;
  position: absolute;
  right: 130px;
  &:hover {
    cursor: pointer;
  }
`;

const SavedButton = styled.button`
  width: 100px;
  height: 40px;
  position: absolute;
  right: 30px;
  &:hover {
    cursor: pointer;
  }
`;

const NewsTimeLineLogo = styled(Link)`
  font-family: "Vollkorn", serif;
  font-size: 50px;
  font-weight: 700;
  color: #000000;
  text-decoration: none;
  @media screen and (max-width: 1280px) {
    font-size: 35px;
  }
`;

const LogInBtn = styled.button`
  position: absolute;
  left: 80px;
`;

const MemberBtn = styled.button`
  position: absolute;
  left: 130px;
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
      <Link to="./account">
        <LogInBtn>登入</LogInBtn>
      </Link>
      <Link to="./member">
        <MemberBtn>會員頁</MemberBtn>
      </Link>
      <NewsTimeLineLogo to="/">News Timeline</NewsTimeLineLogo>
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
