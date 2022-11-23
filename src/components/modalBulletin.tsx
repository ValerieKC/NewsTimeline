import React, { useRef, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  DocumentData,
  QuerySnapshot,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";
import Bin from "./bin.png";
import timestampConvertDate from "../utils/timeStampConverter";

const ModalBulletinBoard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
 background-color: #ffffff;
`;

const ModalBulletinTitle = styled.div`
  padding: 5px 0 5px 15px;
  font-weight: bold;
  border-bottom: 1px solid #00000050;
`;
const ModalBulletinContentDiv = styled.div`
  padding: 15px;
  border-bottom: solid 1px #97979750;
  display: flex;
  align-items: center;
`;

const UserProfileDiv = styled.div`
  height: 100%;
  width: 40px;
margin-bottom: auto;
`;
const UserProfileImg = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  line-height: 32px;
  background-color: #536b75;
  color: white;
`;

const BulletContentWrapper=styled.div`
  display: flex;
  flex-direction:column;
`

const ModalBulletineAuthor = styled.div`
  padding-bottom: 5px;

  font-size: 14px;
  font-weight: bold;
`;
const ModalBulletinPublishedTime = styled.div`
  font-size: 12px;
  padding-top: 5px;
`;

const ModalCotentBlock = styled.div`

`;
const ModalBulletinContent = styled.div`
line-height:28px;
`;

const ModalDeleteImg = styled.img`
  width: 12px;
  height: 12px;
  margin-left: auto;
`;

const NoComment = styled.div``;

interface CommentType {
  authorEmail: string;
  authorUid: string;
  authorDisplayName: string;
  commentContent: string;
  commentTitle: string;
  commentUid: string;
  newsArticleUid: string;
  // publishedTime:number;
  publishedTime: { seconds: number; nanoseconds: number };
}

function ModalBulletin({ articleId }: { articleId: string }) {
  const { userState } = useContext(AuthContext);
  const [postState, setPostState] = useState<CommentType[]>();

  async function deleteComment(commentId: string) {
    await deleteDoc(doc(db, "comments", `${commentId}`));
  }

  function timeExpression(time: number) {
    const [year, month, date, hours, minutes] = timestampConvertDate(time);
    const dataValue = `${year}/${month.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}/${date.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })} ${hours.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}:${minutes.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}`;
    return dataValue;
  }

  useEffect(() => {
    // console.log("ModalBulletin");

    const q = query(
      collection(db, "comments"),
      where("newsArticleUid", "==", articleId)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        let posts: CommentType[] = [];
        querySnapshot.forEach((doc) => posts.push(doc.data() as CommentType));

        const sortByTime = posts.sort((a, b) => {
          const timeA =
            a.publishedTime.seconds * 1000 +
            a.publishedTime.nanoseconds / 1000000;
          const timeB =
            b.publishedTime.seconds * 1000 +
            b.publishedTime.nanoseconds / 1000000;

          return timeB - timeA;
        });
        setPostState(sortByTime);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <ModalBulletinBoard>
      <ModalBulletinTitle>留言板</ModalBulletinTitle>
      {postState?.map((post: CommentType, index: number) => {
        return (
          <ModalBulletinContentDiv key={post.commentUid}>
            <UserProfileDiv>
              <UserProfileImg>
                {post.authorDisplayName.charAt(0).toUpperCase()}
              </UserProfileImg>
            </UserProfileDiv>
            <BulletContentWrapper>
              <ModalCotentBlock>
                <ModalBulletineAuthor>
                  {post.authorDisplayName}
                </ModalBulletineAuthor>

                <ModalBulletinContent>
                  {post.commentContent}
                </ModalBulletinContent>
                <ModalBulletinPublishedTime>
                  {timeExpression(
                    post.publishedTime.seconds * 1000 +
                      post.publishedTime.nanoseconds / 1000000
                  )}
                </ModalBulletinPublishedTime>
              </ModalCotentBlock>
            </BulletContentWrapper>
            {post.authorUid === userState.uid && (
                <ModalDeleteImg
                  src={Bin}
                  onClick={() => {
                    deleteComment(post.commentUid);
                  }}
                />
            )}
          </ModalBulletinContentDiv>
        );
      })}
      {postState?.length === 0 ? <NoComment>目前無任何留言</NoComment> : ""}
    </ModalBulletinBoard>
  );
}

export default ModalBulletin;
