import React, { useState, useRef, useContext, useEffect, useCallback } from "react";
import styled from "styled-components";
import { setDoc, doc, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";

const PortalComment = styled.div`
  width: 100%;
  position: sticky;
  bottom: 0;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0px -2px 5px 0px rgba(219, 203, 203, 0.75);
  -webkit-box-shadow: 0px -2px 5px 0px rgba(219, 203, 203, 0.75);
  -moz-box-shadow: 0px -2px 5px 0px rgba(219, 203, 203, 0.75);  
`;

const PortalCommentInput = styled.textarea.attrs({
  type: "textarea",
})`
  width: 100%;
  height: 100%;
  padding: 0 120px 0 10px ;
  position: relative;
  border: none;
  /* outline: 1px soild salmon; */
  background-color: #f1eeed;

  font-size: 16px;
  line-height: 28px;
  resize: none;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  &:focus {
    outline: none;
    border: 1px solid #000000;
  }
`;

const PortalCommentBtn = styled.button`
  width: 100px;
  position: absolute;
  right: 15px;
  transform: translateY(100%);
  padding: 8px 15px px;
  border: none;
  color: #000000;
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
  
  const portalInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [textDisabled, setTextDisable] = useState<boolean>(false);

  useEffect(() => {
    if (!userState.logIn) {
      setTextDisable(true);
    }else{
      setTextDisable(false);
    }
  }, [userState.logIn]);

console.log("ModalComment")

const postComment = useCallback(() => {
  function postingComment() {
    if (!portalInputRef.current?.value.trim()) {
      alert("請輸入標題及訊息");
      return;
    }
        console.log("inside postComment func");

    if (userState.uid) {
      const getIdRef = doc(collection(db, "comments"));
      setDoc(doc(db, "comments", getIdRef.id), {
        commentUid: getIdRef.id,
        newsArticleUid: articleId,
        authorUid: userState.uid,
        authorEmail: userState.email,
        authorDisplayName: userState.displayName,

        commentContent: portalInputRef.current?.value,
        publishedTime: new Date(),
      });
    }
    portalInputRef.current.value = "";
  }
  postingComment();
}, [articleId, userState.displayName, userState.email, userState.uid]);
  

   useEffect(() => {
     function keyDownPostEvent(e: KeyboardEvent) {
       if (e.key === "Enter") {
         // if (!portalInputRef) return;
        //  console.log("inside eventHandler");
         postComment();
       }
     }

     window.addEventListener("keydown", keyDownPostEvent);
     return () => window.removeEventListener("keydown", keyDownPostEvent);
   }, []);

  return (
    <PortalComment>
      {/* <PortalCommentInputTitle
        placeholder={"標題"}
        maxLength={50}
        ref={portalInputTitleRef}
        disabled={textDisabled}
      ></PortalCommentInputTitle> */}
      <PortalCommentInput
        placeholder={textDisabled ? "登入會員才可留言" : "我的看法"}
        ref={portalInputRef}
        disabled={textDisabled}
       /> 
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
