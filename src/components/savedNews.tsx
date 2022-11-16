import React, { useState, useEffect, useContext } from "react";
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
import SavedSign from "./savedSign.png";
import UnsavedSign from "./unSavedSign.png";

const SavedSignDiv = styled.img`
  position: absolute;
  width: 20px;
  height: 20px;
  right: 20px;
  bottom: 20px;
  /* margin-left: auto;
  margin-top: 10px; */
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1280px) {
    width: 10px;
    height: 10px;
  }
`;

function SavedNews({ newsId, unOpen }: { newsId: string; unOpen: () => void }) {
  const { userState, setUserState, isLogIn } = useContext(AuthContext);

  async function addFavoriteNews(articleUid: string) {
    const userRef = doc(db, "users", userState.uid);
    await updateDoc(userRef, {
      savedArticles: arrayUnion(articleUid),
    });
  }

  async function deleteFavoriteNews(articleUid: string) {
    const userRef = doc(db, "users", userState.uid);
    await updateDoc(userRef, {
      savedArticles: arrayRemove(articleUid),
    });
  }

  useEffect(() => {
    if (userState.uid) {
      const unsub = onSnapshot(
        doc(db, "users", userState.uid),
        (doc:any) => {
          setUserState(doc.data());
        }
      );
      return () => unsub();
    }
  }, [userState.uid]);

  return (
    <>
      {isLogIn &&
        (userState.savedArticles.includes(newsId) ? (
          <SavedSignDiv
            src={SavedSign}
            onClick={() => {
              unOpen();
              deleteFavoriteNews(newsId);
            }}
          />
        ) : (
          <SavedSignDiv
            src={UnsavedSign}
            onClick={() => {
              unOpen();
              addFavoriteNews(newsId);
            }}
          />
        ))}
    </>
  );
}

export default SavedNews;
