import { useState, useContext, useEffect } from "react";
import { doc, DocumentData, getDoc, onSnapshot } from "firebase/firestore";
import styled from "styled-components";
import ReactLoading from "react-loading";
import { ArticleType } from "../utils/articleType";
import { AuthContext } from "../context/authContext";
import { db } from "../utils/firebase";
import Modal from "../components/modal";
import NewsArticleBlock from "../components/newsArticleBlock";
import gainViews from "../utils/gainViews";

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
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
`;

const UserProfileImg = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 48px;
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
  width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 700px) {
    width: calc(100% - 40px);
    min-width: 360px;
  }
`;
const SavedNewsSeperateLine = styled.div`
  width: 700px;
  border-top: 1px solid #dad5d3;
  @media screen and (max-width: 700px) {
    width: 100%;
    min-width: 360px;
  }
`;

const NoSavedNews = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LoadingAnimationDiv = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  @media screen and (max-width: 700px) {
  }
`;

const NewsArticleWrapper = styled.div`
  height: 100%;
`;

const SavedNewsDiv = styled.div`
  width: 100%;
  height: fit-content;
  &:hover {
    cursor: pointer;
  }
`;

function Member() {
  const { userState } = useContext(AuthContext);
  const [savedNewsState, setSavedNews] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (!userState.uid) return;
    setIsLoading(true);

    const unsub = onSnapshot(doc(db, "users", userState.uid), (doc: DocumentData) => {
      const articleId = doc.data().savedArticles;
      getNews(articleId);
    });

    async function getNews(id: DocumentData) {
      if (!id) {
        setIsLoading(false);
        return;
      }
      const savedNews = await Promise.all(
        id.map(async (item: string) => {
          const getNews = await getDoc(doc(db, "news", item));
          return {
            ...getNews.data(),
            publishedAt: getNews.data()?.publishedAt.seconds,
          };
        })
      );
      console.log(savedNews);
      setSavedNews(savedNews);
      setIsLoading(false);
    }

    return () => unsub();
  }, [userState.uid]);

  function LoadingAnimation() {
    return (
      <LoadingAnimationDiv>
        <ReactLoading type="spokes" color="black" />
      </LoadingAnimationDiv>
    );
  }

  async function renderViews(
    order: number,
    views: number,
    newsId: string,
    articles: ArticleType[]
  ) {
    const updatedArticles = await gainViews(order, views, newsId, articles);
    setSavedNews(updatedArticles);
  }

  console.log("member");
  return (
    <Container>
      <Wrapper>
        <ProfilePhotoDiv>
          <UserProfileImg>
            {userState.displayName.charAt(0).toUpperCase()}
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
            <SavedNewsDiv>
              {savedNewsState?.map((item, index) => {
                return (
                  <NewsArticleBlock
                    key={item.id}
                    news={item}
                    index={index}
                    renderViews={() =>
                      renderViews(index, item.clicks, item.id, savedNewsState)
                    }
                    setIsOpen={setIsOpen}
                    setOrder={setOrder}
                  />
                );
              })}
            </SavedNewsDiv>
          </NewsArticleWrapper>
          {isLoading ? LoadingAnimation() : ""}
          {!isLoading && savedNewsState.length === 0 ? (
            <NoSavedNews>您沒有收藏的新聞</NoSavedNews>
          ) : (
            ""
          )}
          {isOpen && (
            <Modal
              content={savedNewsState[order].articleContent}
              title={savedNewsState[order]?.title}
              author={savedNewsState[order]?.author}
              time={savedNewsState[order]?.publishedAt * 1000}
              newsArticleUid={savedNewsState[order].id}
              category={savedNewsState[order].category}
              country={savedNewsState[order].country}
              onClose={() => setIsOpen(false)}
            />
          )}
        </SavedNewsPanel>
      </Wrapper>
    </Container>
  );
}

export default Member;
