import styled from "styled-components";
import React, { useState, useContext, useEffect } from "react";
import {
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
  updateDoc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { AuthContext } from "../context/authContext";
import { db } from "../utils/firebase";
import Modal from "../components/modal";
import DeleteSign from "./x.png";
import Profile from "./user.png";

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
  background-image: url(${Profile});
  background-size: cover;
`;

const ProfilePhoto = styled.img``;

const DisplayNameDiv = styled.div`
  margin-top: 20px;
  display: flex;
`;

const DisplayName = styled.div`
  font-weight: bold;
`;

const Logout = styled.button`
  width: 100px;
  height: 30px;
  border: 1px solid #000000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SavedNewsPanel = styled.div`
  margin-top: 20px;
`;

const SavedNewsDiv = styled.div`
  border: 1px solid #979797;
  width: 800px;
  &:hover {
    cursor: pointer;
  }
`;
const SavedArticleDiv = styled.div`
  display: flex;
  &:hover {
    font-weight: bold;
  }
`;
const SavedArticle = styled.div`
  width: 100%;
  margin: 5px 10px;
  display: flex;
 
`;

const SavedArticleNumberDiv = styled.div`
  display:flex;
  flex-direction: column;
`

const SavedArticleNumber = styled.div`
  width: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SavedArticleTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

const SavedArticleText=styled.div`
`

const SavedArticleContent = styled.div``;
const SavedArticleImgDiv=styled.div``

const DeleteSavedNews = styled.div`
  width: 8px;
  height: 8px;
  margin-left: auto;
  background-image: url(${DeleteSign});
  background-size: cover;
  &:hover {
    cursor: pointer;
  }
`;

const NoSavedNews = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

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
  uriToImage: string;
  articleContent: string;
}
function Member() {
  const { userState, setUserState, logOut } = useContext(AuthContext);
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

    async function getNews(id: any) {
      let savedNews: ArticleType[] = [];
      if (!id) return;
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

  return (
    <Container>
      <Wrapper>
        <ProfilePhotoDiv>
          <ProfilePhoto />
        </ProfilePhotoDiv>
        <DisplayNameDiv>
          <DisplayName>{userState.displayName}</DisplayName>
          的收藏新聞清單
        </DisplayNameDiv>
        <SavedNewsPanel>
          <SavedNewsDiv>
            {savedNewsState &&
              savedNewsState?.map((news: ArticleType, index: number) => {
                return (
                  <SavedArticleDiv
                    key={`key-` + news.id}
                    onClick={() => {
                      setIsOpen((prev) => !prev);
                      setOrder(index);
                    }}
                  >
                    <SavedArticleNumberDiv>
                      <SavedArticleNumber>{index + 1}</SavedArticleNumber>
                      <DeleteSavedNews
                        onClick={() => {
                          deleteFavoriteNews(news.id);
                        }}
                      />
                    </SavedArticleNumberDiv>
                    <SavedArticle>
                      <SavedArticleContent>
                        <SavedArticleTitle>{news.title}</SavedArticleTitle>
                        <SavedArticleText>{news.description}</SavedArticleText>
                      </SavedArticleContent>
                    </SavedArticle>
                  </SavedArticleDiv>
                );
              })}
            {isOpen && (
              <Modal
                content={savedNewsState[order].articleContent}
                title={savedNewsState[order]?.title}
                author={savedNewsState[order]?.author}
                time={savedNewsState[order]?.publishedAt.seconds * 1000}
                newsArticleUid={savedNewsState[order].id}
                category={savedNewsState[order].category}
                onClose={() => setIsOpen(false)}
              />
            )}
          </SavedNewsDiv>
          {savedNewsState.length === 0 ? (
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
