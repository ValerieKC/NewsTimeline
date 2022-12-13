import { useContext, Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { AuthContext } from "../context/authContext";
import { ArticleType } from "../utils/articleType";
import { db } from "../utils/firebase";
import timestampConvertDate from "../utils/timeStampConverter";
import CategoryComponent from "./categoryTag";
import Calendar from "../pages/calendar.png";
import View from "../pages/view.png";
import DeleteSign from "../pages/x.png";

const DeleteDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DeleteSavedNews = styled.div`
  width: 12px;
  height: 12px;
  display: flex;
  justify-content: center;
  background-image: url(${DeleteSign});
  background-size: cover;
  display: none;
  &:hover {
    cursor: pointer;
  }
`;

const SavedArticleDiv = styled.div`
  height: 170px;
  display: flex;
  position: relative;
  &:hover ${DeleteSavedNews} {
    display: flex;
  }
  @media screen and (max-width: 700px) {
    height: 180px;
    justify-content: center;
  }

  &:hover {
    cursor:pointer;
  }
`;

const SavedArticleAll = styled.div`
  display: flex;
  width: 700px;
  border-bottom: 1px solid #dad5d3;
  @media screen and (max-width: 700px) {
    width: 100%;
  }
`;

const SavedArticle = styled.div`
  display: flex;
  width: 100%;
`;

const SavedArticleCenterContent = styled.div`
  display: column;
  width: calc(100% - 40px - 20px);
  @media screen and (max-width: 700px) {
    width: calc(100% - 20px - 10px);
  }
`;

const SavedArticleInfoDiv = styled.div`
  display: flex;
  line-height: 28px;
  padding-right: 2px;
  @media screen and (max-width: 700px) {
    width: calc(100% - 20px);
    /* margin-top: 15px; */
    margin-left: auto;
    position: absolute;
  }
`;

const SavedArtilceInfoSubDiv = styled.div`
  display: flex;
  margin-left: auto;
  @media screen and (max-width: 700px) {
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
  @media screen and (max-width: 700px) {
    width: 20px;
  }
`;

const SavedArticleNumber = styled.div`
  width: 100%;
  margin-top: 30px;
  height: 24px;
  line-height: 24px;
  font-size: 18px;
  text-align: center;
  @media screen and (max-width: 700px) {
    margin-top: 25px;
  }
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
  @media screen and (max-width: 700px) {
  }
`;

const SavedArticleText = styled.div`
  font-size: 14px;
  height: 50px;
  line-height: 25px;
  //控制行數
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 700px) {
    height: 75px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const CategoryDiv = styled.div`
  width: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
interface BackgroundImg {
  imgUrl: string;
}

const SavedArticleContent = styled.div`
  margin: 30px 0 14px 0;

  @media screen and (max-width: 700px) {
    margin-top: 25px;
  }
`;

const SavedArticleImgDiv = styled.div`
  margin-top: 32px;
  @media screen and (max-width: 700px) {
    margin-top: 27px;
  }
`;

const SavedArticleImg = styled.div`
  width: 160px;
  height: 100px;

  background-image: url(${(props: BackgroundImg) => props.imgUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  @media screen and (max-width: 700px) {
    width: 120px;
    height: 75px;
  }
`;

function NewsArticleBlock({
  news,
  index,
  renderViews,
  setIsOpen,
  setOrder,
}: {
  news: ArticleType;
  index: number;
  renderViews: () => Promise<void>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setOrder: Dispatch<SetStateAction<number>>;
}) {
  const { userState } = useContext(AuthContext);
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

  console.log("newsArticleBlock");
  return (
    <>
      <SavedArticleDiv
        key={`key-` + news.id}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setOrder(index);
          renderViews();
        }}
      >
        <SavedArticleAll>
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
                      {timeExpression(news.publishedAt * 1000)}
                    </SavedArticleInfoTitle>
                  </SavedArticleInfoTag>
                </SavedArtilceInfoSubDiv>
              </SavedArticleInfoDiv>
            </SavedArticleCenterContent>
          </SavedArticle>
          <SavedArticleImgDiv>
            <SavedArticleImg imgUrl={news.urlToImage} />
          </SavedArticleImgDiv>
        </SavedArticleAll>
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
    </>
  );
}

export default NewsArticleBlock;
