import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ReactLoading from "react-loading";
// import { ArticleTypeFirestore } from "../utils/articleType";
import { ArticleType, ArticleTypeFirestore } from "../utils/articleType";
import ViewCount from "../components/viewCountDiv";
import NewsArticleBlock from "../components/newsArticleBlock";
import {
  doc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
} from "firebase/firestore";

import { db } from "../utils/firebase";
import Modal from "../components/modal";

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const Wrapper = styled.div`
  margin: 30px auto 150px;
  display: flex;
  flex-direction: column;
  width: 1100px;
  @media screen and (max-width: 1280px) {
    margin: 10px auto 50px;
    width: 800px;
    height: 700px;
  }

  /* @media screen and (max-width: 799px) {
    margin: 10px auto 50px;
    width: 100%;
    min-width: 360px;
  } */
`;

const HotNewsBlock = styled.div`
  padding: 10px;
  height: 725px;
  display: flex;

  @media screen and (max-width: 1280px) {
    height: 650px;
  }
`;

const HotNewsTitle = styled.div`
  width: fit-content;
  padding: 10px;
  border-bottom: 3px solid #000000;
  font-size: 36px;
  font-weight: bold;
  line-height: 45px;
  @media screen and (max-width: 1280px) {
    line-height: 40px;
  }
`;

const FistPlaceDiv = styled.div`
  width: 40%;
  height: 100%;
  &:hover {
    cursor: pointer;
  }
`;

const FirstPlaceTitle = styled.div`
  display: flex;
  width: 100%;
  height: 120px;
  margin-bottom: 5px;
  font-size: 36px;
  font-weight: bold;
  line-height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const FirstPlaceContent = styled.div`
  margin: 5px auto 10px;
  width: 100%;
  line-height: 30px;
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: "ellipsis";
  @media screen and (max-width: 1280px) {
    line-height: 26px;
    -webkit-line-clamp: 10;
  }
`;
const MiddlePlaceDiv = styled.div`
  margin-left: 40px;
  padding-bottom: 10px;
  width: calc((100% - 40% - 10px - 10px) / 2);
  height: 100%;
  display: flex;
  flex-direction: column;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1280px) {
    margin-left: 20px;
  }
`;

const MiddlePlaceTitle = styled.div`
  margin: 10px auto 0;
  width: 100%;
  height: 48px;
  font-size: 20px;
  font-weight: bold;
  line-height: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: "ellipsis";
`;

const NewsBlockPhotoDiv = styled.div`
  width: 100%;
  height: 180px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-image: url(${(props: PhotoUrlProp) => props.newsImg});
  background-size: cover;
  background-position: center;
  @media screen and (max-width: 1280px) {
    height: 150px;

    background-position: center;
  }
`;

const FirstPlacePhotoDiv = styled(NewsBlockPhotoDiv)`
  height: 300px;
  @media screen and (max-width: 1280px) {
    height: 200px;

    background-position: center;
  }
`;

const MiddleNewsDiv = styled.div`
  height: 50%;
  @media screen and (max-width: 1280px) {
  }
`;

const NewsContent = styled.div`
  margin-top: 15px;
  margin-bottom: 10px;
  line-height: 28px;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 1280px) {
    margin-top: 0;
    -webkit-line-clamp: 3;
    line-height: 25px;
  }
`;

const RestNewsDiv = styled(MiddlePlaceDiv)`
  overflow-y: hidden;
`;

const RestNewsEach = styled.div`
  height: 16.66%;
  border-top: 1px solid #979797;
  width: 100%;
  display: flex;
  align-items: center;
  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    border-bottom: 1px solid #979797;
  }

  &:hover {
    cursor: pointer;
  }
`;

const RestNewsImgDiv = styled.div`
  display: flex;
  align-items: center;
`;

const RestNewsImg = styled.div`
  width: 110px;
  height: 71px;
  background-image: url(${(props: PhotoUrlProp) => props.newsImg});
  background-size: cover;
  background-position: center;
  @media screen and (max-width: 1280px) {
    width: 95px;
    height: 64px;
  }
`;

const RestNewsEachContent = styled.div`
  height: 56px;
  padding: 5px;
  line-height: 23px;
  width: calc(100% - 100px);
  margin-left: auto;

  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 1280px) {
    -webkit-line-clamp: 3;
  }
`;

const ViewCountDiv = styled.div`
  margin: 5px 0 0 auto;

  @media screen and (max-width: 1280px) {
  }
`;

const LoadingDiv = styled.div`
  width: 1100px;
  height: 725px;
  display: flex;
  align-items: center;
  background-color: #dfe3ee;
  @media screen and (max-width: 1280px) {
    width: 800px;
    height: 700px;
  }
`;

const LoadingAnimation = styled(ReactLoading)`
  margin: auto;
`;

interface PhotoUrlProp {
  newsImg: string;
}

function HotNews() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hotNewsState, setHotNews] = useState<ArticleType[]>([]);
  const [restHotNews, setRestHotNews] = useState<ArticleType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    async function getHotNews() {
      setIsLoading(true);
      const newsRef = collection(db, "news");
      const q = query(newsRef, orderBy("clicks", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const hotNews: ArticleTypeFirestore[] = [];
      querySnapshot.forEach((doc) =>
        hotNews.push(doc.data() as ArticleTypeFirestore)
      );

      const newHotNews = hotNews.map((item, index: number, arr) => {
        return { ...item, publishedAt: item.publishedAt.seconds };
      });
      const [hotNews0, hotNews1, hotNews2, ...restNews] = newHotNews;
      setHotNews(newHotNews);
      setRestHotNews(restNews);

      setIsLoading(false);
    }

    getHotNews();
  }, []);
  console.log(hotNewsState);
  
  async function gainViews(order: number, views: number, newsId: string) {
    await updateDoc(doc(db, "news", newsId), {
      clicks: views + 1,
    });

    let newArticles = [...hotNewsState];
    newArticles[order] = { ...newArticles[order], clicks: views + 1 };
    setHotNews(newArticles);
  }
  return (
    <Container>
      <Wrapper>
        <HotNewsTitle>Hot NEWS</HotNewsTitle>
        {isLoading ? (
          <LoadingDiv>
            <LoadingAnimation type="spokes" color="black" />
          </LoadingDiv>
        ) : (
          <HotNewsBlock>
            <FistPlaceDiv
              onClick={() => {
                setIsOpen((prev) => !prev);
                setOrder(0);
                gainViews(0, hotNewsState[0]?.clicks, hotNewsState[0]?.id);
              }}
            >
              <FirstPlaceTitle>
                {hotNewsState[0]?.title.split(" - ")[0]}
              </FirstPlaceTitle>
              {hotNewsState[0]?.urlToImage ? (
                <>
                  <FirstPlacePhotoDiv newsImg={hotNewsState[0].urlToImage} />
                  <ViewCountDiv>
                    <ViewCount clicks={hotNewsState[0]?.clicks} />
                  </ViewCountDiv>
                </>
              ) : (
                ""
              )}

              <FirstPlaceContent>
                {hotNewsState[0]?.articleContent}
              </FirstPlaceContent>
            </FistPlaceDiv>
            <MiddlePlaceDiv>
              <MiddleNewsDiv
                onClick={() => {
                  setIsOpen((prev) => !prev);
                  setOrder(1);
                  gainViews(1, hotNewsState[1]?.clicks, hotNewsState[1]?.id);
                }}
              >
                {hotNewsState[1]?.urlToImage ? (
                  <NewsBlockPhotoDiv newsImg={hotNewsState[1].urlToImage} />
                ) : (
                  ""
                )}
                <MiddlePlaceTitle>
                  {hotNewsState[1]?.title.split(" - ")[0]}
                </MiddlePlaceTitle>
                {hotNewsState[1] ? (
                  <ViewCountDiv>
                    <ViewCount clicks={hotNewsState[1]?.clicks} />
                  </ViewCountDiv>
                ) : (
                  ""
                )}
                <NewsContent>{hotNewsState[1]?.articleContent}</NewsContent>
              </MiddleNewsDiv>
              <MiddleNewsDiv
                onClick={() => {
                  setIsOpen((prev) => !prev);
                  setOrder(2);
                  gainViews(2, hotNewsState[2]?.clicks, hotNewsState[2]?.id);
                }}
              >
                {hotNewsState[2]?.urlToImage ? (
                  <NewsBlockPhotoDiv newsImg={hotNewsState[2].urlToImage} />
                ) : (
                  ""
                )}
                <MiddlePlaceTitle>
                  {hotNewsState[2]?.title.split(" - ")[0]}
                </MiddlePlaceTitle>
                {hotNewsState[2] ? (
                  <ViewCountDiv>
                    <ViewCount clicks={hotNewsState[2]?.clicks} />
                  </ViewCountDiv>
                ) : (
                  ""
                )}
                <NewsContent>{hotNewsState[2]?.articleContent}</NewsContent>
              </MiddleNewsDiv>
            </MiddlePlaceDiv>
            <RestNewsDiv>
              {restHotNews.map((news, index) => {
                return (
                  <RestNewsEach
                    key={`key-` + news.id}
                    onClick={() => {
                      setIsOpen((prev) => !prev);
                      setOrder(index + 3);
                      gainViews(
                        index + 2,
                        hotNewsState[index + 3]?.clicks,
                        hotNewsState[index + 3]?.id
                      );
                    }}
                  >
                    <RestNewsEachContent>
                      {news.title.split("-")[0]}
                    </RestNewsEachContent>
                    <RestNewsImgDiv>
                      <RestNewsImg newsImg={news.urlToImage} />
                    </RestNewsImgDiv>
                  </RestNewsEach>
                );
              })}
            </RestNewsDiv>
            {isOpen && (
              <Modal
                content={hotNewsState[order].articleContent}
                title={hotNewsState[order].title}
                author={hotNewsState[order].author}
                time={hotNewsState[order].publishedAt * 1000}
                newsArticleUid={hotNewsState[order].id}
                category={hotNewsState[order].category}
                country={hotNewsState[order].country}
                onClose={() => setIsOpen(false)}
              />
            )}
          </HotNewsBlock>
        )}
      </Wrapper>
    </Container>
  );
}

export default HotNews;
