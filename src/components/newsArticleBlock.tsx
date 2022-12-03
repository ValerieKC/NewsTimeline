import styled from "styled-components";
import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { AuthContext } from "../context/authContext";
import { db } from "../utils/firebase";
import Modal from "./modal";
import Calendar from "../pages/calendar.png";
import View from "../pages/view.png";
import timestampConvertDate from "../utils/timeStampConverter";
import Bin from "../components/bin.png";
import CategoryComponent from "./categoryTag";

const SavedNewsDiv = styled.div`
  width: 100%;
  height:fit-content;
  &:hover {
    cursor: pointer;
  }
`;

const DeleteDiv=styled.div`
width:40px;
display: flex;
align-items: center;
justify-content: center;
`

const DeleteSavedNews = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  background-image: url(${Bin});
  background-size: cover;
  display: none;
  &:hover {
    cursor: pointer;
  }
`;

const SavedArticleDiv = styled.div`
  height: 157px;
  display: flex;
  position: relative;
  &:hover ${DeleteSavedNews} {
    display: flex;
  }
  @media screen and (max-width: 799px) {
    height: 200px;
  }
`;

const SavedArticleLeft = styled.div`
  display: flex;
  width: 760px;
  margin-right: auto;
  padding-right: 20px;
  border-bottom: 1px solid #dad5d3;
  
`;

const SavedArticle = styled.div`
  display: flex;
`;

const SavedArticleCenterContent = styled.div`
  display: column;
  /* width: 550px; */
  width: calc(100% - 40px - 20px);
  @media screen and (max-width: 799px) {
    width: calc(100% - 20px - 10px);
  }
`;

const SavedArticleInfoDiv = styled.div`
  display: flex;
  line-height: 28px;
  /* padding-bottom: 24px; */
  @media screen and (max-width: 799px) {
    flex-direction: column;
  }
`;

const SavedArtilceInfoSubDiv = styled.div`
  display: flex;
  margin-left: auto;
  @media screen and (max-width: 799px) {
    margin-left: 0;
    flex-direction: column;
  }
`;

const SavedArticleInfoTag = styled.div`
  display: flex;
  
`;

const SavedArticleInfoTitle = styled.div`
  font-size: 12px;
`;

const SavedArticleInfoTitleView = styled.div`
  font-size: 12px;
  width: 40px;
`;

const SavedArticleInfoCalendarDiv = styled.div`
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SavedArticleInfoEyeDiv = styled.div`
  padding-top: 2px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SavedArticleInfoImg = styled.img`
  width: 14px;
  height: 14px;
`;

const SavedArticleInfoEyeImg = styled.img`
  width: 16px;
  height: 16px;
`;

const SavedArticleNumberDiv = styled.div`
  width: 30px;
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  /* line-height: 32px; */
  @media screen and (max-width: 799px) {
    width: 20px;
  }
`;

const SavedArticleNumber = styled.div`
  width: 100%;
  margin-top: 20px;
height:24px;
line-height:24px;
  text-align: center;
`;


const SavedArticleTitle = styled.div`
  display: flex;
  height: 24px;
  margin-bottom: 10px;
  flex-direction: column;
  font-size: 18px;
  font-weight: bold;
  line-height: 24px;
  //控制行數
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 799px) {
    height: 20px;
    -webkit-line-clamp: 3;
    font-size: 14px;
  }
`;

const SavedArticleText = styled.div`
  font-size: 14px;
  height:50px;
  line-height: 25px;
  //控制行數
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 799px) {
    -webkit-line-clamp: 3;
    font-size: 10px;
    line-height: 16px;
  }
`;

const CategoryDiv=styled.div`
  
width:100px;
`
interface BackgroundImg {
  imgUrl: string;
}

const SavedArticleContent = styled.div`
  margin: 20px 0 14px 0;

  @media screen and (max-width: 799px) {
    width: 100%;
  }
`;

const SavedArticleImgDiv = styled.div`
  margin-top: 25px;
`;

const SavedArticleImg = styled.div`
  width: 160px;
  height: 100px;

  background-image: url(${(props: BackgroundImg) => props.imgUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  @media screen and (max-width: 799px) {
    width: 120px;
    height: 75px;
  }
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
  urlToImage: string;
  articleContent: string;
  clicks: number;
}

function NewsArticleBlock({ newsState }: { newsState: ArticleType[] }) {
  const { userState, setUserState, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);
  const [savedNewsState, setSavedNews] = useState<ArticleType[]>([]);
  const location = useLocation();

  async function deleteFavoriteNews(articleUid: string) {
    const userRef = doc(db, "users", userState.uid);
    await updateDoc(userRef, {
      savedArticles: arrayRemove(articleUid),
    });
  }

  function timeExpression(time: number) {
    const [year, month, date] = timestampConvertDate(time);
    const dataValue = `${year.toLocaleString(undefined, {
      minimumIntegerDigits: 4,
    })}年${month.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}月${date.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}日`;
    return dataValue;
  }

  async function gainViews(order: number, views: number, newsId: string) {
    await updateDoc(doc(db, "news", newsId), {
      clicks: views + 1,
    });

    let newArticles = [...newsState];
    newArticles[order] = { ...newArticles[order], clicks: views + 1 };
    setSavedNews(newArticles);
  }

  useEffect(() => {
    setSavedNews(newsState);
  }, [newsState]);

  return (
    <SavedNewsDiv>
      {savedNewsState &&
        savedNewsState?.map((news: ArticleType, index: number) => {
          return (
            <SavedArticleDiv
              key={`key-` + news.id}
              onClick={() => {
                setIsOpen((prev) => !prev);
                setOrder(index);
                gainViews(index, news?.clicks, news?.id);
              }}
            >
              <SavedArticleLeft>
                <SavedArticle>
                  <SavedArticleNumberDiv>
                    <SavedArticleNumber>{index + 1}</SavedArticleNumber>
                  </SavedArticleNumberDiv>

                  <SavedArticleCenterContent>
                    <SavedArticleContent>
                      <SavedArticleTitle>
                        {news.title.split("-")[0]}
                      </SavedArticleTitle>
                      <SavedArticleText>{news.description}</SavedArticleText>
                    </SavedArticleContent>

                    <SavedArticleInfoDiv>
                      <CategoryDiv>
                        <CategoryComponent categoryName={news.category} />
                      </CategoryDiv>
                      <SavedArtilceInfoSubDiv>
                        <SavedArticleInfoTag>
                          <SavedArticleInfoEyeDiv>
                            <SavedArticleInfoEyeImg src={View} />
                          </SavedArticleInfoEyeDiv>
                          <SavedArticleInfoTitleView>
                            {news.clicks}
                          </SavedArticleInfoTitleView>
                        </SavedArticleInfoTag>
                        <SavedArticleInfoTag>
                          <SavedArticleInfoCalendarDiv>
                            <SavedArticleInfoImg src={Calendar} />
                          </SavedArticleInfoCalendarDiv>
                          <SavedArticleInfoTitle>
                            {timeExpression(
                              news.publishedAt.seconds * 1000 +
                                news.publishedAt.nanoseconds / 1000000
                            )}
                          </SavedArticleInfoTitle>
                        </SavedArticleInfoTag>
                      </SavedArtilceInfoSubDiv>
                    </SavedArticleInfoDiv>
                  </SavedArticleCenterContent>
                </SavedArticle>
                <SavedArticleImgDiv>
                  <SavedArticleImg imgUrl={news.urlToImage} />
                </SavedArticleImgDiv>
              </SavedArticleLeft>
              {location.pathname === "/member" && (
                <DeleteDiv>
                  <DeleteSavedNews
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFavoriteNews(news.id);
                    }}
                  />
                </DeleteDiv>
              )}
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
  );
}

export default NewsArticleBlock;
