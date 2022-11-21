import React, { useState, useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { setDoc, doc, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";

const PortalComment = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
`;

const PortalCommentTitle = styled.div`
font-weight:bold;`;

const PortalCommentInputTitle = styled.textarea.attrs({
  type: "textarea",
})`
  /* max-width: 1200px; */
  width: 100%;
  height: 28px;
  padding: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  border: solid 1px #979797;
  font-size: 16px;
  line-height: 28px;
  resize: none;
  overflow-y: hidden;
  &:focus{
    outline:none;
    border:1px solid #000000;
  }
`;

const PortalCommentInput = styled.textarea.attrs({
  type: "textarea",
})`
  width: 100%;
  height: 100%;
  padding: 0 10px;
  border-radius: 8px;
  border: solid 1px #979797;
  font-size: 16px;
  line-height: 28px;
  resize: vertical;
  overflow-y: hidden;
  &:focus {
    outline: none;
    border: 1px solid #000000;
  }
`;

const PortalCommentBtn = styled.button`
  width: 100px;
  border: none;
  color:#000000;
  background-color: #dfdbdb;
  &:hover {
    cursor: pointer;

    background-color: #d4b9a1;
    font-weight: bold;
  }
`;

// const postBtn=

function ModalComment({ articleId }: { articleId: string }) {
  const { userState } = useContext(AuthContext);
  const portalInputTitleRef = useRef<HTMLTextAreaElement | null>(null);
  const portalInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [textDisabled, setTextDisable] = useState<boolean>(false);

  useEffect(() => {
    if (!userState.logIn) {
      setTextDisable(true);
    }else{
      setTextDisable(false);
    }
  }, [userState.logIn]);


  function postComment() {
    if (
      !portalInputTitleRef.current?.value.length ||
      !portalInputRef.current?.value.length
    ) {
      alert("請輸入標題及訊息");
      return;
    }
    if (userState.uid) {
      const getIdRef = doc(collection(db, "comments"));
      setDoc(doc(db, "comments", getIdRef.id), {
        commentUid: getIdRef.id,
        newsArticleUid: articleId,
        authorUid: userState.uid,
        authorEmail: userState.email,
        authorDisplayName: userState.displayName,
        commentTitle: portalInputTitleRef.current?.value,
        commentContent: portalInputRef.current?.value,
        publishedTime: new Date(),
      });
    }
    portalInputTitleRef.current.value = "";
    portalInputRef.current.value = "";
  }

  useEffect(() => {
    function keyDownPostEvent(e: KeyboardEvent) {
      if (!portalInputTitleRef) return;
      if (e.key === "Enter") {
        postComment();
      }
    }

    window.addEventListener("keydown", keyDownPostEvent);
    return () => window.removeEventListener("keydown", keyDownPostEvent);
  }, []);

  return (
    <PortalComment>
      <PortalCommentTitle>留言區</PortalCommentTitle>
      <PortalCommentInputTitle
        placeholder={"標題"}
        maxLength={50}
        ref={portalInputTitleRef}
        disabled={textDisabled}
      ></PortalCommentInputTitle>
      <PortalCommentInput
        placeholder={textDisabled ? "登入會員才可留言" : "我的看法"}
        ref={portalInputRef}
        disabled={textDisabled}
      ></PortalCommentInput>
      <PortalCommentBtn
        disabled={textDisabled}
        onClick={() => {
          postComment();
        }}
      >
        送出
      </PortalCommentBtn>
    </PortalComment>
  );
}

export default ModalComment;
