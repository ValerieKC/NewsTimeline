import React, { useRef, useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import Modal from "../components/modal";
import Highlighter from "react-highlight-words";
import algoliasearch from "algoliasearch";
import { RankingInfo } from "@algolia/client-search";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";
import SavedNewsBtn from "../components/savedNewsBtn";
import Arrow from "./left-arrow.png";
import timestampConvertDate from "../utils/timeStampConverter";
import CategoryTag from "../components/categoryTag";
import ReactLoading from "react-loading";
import ViewCount from "../components/viewCountDiv";

const client = algoliasearch("SZ8O57X09U", "914e3bdfdeaad4dea354ed84e86c82e0");
const index = client.initIndex("newstimeline");

const Container = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
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
  height: calc(100vh - 130px);
  margin-left: 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
  row-gap: 90px;
  column-gap: 60px;
  @media screen and (max-width: 1280px) {
    height: calc(100vh - 60px);
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
  background-color: #aa5006;
  color: white;
  display: none;
  bottom: -43px;
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
  background-color: #aa5006;
  color: white;
  display: none;
  top: -43px;
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
  height: calc((100% - 90px) / 2);
  aspect-ratio: 0.9;

  align-items: center;
  background-color: #ffffff;
  box-shadow: 0px 0px 11px 2px rgba(0, 0, 0, 0.35);
  -webkit-box-shadow: 0px 0px 11px 2px rgba(0, 0, 0, 0.35);
  -moz-box-shadow: 0px 0px 11px 2px rgba(0, 0, 0, 0.35);
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
  transition: opacity 0.2s ease-out;
  &:hover {
    opacity: 50%;
  }
  @media screen and (max-width: 1280px) {
    height: calc((100% - 40px) / 2);

    &:nth-child(even) {
      left: 40px;
    }
  }
`;

const NewsBlockPhotoDiv = styled.div`
  width: 100%;
  height: 150%;
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

const NewsInformDivLarge = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 0;
  font-size: 10px;
  @media screen and (max-width: 1280px) {
    display: none;
  }
`;

const NewsInformTime = styled.div``;
const NewsBlockContent = styled.div`
  margin: 5px auto 10px;
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  //控制行數
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 1280px) {
    font-size: 8px;
    line-height: 16px;
    font-weight: 700;
  }
`;

const NewsBlockDescription = styled.div`
  /* margin: 10px 0 0; */
  font-size: 12px;
  line-height: 20px;
  font-weight: 300;
  //控制行數
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 1280px) {
    display: none;
  }
`;
const NoResult = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  font-size: 28px;
  line-height: 32px;
  text-align: center;
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
  bottom: -43px;
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
  top: -43px;
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
  right: 20px;
  z-index: 8;
  transform: translateY(-50%);
  transition: opacity 1.5s;
  opacity: 40%;
  background-image: url(${Arrow});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
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

const SavedNewsDiv = styled.div`
margin-left:auto;
  height: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 1280px) {
    /* top: 88%; */
    height: 12px;
  }
`;

const ViewCountDiv = styled.div`
  display: flex;
  
  @media screen and (max-width: 1280px) {
  }
`;

const UserInteractDiv=styled.div`
  width:100%;
  /* margin-top:auto; */
  display: flex;
`

const Loading = styled(ReactLoading)`
  margin-left: 10px;
`;

const LoadResult = styled.div`
  display: flex;
  padding: 2px 10px;
  position: absolute;
  z-index: 20;
  left: 50%;
  transform: translate(-50%, -600%);
  background-color: #f3dd7f;
  border: 2px solid #ffffff;
  border-radius: 20px;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  box-shadow: 1px -1px 6px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 1px -1px 6px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 1px -1px 6px 0px rgba(0, 0, 0, 0.75);
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
  clicks: number;
  readonly objectID: string;
  readonly _highlightResult?: {} | undefined;
  readonly _snippetResult?: {} | undefined;
  readonly _rankingInfo?: RankingInfo | undefined;
  readonly _distinctSeqID?: number | undefined;
}

// interface HitsType extends ArticleType {
//   readonly objectID: string;
//   readonly _highlightResult?: {} | undefined;
//   readonly _snippetResult?: {} | undefined;
//   readonly _rankingInfo?: RankingInfo | undefined;
//   readonly _distinctSeqID?: number | undefined;
// }

interface ScrollProp {
  movingLength: number;
}

interface PhotoUrlProp {
  newsImg: string;
}

function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const newsBlockRef = useRef<HTMLDivElement | null>(null);
  const { keyword, setKeyword, searchState, setSearchState } =
    useOutletContext<{
      keyword: string;
      setKeyword: Function;
      searchState: boolean;
      setSearchState: Function;
    }>();
  const { userState, setUserState, isLogIn } = useContext(AuthContext);
  const [articleState, setArticles] = useState<ArticleType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);

  const [contentLength, setContentLength] = useState<number>(1);
  const [distance, setDistance] = useState<number>(0);

  const [scrolling, setScrolling] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [blockWidth, setBlockWidth] = useState<number>(1);
  const [totalArticle, setTotalArticle] = useState<number>(0);

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
      setIsLoading(true);
      setScrolling(false);
      setSearchState(true);
      const resp = await index.search(`${input}`, {
        page: paging,
      });
      const hits = resp.hits;
      //contentlength的公式化算法待測試，推測+300是因為最後一個新聞塊凸出來，凸出來的部分必須要走完，-40是前面設first-child的margin-left，設margin-right都會失效
      setTotalArticle(resp.nbHits);
      // setContentLength(
      //   Math.ceil(resp.nbHits / 2) * 300 +
      //     Math.ceil(resp.nbHits / 2) * 30
      // );
      console.log(resp.nbHits)
      paging = paging + 1;
      let newHits: ArticleType[] = [];
      hits.map((item) => newHits.push(item as ArticleType));
      setArticles((prev) => [...prev, ...newHits]);
      setIsLoading(false);

      if (paging === resp.nbPages) {
        isPaging = false;
        setScrolling(true);
        return;
      }
      // if (articleState.length === 0) {
      //   setSearchState(false);
      // }
      isFetching = false;
      setScrolling(true);
      setSearchState(false);
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
  }, [keyword]);

  // 刪除儲存關鍵字

  // 標示當前閱覽位置
  useEffect(() => {
    const el = scrollRef.current;
    setWindowWidth(window.innerWidth);
    if (!articleState) return;
    if (!scrolling) return;
    setBlockWidth(newsBlockRef.current?.offsetWidth!);
    setContentLength(
      Math.ceil(totalArticle / 2) * blockWidth +
        Math.ceil(totalArticle / 2) * 30
    );

    const scrollMovingHandler = (e: WheelEvent) => {
      if (e.deltaY < 0 && distance <= 0) {
        setDistance(0);
      }

      e.preventDefault();
      setDistance((prev) => prev + (e.deltaY / contentLength) * windowWidth);
      if (distance >= windowWidth - 20) {
        setDistance(windowWidth - 22);
      }
    };

    el!.addEventListener("wheel", scrollMovingHandler);
    return () => el!.removeEventListener("wheel", scrollMovingHandler);
  }, [
    articleState,
    distance,
    windowWidth,
    contentLength,
    scrolling,
    blockWidth,
    totalArticle,
  ]);
  // }, [articleState, distance, windowWidth, contentLength, scrolling]);

  const scrollBackFirst = () => {
    if (!scrollRef) return;

    scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setDistance(0);
  };

  useEffect(() => {
    function keyDownEvent(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if (e.key === "Home") {
        scrollBackFirst();
      }
    }
    window.addEventListener("keydown", keyDownEvent);

    return () => window.removeEventListener("keydown", keyDownEvent);
  }, []);

  function timeExpression(time: number) {
    const [, month, date, hours] = timestampConvertDate(time);
    const dataValue = `${month.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}/${date.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })} ${hours.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}時`;
    return dataValue;
  }

  async function gainViews(order: number, views: number, newsId: string) {
    await updateDoc(doc(db, "news", newsId), {
      clicks: views + 1,
    });

    let newArticles = [...articleState];
    newArticles[order] = { ...newArticles[order], clicks: views + 1 };
    setArticles(newArticles);
  }

  function timeInterval(time: number, index: number) {
    const interval = (Date.now() - time) / 1000;
    const hours = Math.floor(interval / 3600);
    // const minutes = Math.floor((interval % 3600) / 60);

    if (hours < 24) {
      return index % 2 === 0 ? (
        <TimeTag>{hours}小時前</TimeTag>
      ) : (
        <TimeTagEven>{hours}小時前</TimeTagEven>
      );
    } else if (hours <= 48) {
      return index % 2 === 0 ? (
        <TimeTag>{Math.round(hours / 24)}天前</TimeTag>
      ) : (
        <TimeTagEven>{Math.round(hours / 24)}天前</TimeTagEven>
      );
    } else {
      return index % 2 === 0 ? (
        <TimeTag>{timeExpression(time)}</TimeTag>
      ) : (
        <TimeTagEven>{timeExpression(time)}</TimeTagEven>
      );
    }
  }
  return (
    <>
      <Container>
        <TimelinePanel>
          {isLoading ? (
            <LoadResult>
              載入新聞中
              <Loading
                type="balls"
                color="#000000"
                width="12px"
                height="12px"
              />
            </LoadResult>
          ) : (
            ""
          )}
          {keyword && articleState.length === 0 && searchState === false ? (
            <NoResult>沒有 "{keyword}" 的查詢結果</NoResult>
          ) : (
            ""
          )}
          <NewsPanelWrapper ref={scrollRef}>
            <TimelineShow>
              <ScrollTarget movingLength={distance} />
            </TimelineShow>
            <FlyBackBtn
              onClick={() => {
                scrollBackFirst();
              }}
            />
            <NewsPanel>
              {articleState.map((article, index) => {
                return (
                  <NewsBlock
                    key={`key-` + index}
                    onClick={() => {
                      setIsOpen((prev) => !prev);
                      setOrder(index);

                      gainViews(index, article.clicks, article.id);
                    }}
                    ref={newsBlockRef}
                  >
                    {article.urlToImage ? (
                      <NewsBlockPhotoDiv newsImg={article.urlToImage} />
                    ) : (
                      ""
                    )}
                    <NewsInformDivLarge>
                      <CategoryTag
                        categoryName={article.category}
                        fontSize="10px"
                        divHeight="20px"
                      />
                      <NewsInformTime>
                        {timeExpression(article.publishedAt)}
                      </NewsInformTime>
                    </NewsInformDivLarge>

                    <NewsBlockContent>
                      {/* <NewsBlockWord newsImg={article.urlToImage}> */}
                        <NewsBlockTitle>
                          <Highlighter
                            highlightClassName="Highlight"
                            searchWords={[keyword]}
                            autoEscape={true}
                            textToHighlight={`${article.title.split(" - ")[0]}`}
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
                      {/* </NewsBlockWord> */}
                      <UserInteractDiv>
                        <ViewCountDiv>
                          <ViewCount clicks={article.clicks} />
                        </ViewCountDiv>
                        <SavedNewsDiv>
                          <SavedNewsBtn
                            newsId={article.id}
                            unOpen={() => setIsOpen(true)}
                          />
                        </SavedNewsDiv>
                      </UserInteractDiv>
                      {timeInterval(article.publishedAt, index)}

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
                  title={articleState[order]?.title}
                  author={articleState[order]?.author}
                  time={articleState[order]?.publishedAt}
                  newsArticleUid={articleState[order]?.id}
                  category={articleState[order]?.category}
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
