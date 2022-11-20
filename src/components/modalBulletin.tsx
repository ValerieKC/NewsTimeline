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
  margin-top: 40px;
  row-gap: 10px;
`;

const ModalBulletinTitle = styled.div``;
const ModalBulletinContentDiv = styled.div`
  padding: 15px;
  border: solid 1px #979797;
  border-radius: 2px;
`;

const ModalBulletinContentTitleDiv = styled.div`
  display: flex;
  border-bottom: 1px solid #979797;
  padding-bottom: 5px;
`;
const ModalBulletinContentTitle = styled.div``;
const ModalBulletineAuthor = styled.div``;
const ModalBulletinPublishedTime = styled.div``;

const ModalBlock = styled.div`
  width: 33%;
  display: flex;
`;
const ModalLabel = styled.div``;

const ModalCotentBlock = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
`;
const ModalBulletinContent = styled.div``;

const ModalDeleteComment = styled.img`
  width: 12px;
  height: 12px;
  margin-left: auto;
`;

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
    const [year,month, date, hours, minutes] = timestampConvertDate(time);
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
            <ModalBulletinContentTitleDiv>
              <ModalBlock>
                <ModalLabel>標題| </ModalLabel>
                <ModalBulletinContentTitle>
                  {post.commentTitle}
                </ModalBulletinContentTitle>
              </ModalBlock>
              <ModalBlock>
                <ModalLabel>作者| </ModalLabel>
                <ModalBulletineAuthor>
                  {post.authorDisplayName}
                </ModalBulletineAuthor>
              </ModalBlock>
              <ModalBlock>
                <ModalLabel>留言時間| </ModalLabel>
                <ModalBulletinPublishedTime>
                  {/* {new Date(
                    post.publishedTime.seconds * 1000 +
                      post.publishedTime.nanoseconds / 1000000
                  ).toLocaleString()} */}

                  {timeExpression(
                    post.publishedTime.seconds * 1000 +
                      post.publishedTime.nanoseconds / 1000000
                  )}
                </ModalBulletinPublishedTime>
              </ModalBlock>
            </ModalBulletinContentTitleDiv>
            <ModalCotentBlock>
              <ModalBulletinContent>{post.commentContent}</ModalBulletinContent>
              {post.authorUid === userState.uid && (
                <ModalDeleteComment
                  src={Bin}
                  onClick={() => {
                    deleteComment(post.commentUid);
                  }}
                />
              )}
            </ModalCotentBlock>
          </ModalBulletinContentDiv>
        );
      })}
    </ModalBulletinBoard>
  );
}

export default ModalBulletin;
