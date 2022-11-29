import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
import { RankingInfo } from "@algolia/client-search";

import { db } from "../utils/firebase";
import Modal from "../components/modal";

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  margin: 30px auto 150px;
  display:flex;
  flex-direction: column;
  width: 1100px;
  @media screen and (max-width: 799px) {
    margin: 10px auto 50px;
    width: 100%;
    min-width: 360px;
  }
`;

const HotNewsBlock = styled.div`
  padding: 10px;
  height: 725px;
  display: flex;

  @media screen and (max-width: 799px) {
   
  }
`;

const HotNewsTitle = styled.div`
  width: fit-content;
  padding: 10px;
  border-bottom: 3px solid #000000;
  font-size: 36px;
  font-weight: bold;
  line-height: 55px;
`;

const FistPlaceDiv = styled.div`
  width: 40%;
  height: 100%;
`;

const FirstPlaceTitle = styled.div`
  width: 100%;
  height: 120px;
  font-size: 32px;
  font-weight: bold;
  line-height: 40px;
`;
const FirstPlaceContent = styled.div`
  margin: 5px auto 10px;
  width: 100%;
  line-height: 22px;
  display: -webkit-box;
  -webkit-line-clamp: 12;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const MiddlePlaceDiv = styled.div`
  margin-left: 10px;
  width: calc((100% - 40% - 10px - 10px) / 2);
  height: 100%;
`;

const MiddlePlaceTitle = styled.div`
  margin: 10px auto 0;
  width: 100%;
  height: fit-content;
  font-size: 20px;
  font-weight: bold;
  line-height: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NewsBlockPhotoDiv = styled.div`
  width: 100%;
  height: 200px;
  /* height: 150%; */
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-image: url(${(props: PhotoUrlProp) => props.newsImg});
  background-size: cover;
  background-position: center;
  @media screen and (max-width: 1280px) {
    background-position: center;
  }
`;

const FirstPlacePhotoDiv = styled(NewsBlockPhotoDiv)`
  height: 300px;
`;

const MiddleNewsDiv = styled.div`
  height: 50%;
`;

const NewsContent = styled.div`
  margin: 5px auto 10px;
  line-height: 22px;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RestNewsDiv = styled(MiddlePlaceDiv)`
  overflow-y: hidden;
`;

const RestNewsEach = styled.div`
  margin: 5px 0;
  border-top: 1px solid #979797;
  line-height: 24px;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  &:first-child {
    margin-top: 0;
  }
`;

const ViewCountDiv = styled.div`
margin:5px 0 5px auto;
  
  @media screen and (max-width: 1280px) {
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

interface PhotoUrlProp {
  newsImg: string;
}

function HotNews() {
  const [hotNewsState, setHotNews] = useState<ArticleType[]>([]);
  const [restHotNews, setRestHotNews] = useState<ArticleType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    async function getHotNews() {
      const newsRef = collection(db, "news");
      const q = query(newsRef, orderBy("clicks", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      const hotNews: ArticleType[] = [];
      querySnapshot.forEach((doc) => hotNews.push(doc.data() as ArticleType));
      const [hotNews0, hotNews1, hotNews2, ...restNews] = hotNews;
      setHotNews(hotNews);
      setRestHotNews(restNews);
    }

    getHotNews();
  }, []);

  async function gainViews(order: number, views: number, newsId: string) {
    await updateDoc(doc(db, "news", newsId), {
      clicks: views + 1,
    });

    let newArticles = [...hotNewsState];
    newArticles[order] = { ...newArticles[order], clicks: views + 1 };
    setHotNews(newArticles);
  }

  console.log("hotNewsState", hotNewsState);
  console.log("restHotNews", restHotNews);
  console.log(order)
  return (
    <Container>
      <Wrapper>
        <HotNewsTitle>Hot NEWS</HotNewsTitle>

        <HotNewsBlock>
          <FistPlaceDiv>
            <FirstPlaceTitle>
              {hotNewsState[0]?.title.split(" - ")[0]}
            </FirstPlaceTitle>
            {hotNewsState[0]?.urlToImage ? (
              <FirstPlacePhotoDiv newsImg={hotNewsState[0].urlToImage} />
            ) : (
              ""
            )}
            <ViewCountDiv>
              <ViewCount clicks={hotNewsState[0]?.clicks} />
            </ViewCountDiv>
            <FirstPlaceContent
              onClick={() => {
                setIsOpen((prev) => !prev);
                setOrder(0);
              }}
            >
              {hotNewsState[0]?.articleContent}
            </FirstPlaceContent>
            {isOpen && (
              <Modal
                content={hotNewsState[order].articleContent}
                title={hotNewsState[order].title}
                author={hotNewsState[order].author}
                time={hotNewsState[order].publishedAt.seconds * 1000}
                newsArticleUid={hotNewsState[order].id}
                category={hotNewsState[order].category}
                onClose={() => setIsOpen(false)}
                onClick={() =>
                  gainViews(
                    order,
                    hotNewsState[order]?.clicks,
                    hotNewsState[order]?.id
                  )
                }
              />
            )}
          </FistPlaceDiv>
          <MiddlePlaceDiv>
            <MiddleNewsDiv>
              {hotNewsState[1]?.urlToImage ? (
                <NewsBlockPhotoDiv newsImg={hotNewsState[1].urlToImage} />
              ) : (
                ""
              )}
              <MiddlePlaceTitle>
                {hotNewsState[1]?.title.split(" - ")[0]}
              </MiddlePlaceTitle>
              <ViewCountDiv>
                <ViewCount clicks={hotNewsState[1]?.clicks} />
              </ViewCountDiv>
              <NewsContent
                onClick={() => {
                  setIsOpen((prev) => !prev);
                  setOrder(1);
                }}
              >
                {hotNewsState[1]?.articleContent}
              </NewsContent>
              {/* {isOpen && (
              <Modal
                content={hotNewsState[order].articleContent}
                title={hotNewsState[order].title}
                author={hotNewsState[order].author}
                time={hotNewsState[order].publishedAt.seconds * 1000}
                newsArticleUid={hotNewsState[order].id}
                category={hotNewsState[order].category}
                onClose={() => setIsOpen(false)}
              />
            )} */}
            </MiddleNewsDiv>
            <MiddleNewsDiv>
              {hotNewsState[2]?.urlToImage ? (
                <NewsBlockPhotoDiv newsImg={hotNewsState[2].urlToImage} />
              ) : (
                ""
              )}
              <MiddlePlaceTitle>
                {hotNewsState[2]?.title.split(" - ")[0]}
              </MiddlePlaceTitle>
              <ViewCountDiv>
                <ViewCount clicks={hotNewsState[2]?.clicks} />
              </ViewCountDiv>
              <NewsContent
                onClick={() => {
                  setIsOpen((prev) => !prev);
                  setOrder(2);
                }}
              >
                {hotNewsState[2]?.articleContent}
              </NewsContent>
              {/* {isOpen && (
              <Modal
                content={hotNewsState[2].articleContent}
                title={hotNewsState[2].title}
                author={hotNewsState[2].author}
                time={hotNewsState[2].publishedAt.seconds * 1000}
                newsArticleUid={hotNewsState[2].id}
                category={hotNewsState[2].category}
                onClose={() => setIsOpen(false)}
              />
            )} */}
            </MiddleNewsDiv>
          </MiddlePlaceDiv>
          <RestNewsDiv>
            {restHotNews.map((news, index) => {
              return (
                <RestNewsEach
                  key={`key-` + news.id}
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                    setOrder(index + 2);
                  }}
                >
                  {news.title}
                </RestNewsEach>
              );
            })}
          </RestNewsDiv>
          {isOpen && (
            <Modal
              content={hotNewsState[order].articleContent}
              title={hotNewsState[order].title}
              author={hotNewsState[order].author}
              time={hotNewsState[order].publishedAt.seconds * 1000}
              newsArticleUid={hotNewsState[order].id}
              category={hotNewsState[order].category}
              onClose={() => setIsOpen(false)}
              onClick={() =>
                gainViews(
                  order,
                  hotNewsState[order]?.clicks,
                  hotNewsState[order]?.id
                )
              }
            />
          )}
        </HotNewsBlock>
      </Wrapper>
    </Container>
  );
}

export default HotNews;
