import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  useCallback,
} from "react";
import styled from "styled-components";
import { setDoc, doc, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";
import Swal from "sweetalert2";

const PortalComment = styled.div`
  width: 100%;
  height: 50px;
  position: sticky;
  bottom: 0;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0px -2px 5px 0px rgba(219, 203, 203, 0.75);
  -webkit-box-shadow: 0px -2px 5px 0px rgba(219, 203, 203, 0.75);
  -moz-box-shadow: 0px -2px 5px 0px rgba(219, 203, 203, 0.75);
`;

const PortalCommentInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 10px 140px 10px 60px;
  position: relative;
  border: none;
  background-color: #ffffff;
  font-size: 16px;
  line-height: 30px;
  font-family: "Noto Sans TC", sans-serif;
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
  width: 76px;
  height: 36px;
  border-radius: 8px;
  color: #383838;
  position: absolute;
  right: 60px;
  border: none;
  font-size: 16px;
  font-family: "Noto Sans TC", sans-serif;
  &:hover {
    background-color: #000000;
    color: #ffffff;
    cursor: pointer;
  }

  @media screen and (max-width: 1280px) {
    width: 64px;
    height: 34px;
    border-radius: 5px;
    font-size: 12px;
  }
`;

function ModalComment({ articleId }: { articleId: string }) {
  const { userState } = useContext(AuthContext);

  const portalInputRef = useRef<HTMLInputElement | null>(null);
  const [textDisabled, setTextDisable] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!userState.logIn) {
      setTextDisable(true);
    } else {
      setTextDisable(false);
    }
  }, [userState.logIn]);

  const postComment = useCallback(() => {
    function postingComment() {
      if (!portalInputRef.current?.value.trim()) {
        // alert("請輸入標題及訊息");
        Swal.fire({
          title: "Error!",
          text: "請輸入標題及訊息",
          icon: "error",
          confirmButtonText: "知道了",
        });
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

  return (
    <PortalComment>
      <PortalCommentInput
        placeholder={textDisabled ? "登入會員才可留言" : "我的看法"}
        ref={portalInputRef}
        disabled={textDisabled}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            postComment();
          }
        }}
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
