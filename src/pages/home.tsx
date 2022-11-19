import React, { useRef, useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import Modal from "../components/modal";
import Highlighter from "react-highlight-words";
import algoliasearch from "algoliasearch";
import { RankingInfo } from "@algolia/client-search";
import { doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";
import SavedNews from "../components/savedNews";
import Arrow from "./left-arrow.png";

const client = algoliasearch("SZ8O57X09U", "914e3bdfdeaad4dea354ed84e86c82e0");
const index = client.initIndex("newstimeline");

const Container = styled.div`
  display: flex;
  position: relative;
  z-index:1;
  justify-content: center;
  flex-direction: column;
  height: calc(100% - 70px);
  @media screen and (max-width: 1280px) {
    height: calc(100% - 50px);
  }
`;

const TimelinePanel = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const NewsPanelWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  /* outline: 1px solid salmon; */
  background-color: #f1eeed;

  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`;
const NewsPanel = styled.div`
  width: 100%;
  height: calc(100vh - 120px);
  margin-left: 50px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
  row-gap: 70px;
  column-gap: 30px;
  @media screen and (max-width: 1280px) {
    height: calc(100vh - 80px);
    padding-top: 0;
    padding-bottom: 0;
    margin-left: 30px;
    row-gap: 40px;
    column-gap: 30px;
  }
`;

const SourceTag = styled.div`
  width: 200px;
  height: 22px;
  /* padding: 0 5px; */
  position: absolute;
  background-color: #b3845e;
  color: white;
  display: none;
  bottom: -33px;
  left: 0px;
  z-index: 5;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 20px;
  font-weight: 700;
  font-family: "Quicksand", sans-serif;
  @media screen and (max-width: 1280px) {
    width: 100%;
    height: 14px;
    /* margin: 0 5px; */
    bottom: -18px;
    font-size: 8px;
    line-height: 12px;
  }
`;

const SourceTagEven = styled.div`
  width: 200px;
  height: 22px;
  /* padding: 0 5px; */
  position: absolute;
  background-color: #b3845e;
  color: white;
  display: none;
  top: -33px;
  left: 0px;
  z-index: 5;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 16px;
  line-height: 20px;
  font-weight: 700;
  font-family: "Quicksand", sans-serif;
  @media screen and (max-width: 1280px) {
    width: 100%;
    height: 14px;
    /* margin: 0 5px; */
    top: -18px;
    font-size: 8px;
    line-height: 12px;
  }
`;

const NewsBlock = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc((100% - 70px) / 2);
  /* aspect-ratio: 0.8;
  max-width: 350px; */
  width:300px;
  align-items: center;
  background-color: #ffffff;

  &:hover {
    cursor: pointer;
  }
  &:nth-child(even) {
    left: 60px;
  }

  &:hover ${SourceTag} {
    display: flex;
  }

  &:hover ${SourceTagEven} {
    display: flex;
  }

  @media screen and (max-width: 1280px) {
    height: calc((100% - 40px) / 2);
/* max-width: 250px; */
width:250px;
    &:nth-child(even) {
      left: 40px;
    }

   
  }
`;

const NewsBlockPhotoDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-image: url(${(props: PhotoUrlProp) => props.newsImg});
  background-size: cover;
  /* background-position:center; */

  @media screen and (max-width: 1280px) {
    height: 200%;
    background-position:center;

    /* background-size: contain;
    background-repeat: no-repeat; */
  }
`;

const NewsBlockContent = styled.div`
  margin: 20px auto;
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;

  @media screen and (max-width: 1280px) {
    margin: 10px auto;
  }
`;
const NewsBlockWord = styled.div`
  margin: ${(props: PhotoUrlProp) => (props.newsImg ? 0 : "auto")};
  width: 100%;
`;

const NewsBlockTitle = styled.div`
  margin: 0;
  width: 100%;
  font-size: 18px;
  line-height: 23px;
  font-weight: 700;
  text-align: center;
  //控制行數
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 1280px) {
    font-size: 8px;
    line-height: 14px;
    font-weight: 700;
    
  }
`;

const NewsBlockDescription = styled.div`
  margin-top: 10px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 300;
  //控制行數
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 1280px) {
    display: none;
    /* margin-top: 15px; */
  }
`;

const TimelineShow = styled.div`
  width: 100vw;
  position: absolute;
  transform: translateY(50%);
  background-color: #000000;
  height: 4px;
  overflow: hidden;
  bottom: 50%;
`;

const TimeTag = styled.div`
  /* width: 200px; */
  padding-left: 5px;
  position: absolute;
  text-align: center;
  bottom: -32px;
  left: 0px;
  z-index: 4;
  font-size: 16px;
  line-height: 20px;
  border-left: 2px solid #000000;
  font-family: "Quicksand", sans-serif;
  font-weight: 500;
  @media screen and (max-width: 1280px) {
    bottom: -18px;
    font-size: 10px;
    line-height: 12px;
  }
`;

const TimeTagEven = styled.div`
  position: absolute;
  padding-left: 5px;
  text-align: center;
  top: -32px;
  left: 0px;
  z-index: 4;
  font-size: 16px;
  line-height: 20px;
  border-left: 2px solid #000000;
  font-family: "Quicksand", sans-serif;
  font-weight: 500;
  @media screen and (max-width: 1280px) {
    top: -18px;
    font-size: 10px;
    line-height: 12px;
  }
`;

const ScrollTarget = styled.div`
  width: 20px;
  height: 4px;
  border-radius: 10px;
  background-color: #f35b03;
  z-index: 7;
  /* margin-left: ${(props: ScrollProp) => props.movingLength}px; */
  transform: translateX(${(props: ScrollProp) => props.movingLength}px);
`;

const FlyBackBtn = styled.div`
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 20px;
  z-index: 8;
  transform: translateY(-50%);
  transition: opacity 1.5s;
  opacity: 40%;
  /* background-image: url(${Arrow});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain; */
  background-color: white;
  &:hover {
    cursor: pointer;
    opacity: 100%;
    transition: opacity 1s;
  }
  @media screen and (max-width: 1280px) {
    width: 40px;
    height: 30px;
    left: 15px;
  }
`;

const BulletinPanel = styled.div`
  margin: 0 auto;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const UserPanel = styled.div``;

const UserPhotoDiv = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #3cbe7d;
`;

const UserName = styled.div`
  width: 100px;
  height: 24px;
  font-size: 24px;
  text-align: center;
  font-weight: bold;
`;

const SavedKeyWordsPanel = styled.div`
  width: 100px;
  height: 300px;
  border: 1px solid #979797;
`;

const PanelTitle = styled.div``;

const KeyWordBlock = styled.div`
  width: 100%;
  display: flex;
`;
const KeyWordText = styled.div`
  width: 80%;
  &:hover {
    cursor: pointer;
  }
`;
const KeyWordDelete = styled.div`
  margin-left: auto;
  &:hover {
    cursor: pointer;
  }
`;
const PopularPanel = styled.div`
  display: flex;
  /* margin-top: 124px; */
`;

const PopularNewsPanel = styled.div`
  width: 250px;
  height: 300px;
  border: 1px solid #979797;
`;

const PopularChatRoomPanel = styled.div`
  width: 250px;
  height: 300px;
  border: 1px solid #979797;
`;

interface WheelEvent {
  preventDefault: Function;
  deltaMode: number;
  deltaX: number;
  deltaY: number;
  deltaZ: number;
}

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
  urlToImage: string;
  articleContent: string;
}

interface HitsType extends ArticleType {
  readonly objectID: string;
  readonly _highlightResult?: {} | undefined;
  readonly _snippetResult?: {} | undefined;
  readonly _rankingInfo?: RankingInfo | undefined;
  readonly _distinctSeqID?: number | undefined;
}

interface ScrollProp {
  movingLength: number;
}

interface PhotoUrlProp {
  newsImg: string;
}

function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLDivElement | null>(null);
  const { keyword, setKeyword } = useOutletContext<{
    keyword: string;
    setKeyword: Function;
  }>();
  const { userState, setUserState, isLogIn } = useContext(AuthContext);
  const [articleState, setArticles] = useState<ArticleType[]>([]);
  

  const [contentLength, setContentLength] = useState<number>(1);
  const [distance, setDistance] = useState<number>(0);

  const [scrolling, setScrolling] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  console.log("ok");

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;
    const scrollEvent = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", scrollEvent);
    return () => el.removeEventListener("wheel", scrollEvent);
  }, []);

  // index.getSettings().then((settings) => {
  //   console.log(settings);
  // });
  useEffect(() => {
    let isFetching = false;
    let isPaging = true;
    let paging = 0;
    const el = scrollRef.current;

    setArticles([]);

    async function queryNews(input: string) {
      isFetching = true;
      setScrolling(false);

      const resp = await index.search(`${input}`, {
        page: paging,
      });
      const hits = resp.hits;
      //contentlength的公式化算法待測試，推測+300是因為最後一個新聞塊凸出來，凸出來的部分必須要走完，-40是前面設first-child的margin-left，設margin-right都會失效
      setContentLength(
        Math.ceil(resp.nbHits / 2) * 300 +
          Math.ceil(resp.nbHits / 2) * 100 +
          300 -
          40
      );
      paging = paging + 1;
      let newHits: HitsType[] = [];
      hits.map((item) => newHits.push(item as HitsType));
      setArticles((prev) => [...prev, ...newHits]);
      if (paging === resp.nbPages) {
        isPaging = false;
        setScrolling(true);
        return;
      }
      isFetching = false;
      setScrolling(true);
    }

    async function scrollHandler(e: WheelEvent) {
      // const el = scrollRef.current;

      if (el!.scrollWidth - (window.innerWidth + el!.scrollLeft) <= 200) {
        if (e.deltaY < 0) return;
        if (isFetching) return;

        if (!isPaging) return;
        queryNews(keyword);
      }
    }

    queryNews(keyword);
    el!.addEventListener("wheel", scrollHandler);

    return () => {
      el!.removeEventListener("wheel", scrollHandler);
    };
  }, [keyword, contentLength]);

  function timestampConvertDate(time: string | number | Date) {
    const dateObj = new Date(time);
    const month = dateObj.getMonth();
    const date = dateObj.getDate();
    const hours = dateObj.getHours();

    const dataValue = `${month.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}/${date.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })} ${hours.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}時`;
    return dataValue;
  }

  // 刪除儲存關鍵字
 
  // 標示當前閱覽位置
  useEffect(() => {
    const el = scrollRef.current;
    setWindowWidth(window.innerWidth);
    if (!articleState) return;
    if (!scrolling) return;
    const scrollMovingHandler = (e: WheelEvent) => {
      if (e.deltaY < 0 && distance <= 0) {
        setDistance(0);
      }

      e.preventDefault();
      setDistance((prev) => prev + (e.deltaY / contentLength) * windowWidth);
      if (distance >= windowWidth - 20) {
        setDistance(windowWidth - 20);
      }
    };

    el!.addEventListener("wheel", scrollMovingHandler);
    return () => el!.removeEventListener("wheel", scrollMovingHandler);
  }, [articleState, distance, windowWidth, contentLength, scrolling]);

  // const el = scrollRef.current;

  // if (el) {
  //   console.log(
  //     "margin-left:",
  //     distance,
  //     "e.scrollWidth",
  //     el!.scrollWidth,
  //     "calculated-content-length:",
  //     contentLength,
  //     "window.innerWidth:",
  //     window.innerWidth
  //   );
  // }

  const scrollBackFirst = () => {
    if (!firstRef) return;
    firstRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
    setDistance(0);
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);
  return (
    <>
      <Container>
        <TimelinePanel>
          <NewsPanelWrapper ref={scrollRef}>
            <TimelineShow>
              <ScrollTarget movingLength={distance} />
            </TimelineShow>
            <FlyBackBtn
              onClick={() => {
                scrollBackFirst();
              }}>BACK</FlyBackBtn>
            <NewsPanel>
              {articleState.map((article, index) => {
                return (
                  <NewsBlock
                    key={`key-` + index}
                    onClick={() => {
                      setIsOpen((prev) => !prev);
                      setOrder(index);
                    }}
                    ref={index === 0 ? firstRef : null}
                  >
                    {article.urlToImage ? (
                      <NewsBlockPhotoDiv newsImg={article.urlToImage} />
                    ) : (
                      ""
                    )}
                    <NewsBlockContent>
                      <NewsBlockWord newsImg={article.urlToImage}>
                        {/* {index} */}
                        <NewsBlockTitle>
                          <Highlighter
                            highlightClassName="Highlight"
                            searchWords={[keyword]}
                            autoEscape={true}
                            textToHighlight={`${article.title.split("-")[0]}`}
                          />
                        </NewsBlockTitle>
                        <NewsBlockDescription>
                          <Highlighter
                            highlightClassName="Highlight"
                            searchWords={[keyword]}
                            autoEscape={true}
                            textToHighlight={`${article.description}`}
                          />
                        </NewsBlockDescription>
                        <SavedNews
                          newsId={article.id}
                          unOpen={() => setIsOpen(true)}
                        />
                      </NewsBlockWord>

                      {index % 2 === 0 ? (
                        <TimeTag>
                          {timestampConvertDate(article.publishedAt)}
                        </TimeTag>
                      ) : (
                        <TimeTagEven>
                          {timestampConvertDate(article.publishedAt)}
                        </TimeTagEven>
                      )}

                      {index % 2 === 0 ? (
                        <SourceTag>{article.source["name"]}</SourceTag>
                      ) : (
                        <SourceTagEven>{article.source["name"]}</SourceTagEven>
                      )}
                    </NewsBlockContent>
                  </NewsBlock>
                );
              })}

              {isOpen && (
                <Modal
                  content={articleState[order]?.articleContent}
                  newsArticleUid={articleState[order]?.id}
                  onClose={() => setIsOpen(false)}
                />
              )}
              {/* <NewsBlock>1</NewsBlock>
            <NewsBlock>2</NewsBlock>*/}
            </NewsPanel>
          </NewsPanelWrapper>
        </TimelinePanel>
      </Container>
    </>
  );
}

export default Home;
