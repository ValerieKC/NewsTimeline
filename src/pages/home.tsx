import { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import styled, {keyframes} from "styled-components";
import { useOutletContext } from "react-router-dom";
import Highlighter from "react-highlight-words";
// import algoliasearch from "algoliasearch";
import client from "./algoliaKey";

import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import Modal from "../components/modal";
import ReactLoading from "react-loading";
import { ArticleType } from "../utils/articleType";
import cardOnLoad from "../components/cardOnLoad";
import SavedNewsBtn from "../components/savedNewsBtn";
import timestampConvertDate from "../utils/timeStampConverter";
import TimeInterval from "../components/timeInterval";
import CategoryTag from "../components/categoryTag";
import ViewCount from "../components/viewCountDiv";
import gainViews from "../utils/gainViews";
import Arrow from "../img/left-arrow.png";

// const client = algoliasearch("SZ8O57X09U", "914e3bdfdeaad4dea354ed84e86c82e0");
const index = client.initIndex("newstimeline");

const Container = styled.div`
  margin-top: auto;
  display: flex;
  position: relative;
  z-index: 1;
  justify-content: center;
  flex-direction: column;
  height: calc(100% - 70px);
  @media screen and (max-width: 1280px) {
    height: calc(100% - 50px);
  }

  @media screen and (max-width: 700px) {
    padding-top: 10px;
    justify-content: flex-start;
    align-items: center;
    /* overflow-x: scroll; */
  }
`;

const TimelinePanel = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 700px) {
    display: none;
  }
`;
const NewsPanelWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: #f1eeed;
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }

  @media screen and (max-width: 700px) {
    display: none;
  }
`;
const NewsPanel = styled.div`
  /* height: calc(100vh - 130px); */
  height: 810px;
  padding-left: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
  row-gap: 70px;
  column-gap: 60px;
  @media screen and (max-width: 1280px) {
    height: calc(100vh - 60px);
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 30px;
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
  background-color: #aa5006;
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
  width: 333px;
  height: 370px;
  justify-content: center;
  ////////
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
      left: 30px;
    }
  }

  @media screen and (max-width: 700px) {
    width: 300px;
    height: 360px;
    &:nth-child(even) {
      left: 0px;
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
  align-items: center;
  padding: 10px 20px 0;
  font-size: 10px;
  @media screen and (max-width: 700px) {
    padding: 0;
    margin-bottom: auto;
  }
`;

const NewsInformTime = styled.div``;

const NewsBlockContent = styled.div`
  padding: 5px 20px 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: hidden;
  overflow-x: hidden;
  @media screen and (max-width: 1280px) {
    margin: 10px auto;
  }
  @media screen and (max-width: 700px) {
    margin: 0;
    margin-top: 10px;
    padding: 0;
    justify-content: flex-start;
  }
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
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    -webkit-line-clamp: 3;
  }

  @media screen and (max-width: 700px) {
    -webkit-line-clamp: 1;
  }
`;

const NewsBlockDescription = styled.div`
  font-size: 14px;
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

  @media screen and (max-width: 700px) {
    display: flex;
    line-height: 50px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const NoResult = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  font-size: 28px;
  line-height: 36px;
  text-align: center;
  @media screen and (max-width: 700px) {
    font-size: 24px;
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
  display: flex;
  justify-content: center;
`;
const TimelineHide = styled.div`
  width: calc(100% - 120px);
  position: relative;
  transform: translateY(50%);
  background-color: #000000;
  height: 4px;
  overflow: hidden;
  bottom: 50%;
  overflow: clip;
  display: flex;
  @media screen and (max-width: 1280px) {
    width: calc(100% - 60px);
  }
`;

const TargetHide = styled.div`
  height: 4px;
  width: ${(props: ScrollProp) => props.movingLength}px;
`;
const ScrollTarget = styled.div`
  width: 20px;
  height: 4px;
  border-radius: 10px;
  background-color: #f35b03;
`;

const FlyBackBtn = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: 10px solid white;
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
    width: 30px;
    height: 30px;
    right: 15px;
  }
`;

const SavedNewsDiv = styled.div`
  margin-left: auto;
  height: 14px;
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
`;

const UserInteractDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  @media screen and (max-width: 1280px) {
    margin-top: auto;
  }
`;

const Loading = styled(ReactLoading)`
  margin-left: 10px;
`;

const LoadResult = styled.div`
  display: flex;
  padding: 2px 10px;
  position: absolute;
  z-index: 20;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
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

const MobileContainer = styled.div`
  @media screen and (max-width: 700px) {
    width: 100%;
    display: flex;
    align-items: center;
    z-index: 1;
  }
`;

const MobileNewsPanel = styled.div`
  @media screen and (max-width: 700px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    row-gap: 10px;
    /* overflow-y: auto; */
  }
`;

const MobileNewsBlock = styled.div`
  width: calc(100% - 40px);
  height: 136px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  &:hover {
    cursor: pointer;
  }
`;

const Animation = keyframes`
   0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
`;

const MobileNewsContentDiv = styled.div`
  padding: 10px;
  width: calc(100% - 120px);
  display: flex;
  flex-direction: column;
`;

const MobileOnLoadText = styled.div`
  padding: 10px;
  height:116px;
  animation: ${Animation} 0.5s linear infinite alternate;
`;

const MobileNewsPhotoDiv = styled.div`
  width: 120px;
  height: 75px;
  margin-left: auto;
  border-radius: 2px;
  background-image: url(${(props: PhotoUrlProp) => props.newsImg});
  background-size: cover;
  background-position: center;
`;

const MobileOnLoadImgDiv = styled.div`
  width: 120px;
  height: 75px;
  margin-left: auto;
  border-radius: 2px;
  animation: ${Animation} 0.5s linear infinite alternate;
`;

const MobileFooter = styled.div`
  width: 100%;
  height: 50px;
  margin-top: auto;
`;
interface WheelEvent {
  preventDefault: Function;
  deltaMode: number;
  deltaX: number;
  deltaY: number;
  deltaZ: number;
}

interface ScrollProp {
  movingLength?: number;
  rightDistance?: number;
}

interface PhotoUrlProp {
  newsImg: string;
}

const windowWidth = window.innerWidth;

function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const newsBlockRef = useRef<HTMLDivElement>(null);
  const MobileScrollRef = useRef<HTMLDivElement>(null);
  const { keyword, searchState, setSearchState, windowResized } =
    useOutletContext<{
      keyword: string;
      setKeyword: Dispatch<SetStateAction<string>>;
      searchState: boolean;
      setSearchState: Dispatch<SetStateAction<boolean>>;
      windowResized: boolean;
      setWindowResized: Dispatch<SetStateAction<boolean>>;
    }>();

  const [articleState, setArticles] = useState<ArticleType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageOnLoad, setPageOnLoad] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [scrolling, setScrolling] = useState<boolean>(true);
  const [totalArticle, setTotalArticle] = useState<number>(0);

  useEffect(() => {
    if (windowResized) return;
    const el = scrollRef.current;

    if (!el) return;

    const scrollEvent = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", scrollEvent);
    return () => el.removeEventListener("wheel", scrollEvent);
  }, [windowResized]);

  //橫向卷軸
  useEffect(() => {
    if (windowResized) return;

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
      setPageOnLoad(true);
      const resp = await index.search(`${input}`, {
        page: paging,
      });

      const hits = resp?.hits as ArticleType[];

      setTotalArticle(resp?.nbHits);
      setArticles((prev) => [...prev, ...hits]);

      setIsLoading(false);

      paging = paging + 1;
      if (paging === resp?.nbPages) {
        isPaging = false;
        setScrolling(true);
        return;
      }

      isFetching = false;
      setScrolling(true);
      setSearchState(false);
      setPageOnLoad(false);
    }

    async function scrollHandler(e: WheelEvent) {
      if (el!.scrollWidth - (window.innerWidth + el!.scrollLeft) <= 200) {
        if (e.deltaY < 0 || isFetching || !isPaging) return;
        queryNews(keyword);
      }
    }

    queryNews(keyword);
    el!.addEventListener("wheel", scrollHandler);

    return () => {
      el!.removeEventListener("wheel", scrollHandler);
    };
  }, [keyword, setSearchState, windowResized]);

  //直向卷軸

  useEffect(() => {
    if (!windowResized) return;

    let isFetching = false;
    let isPaging = true;
    let paging = 0;

    setArticles([]);

    async function queryNews(input: string) {
      isFetching = true;
      setIsLoading(true);
      setScrolling(false);
      setSearchState(true);
      setPageOnLoad(true);

      const resp = await index.search(`${input}`, {
        page: paging,
      });
      const hits = resp?.hits as ArticleType[];
      setTotalArticle(resp?.nbHits);
      setArticles((prev) => [...prev, ...hits]);

      setIsLoading(false);

      paging = paging + 1;
      if (paging === resp?.nbPages) {
        isPaging = false;
        setScrolling(true);
        return;
      }

      isFetching = false;
      setScrolling(true);
      setSearchState(false);
      setPageOnLoad(false);
    }

    async function scrollHandler(e: WheelEvent) {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        if (isFetching || !isPaging) return;
        queryNews(keyword);
      }
    }

    queryNews(keyword);
    window.addEventListener("wheel", scrollHandler);

    return () => {
      window.removeEventListener("wheel", scrollHandler);
    };
  }, [keyword, setSearchState, windowResized]);

  //all content length calculation

  const blockWidth = useRef(0);
  const contentLength = useRef(0);

  useEffect(() => {
    if (windowResized) return;

    blockWidth.current = newsBlockRef.current?.offsetWidth!;

    if (windowWidth >= 1280) {
      contentLength.current =
        Math.ceil(totalArticle / 2) * blockWidth.current +
        Math.ceil(totalArticle / 2) * 60;
    }
    if (windowWidth < 1280) {
      contentLength.current =
        Math.ceil(totalArticle / 2) * blockWidth.current +
        Math.ceil(totalArticle / 2) * 30;
    }
  }, [totalArticle, windowResized]);

  //進度條位置
  useEffect(() => {
    if (windowResized) return;

    const el = scrollRef.current;
    const railRef = timelineRef.current;

    if (!articleState) return;
    if (!scrolling) return;
    const scrollMovingHandler = (e: WheelEvent) => {
      e.preventDefault();

      if (distance >= railRef?.offsetWidth! - 20) {
        setDistance((prev) => Math.min(railRef?.offsetWidth! - 20, distance));
      }
      setDistance((prev) =>
        Math.max(
          prev +
            (e.deltaY / (contentLength.current - windowWidth)) *
              railRef?.offsetWidth!,
          0
        )
      );
    };

    el!.addEventListener("wheel", scrollMovingHandler);
    return () => el!.removeEventListener("wheel", scrollMovingHandler);
  }, [articleState, distance, contentLength, scrolling, windowResized]);


  const scrollBackFirst = () => {
    if (!scrollRef) return;

    scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setDistance(0);
  };

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();

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

  async function renderViews(
    order: number,
    views: number,
    newsId: string,
    articles: ArticleType[]
  ) {
    const updatedArticles = await gainViews(order, views, newsId, articles);
    setArticles(updatedArticles);
  }

  function MobileCardOnLoad(){
     return Array.from({
       length: 10,
     }).map((_, index) => {
       return (
         <MobileNewsBlock key={"key-" + index}>
           <MobileNewsContentDiv>
             <MobileOnLoadText />
           </MobileNewsContentDiv>
           <MobileOnLoadImgDiv />
         </MobileNewsBlock>
       );
     });
  }

  return (
    <>
      <Container>
        {/* {mobileCardOnLoad()} */}
        {windowResized ? (
          <>
            <MobileContainer ref={MobileScrollRef}>
              <MobileNewsPanel>
                {isLoading && articleState.length > 0 && (
                  <LoadResult>
                    載入新聞中
                    <Loading
                      type="balls"
                      color="#000000"
                      width="12px"
                      height="12px"
                    />
                  </LoadResult>
                )}

                {keyword &&
                  articleState.length === 0 &&
                  searchState === true && (
                    <NoResult>搜尋 "{keyword}" 中</NoResult>
                  )}
                {keyword &&
                  articleState.length === 0 &&
                  searchState === false && (
                    <NoResult>沒有 "{keyword}" 的查詢結果</NoResult>
                  )}

                {!keyword && articleState.length === 0 && pageOnLoad
                  ? MobileCardOnLoad()
                  : articleState.map((article, index) => {
                      return (
                        <MobileNewsBlock
                          key={`key-` + index}
                          onClick={() => {
                            setIsOpen((prev) => !prev);
                            setOrder(index);
                            renderViews(
                              index,
                              article.clicks,
                              article.id,
                              articleState
                            );
                          }}
                          ref={newsBlockRef}
                        >
                          <MobileNewsContentDiv>
                            <NewsInformDivLarge>
                              <CategoryTag categoryName={article.category} />
                              <NewsInformTime>
                                {timeExpression(article.publishedAt)}
                              </NewsInformTime>
                            </NewsInformDivLarge>

                            <NewsBlockContent>
                              <NewsBlockTitle>
                                <Highlighter
                                  highlightClassName="Highlight"
                                  searchWords={[keyword]}
                                  autoEscape={true}
                                  textToHighlight={`${
                                    article.title.split(" - ")[0]
                                  }`}
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
                            </NewsBlockContent>
                            <UserInteractDiv>
                              <ViewCountDiv>
                                <ViewCount clicks={article.clicks} />
                              </ViewCountDiv>
                              <SavedNewsDiv>
                                <SavedNewsBtn
                                  newsId={article.id}
                                  unOpen={() => setIsOpen(false)}
                                />
                              </SavedNewsDiv>
                            </UserInteractDiv>
                          </MobileNewsContentDiv>
                          {article.urlToImage && (
                            <MobileNewsPhotoDiv newsImg={article.urlToImage} />
                          )}
                        </MobileNewsBlock>
                      );
                    })}
              </MobileNewsPanel>
            </MobileContainer>

            <MobileFooter />
          </>
        ) : (
          <TimelinePanel>
            {isLoading && articleState.length > 0 && (
              <LoadResult>
                載入新聞中
                <Loading
                  type="balls"
                  color="#000000"
                  width="12px"
                  height="12px"
                />
              </LoadResult>
            )}

            {keyword && articleState.length === 0 && searchState === true && (
              <NoResult>搜尋 "{keyword}" 中</NoResult>
            )}
            {keyword && articleState.length === 0 && searchState === false && (
              <NoResult>沒有 "{keyword}" 的查詢結果</NoResult>
            )}
            <NewsPanelWrapper ref={scrollRef}>
              {keyword && articleState.length === 0 ? null : (
                <TimelineShow>
                  <TimelineHide ref={timelineRef}>
                    <TargetHide movingLength={distance} />
                    <ScrollTarget />
                  </TimelineHide>
                </TimelineShow>
              )}

              <FlyBackBtn
                ref={setTriggerRef}
                onClick={() => {
                  scrollBackFirst();
                }}
              />
              {visible && (
                <div
                  ref={setTooltipRef}
                  {...getTooltipProps({ className: "tooltip-container" })}
                >
                  <div {...getArrowProps({ className: "tooltip-arrow" })} />
                  Back to latest news
                </div>
              )}

              <NewsPanel>
                <>
                  {!keyword && articleState.length === 0 && pageOnLoad
                    ? cardOnLoad()
                    : articleState.map((article, index) => {
                        return (
                          <NewsBlock
                            key={`key-` + index}
                            onClick={() => {
                              setIsOpen((prev) => !prev);
                              setOrder(index);
                              renderViews(
                                index,
                                article.clicks,
                                article.id,
                                articleState
                              );
                            }}
                            ref={newsBlockRef}
                          >
                            {article.urlToImage && (
                              <NewsBlockPhotoDiv newsImg={article.urlToImage} />
                            )}
                            <NewsInformDivLarge>
                              <CategoryTag categoryName={article.category} />
                              <NewsInformTime>
                                {timeExpression(article.publishedAt)}
                              </NewsInformTime>
                            </NewsInformDivLarge>

                            <NewsBlockContent>
                              <NewsBlockTitle>
                                <Highlighter
                                  highlightClassName="Highlight"
                                  searchWords={[keyword]}
                                  autoEscape={true}
                                  textToHighlight={
                                    article.title.split(" - ")[0]
                                  }
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
                              <UserInteractDiv>
                                <ViewCountDiv>
                                  <ViewCount clicks={article.clicks} />
                                </ViewCountDiv>
                                <SavedNewsDiv>
                                  <SavedNewsBtn
                                    newsId={article.id}
                                    unOpen={() => setIsOpen(false)}
                                  />
                                </SavedNewsDiv>
                              </UserInteractDiv>
                              {TimeInterval(article.publishedAt, index)}

                              {index % 2 === 0 ? (
                                <SourceTag>{article.source["name"]}</SourceTag>
                              ) : (
                                <SourceTagEven>
                                  {article.source["name"]}
                                </SourceTagEven>
                              )}
                            </NewsBlockContent>
                          </NewsBlock>
                        );
                      })}
                </>
              </NewsPanel>
            </NewsPanelWrapper>
          </TimelinePanel>
        )}
        {isOpen && (
          <Modal news={articleState[order]} onClose={() => setIsOpen(false)} />
        )}
      </Container>
    </>
  );
}

export default Home;
