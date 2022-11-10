import styled from "styled-components";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { db } from "../utils/firebase";
import {
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
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
  const { userState, setUserState } = useContext(AuthContext);
  const [articleId, setArticleId] = useState<string[]>();
  const [savedNewsState, setSavedNews] = useState<ArticleType[]>();

  useEffect(() => {
    if (!userState.uid) return;

    async function getNews() {
      const getId: DocumentSnapshot<DocumentData> = await getDoc(
        doc(db, "users", userState.uid)
      );
      const articleIds = getId.data()!.savedArticles;
      let savedNews:ArticleType[] = [];
      await Promise.all(
        articleIds!.map(async (item: string) => {
          const getNews = (await getDoc(doc(db, "news", item))); 
          savedNews.push(getNews.data() as ArticleType);
          console.log(savedNews)
        })
      );
      setSavedNews(savedNews);
    }
    getNews();
  }, [userState.uid]);

  return (
    <Container>
      <Wrapper>
        <ProfilePhotoDiv>
          <ProfilePhoto />
        </ProfilePhotoDiv>
        <DisplayName>{userState.displayName}</DisplayName>
        <SavedNewsPanel>
          <SavedNewsTitle>收藏新聞</SavedNewsTitle>
          <SavedNewsDiv>
            {savedNewsState &&
              savedNewsState?.map((news: ArticleType, index: number) => {
                console.log(news);
                return (
                  <SavedArticle key={`key-` + news.id}>
                    <SavedArticleNumber>{index}</SavedArticleNumber>
                    <SavedArticleDiv>
                      <SavedArticleTitle>{news.title}</SavedArticleTitle>
                    </SavedArticleDiv>
                  </SavedArticle>
                );
              })}
          </SavedNewsDiv>
          {savedNewsState ? "" : <NoSavedNews>沒有收藏的新聞</NoSavedNews>}
        </SavedNewsPanel>
      </Wrapper>
    </Container>
  );
}

export default Member;
