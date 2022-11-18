import styled from "styled-components";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { db } from "../utils/firebase";
import Modal from "../components/modal";
import {
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
  updateDoc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const Wrapper = styled.div`
  /* width: 1600px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  margin-top: 50px;
`;
const ProfilePhotoDiv = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #3cbe7d;
`;

const ProfilePhoto = styled.img``;

const DisplayName = styled.div`
  margin-top: 20px;
`;

const Logout = styled.button`
  width: 100px;
  height: 30px;
  border: 1px solid #000000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SavedNewsPanel = styled.div``;
const SavedNewsTitle = styled.div``;

const SavedNewsDiv = styled.div`
  border: 1px solid #979797;
  width: 600px;
  /* max-height: 600px;
  overflow-y: scroll; */
`;
const SavedArticle = styled.div`
  display: flex;
  margin: 10px;
  border-bottom: 1px solid #979797;
`;
const SavedArticleNumber = styled.div`
  width: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SavedArticleDiv = styled.div`
  display: flex;
  flex-direction: column;
`;
const SavedArticleTitle = styled.div``;

const DeleteSavedNews = styled.div`
  height: 100%;
  margin-left: auto;
  &:hover {
    cursor: pointer;
  }
`;

const NoSavedNews = styled.div``;

interface ArticleType {
  author: string | null;
  category: string;
  briefContent: string | null;
  country: string;
  description: string | null;
  id: string;
  publishedAt: number;
  source: { id: string | null; name: string | null };
  title: string;
  url: string;
  uriToImage: string;
  articleContent: string;
}
function Member() {
  const { userState, setUserState, logOut} = useContext(AuthContext);
  const [articleId, setArticleId] = useState<string[]>();
  const [savedNewsState, setSavedNews] = useState<ArticleType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (!userState.uid) return;
    const unsub = onSnapshot(doc(db, "users", userState.uid), (doc: any) => {
      const articleId = doc.data().savedArticles;
          getNews(articleId);

    });

    async function getNews(id:any) {
      let savedNews: ArticleType[] = [];

      await Promise.all(
        id.map(async (item: string) => {
          const getNews = await getDoc(doc(db, "news", item));
          savedNews.push(getNews.data() as ArticleType);
        })
      );
      setSavedNews(savedNews);
    }
    return () => unsub();
  }, [userState.uid]);

  async function deleteFavoriteNews(articleUid: string) {
    const userRef = doc(db, "users", userState.uid);
    await updateDoc(userRef, {
      savedArticles: arrayRemove(articleUid),
    });
  }
  // console.log("member, global");
  console.log(savedNewsState)
  return (
    <Container>
      <Wrapper>
        <ProfilePhotoDiv>
          <ProfilePhoto />
        </ProfilePhotoDiv>
        <DisplayName>{userState.displayName}</DisplayName>
        <Logout
          onClick={() => {
            logOut();
          }}
        >
          登出
        </Logout>
        <SavedNewsPanel>
          <SavedNewsTitle>收藏新聞</SavedNewsTitle>
          <SavedNewsDiv>
            {savedNewsState &&
              savedNewsState?.map((news: ArticleType, index: number) => {
                return (
                  <SavedArticle key={`key-` + news.id}>
                    <SavedArticleNumber>{index}</SavedArticleNumber>
                    <SavedArticleDiv>
                      <SavedArticleTitle
                        onClick={() => {
                          setIsOpen((prev) => !prev);
                          setOrder(index);
                        }}
                      >
                        {news.title}
                      </SavedArticleTitle>
                    </SavedArticleDiv>
                    <DeleteSavedNews
                      onClick={() => {
                        deleteFavoriteNews(news.id);
                      }}
                    >
                      X
                    </DeleteSavedNews>
                  </SavedArticle>
                );
              })}
            {isOpen && (
              <Modal
                content={savedNewsState[order].articleContent}
                newsArticleUid={savedNewsState[order].id}
                onClose={() => setIsOpen(false)}
              />
            )}
          </SavedNewsDiv>
          {savedNewsState ? "" : <NoSavedNews>沒有收藏的新聞</NoSavedNews>}
        </SavedNewsPanel>
      </Wrapper>
    </Container>
  );
}

export default Member;
