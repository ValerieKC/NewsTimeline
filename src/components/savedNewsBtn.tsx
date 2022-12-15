import { useEffect, useContext } from "react";
import styled from "styled-components";

import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  DocumentData,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";
import SavedSign from "../img/savedSign.png";
import UnsavedSign from "../img/unSavedSign.png";

const SavedSignImg = styled.img`
  width: auto;
  height: 100%;
  position: relative;
  z-index: 50;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1280px) {
    width: auto;
    height: 100%;
  }
`;

function SavedNewsBtn({ newsId, unOpen }: { newsId: string; unOpen: () => void }) {
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
        (doc: DocumentData) => {
          setUserState(doc.data());
        }
      );
      return () => unsub();
    }
  }, [setUserState, userState.uid]);

  return (
    <>
      {isLogIn &&
        (userState.savedArticles?.includes(newsId) ? (
          <SavedSignImg
            src={SavedSign}
            onClick={(e) => {
              unOpen();
              deleteFavoriteNews(newsId);
              e.stopPropagation()
            }} alt={`savedSignImg`}
          />
        ) : (
          <SavedSignImg
            src={UnsavedSign}
            onClick={(e) => {
              unOpen();
              addFavoriteNews(newsId);

              e.stopPropagation();

            }}
          />
        ))}
    </>
  );
}

export default SavedNewsBtn;
