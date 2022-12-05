import styled from "styled-components";
import React, { useState, useContext, useEffect } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import ReactLoading from "react-loading";

import { AuthContext } from "../context/authContext";
import { db } from "../utils/firebase";
import Profile from "./user.png";
import NewsArticleBlock from "../components/newsArticleBlock";

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
`;
const ProfilePhotoDiv = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  /* background-image: url(${Profile});
  background-size: cover; */
`;


const UserProfileImg = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
font-size:48px;
font-weight: bold;
  background-color: #536b75;
  color: white;
`;

const DisplayNameDiv = styled.div`
  margin-top: 20px;
  display: flex;
`;

const DisplayName = styled.div`
  font-weight: bold;
`;

const SavedNewsPanel = styled.div`
  margin-top: 20px;
  margin-bottom: 100px;
  width: 800px;
  transform: translateX(20px);
  @media screen and (max-width: 799px) {
    width: 360px;
    transform: translateX(0px);
  }
`;
const SavedNewsSeperateLine = styled.div`
  width: 760px;
  /* height: 1px; */
  margin-right: auto;
  border-top: 1px solid #dad5d3;
  @media screen and (max-width: 799px) {
    width: 360px;
  }
`;

const NoSavedNews = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  margin-top: 20px;
  transform: translateX(-20px);
`;

const LoadingAnimationDiv = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  transform: translateX(-20px);
`;

const NewsArticleWrapper=styled.div`
  height:100%;
`

interface ArticleType {
  author: string | null;
  category: string;
  briefContent: string | null;
  country: string;
  description: string | null;
  id: string;
  publishedAt: { seconds: number; nanoseconds: number };
  source: { id: string | null; name: string | null };
  title: string;
  url: string;
  urlToImage: string;
  articleContent: string;
  clicks: number;
}
function Member() {
  const { userState, setUserState, logOut } = useContext(AuthContext);
  const [savedNewsState, setSavedNews] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userState.uid) return;
    setIsLoading(true);

    const unsub = onSnapshot(doc(db, "users", userState.uid), (doc: any) => {
      const articleId = doc.data().savedArticles;
      getNews(articleId);
    });

    async function getNews(id: any) {
      let savedNews: ArticleType[] = [];
      if (!id) {
        setIsLoading(false);
        return;
      }
      await Promise.all(
        id.map(async (item: string) => {
          const getNews = await getDoc(doc(db, "news", item));
          savedNews.push(getNews.data() as ArticleType);
        })
      );
      setSavedNews(savedNews);
      setIsLoading(false);
    }

    return () => unsub();
  }, [userState.uid]);

function LoadingAnimation(){
  return (
    <LoadingAnimationDiv>
      <ReactLoading type="spokes" color="black" />
    </LoadingAnimationDiv>
  );
}
  
  return (
    <Container>
      <Wrapper>
        <ProfilePhotoDiv>
          <UserProfileImg>
            {isLoading ? (
              <ReactLoading
                type="spokes"
                color="white"
                height={"40%"}
                width={"40%"}
              />
            ) : (
              userState.displayName.charAt(0).toUpperCase()
            )}
          </UserProfileImg>
        </ProfilePhotoDiv>
        <DisplayNameDiv>
          {isLoading ? (
            ""
          ) : (
            <DisplayName>{userState.displayName} 的收藏新聞清單</DisplayName>
          )}
        </DisplayNameDiv>
        <SavedNewsPanel>
          <SavedNewsSeperateLine />
          <NewsArticleWrapper>
            <NewsArticleBlock newsState={savedNewsState} />
          </NewsArticleWrapper>
          {isLoading ? LoadingAnimation() : ""}
          {!isLoading && savedNewsState.length === 0 ? (
            <NoSavedNews>您沒有收藏的新聞</NoSavedNews>
          ) : (
            ""
          )}
        </SavedNewsPanel>
      </Wrapper>
    </Container>
  );
}

export default Member;
