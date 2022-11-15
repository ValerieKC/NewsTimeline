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
import Arrow from "./arrow-back.png";

const client = algoliasearch("SZ8O57X09U", "fcb0bc9c88ae7376edbb907752f92ee6");
const index = client.initIndex("newstimeline");

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimelinePanel = styled.div`
  width: 100%;
  height: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* background-color: #181f58; */
`;
const NewsPanelWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: #181f58;
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`;
const NewsPanel = styled.div`
  width: 100%;
  height: 500px;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  row-gap: 100px;
`;

const SourceTag = styled.div`
  width: 200px;
  padding: 0 5px;
  position: absolute;
  background-color: red;
  color: white;
  display: none;
  bottom: -48px;
  left: 0px;
  z-index: 5;
  text-align: center;
`;

const SourceTagEven = styled.div`
  width: 200px;
  /* padding: 0 5px; */
  position: absolute;
  background-color: red;
  color: white;
  display: none;
  top: -48px;
  left: 0px;
  z-index: 5;
  text-align: center;
`;

const NewsBlock = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 300px;
  min-width: 300px;
  height: 200px;
  background-color: #b8c1ec;

  &:hover {
    cursor: pointer;
  }
  &:nth-child(even) {
    margin-left: 100px;
  }
  &:hover > ${SourceTag} {
    display: block;
  }

  &:hover > ${SourceTagEven} {
    display: block;
  }

  &:first-child {
    margin-left: 40px;
  }

`;

const TimelineShow = styled.div`
  width: 100vw;
  position: absolute;
  transform: translateY(50%);
  background-color: #fff;
  height: 4px;
  overflow: hidden;
  bottom: 50%;
`;

const TimeTag = styled.div`
  /* width: 200px; */
  position: absolute;
  text-align: center;
  background-color: #ffffff;
  bottom: -48px;
  left: 0px;
  z-index: 4;
`;

const TimeTagEven = styled.div`
  position: absolute;
  text-align: center;
  background-color: #ffffff;
  top: -48px;
  left: 0px;
  z-index: 4;
`;

const ScrollTarget = styled.div`
  width: 10px;
  height: 4px;
  background-color: #f35b03;
  z-index: 7;
  /* margin-left: ${(props: ScrollProp) => props.movingLength}px; */
  transform: translateX(${(props: ScrollProp) => props.movingLength}px);
`;

const FlyBackBtn = styled.div`
  width: 100px;
  height: 80px;
  position: absolute;
  top: 50%;
  right: 20px;
  z-index: 8;
  transform: translateY(-50%);
  background-color: #88888850;
  background-image: url(${Arrow});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  &:hover {
    cursor: pointer;
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
  uriToImage: string;
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

function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLDivElement | null>(null);
  const { keyword, setKeyword } = useOutletContext<{
    keyword: string;
    setKeyword: Function;
  }>();
  const { userState, setUserState, isLogIn } = useContext(AuthContext);
  const [articleState, setArticles] = useState<ArticleType[]>([]);
  const [savedKeywords, setSavedKeyWords] = useState<string[]>();
  const [timelineLength, setTimeLineLength] = useState<number>(
    window.innerWidth
  );
  const [contentLength, setContentLength] = useState<number>(1);
  const [distance, setDistance] = useState<number>(0);

  const [scrolling, setScrolling] = useState<boolean>(true);

  console.log("ok");

  useEffect(() => {
    const el = scrollRef.current;

    if (el) {
      const scrollEvent = (e: WheelEvent) => {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      };
      el.addEventListener("wheel", scrollEvent);
      return () => el.removeEventListener("wheel", scrollEvent);
    }
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

      const resp = await index.search(`${input}`, { page: paging });
      const hits = resp.hits;
      //contentlength的公式化算法待測試，推測+300是因為最後一個新聞塊凸出來，凸出來的部分必須要走完，-40是前面margin-left，設margin-right都會失效
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

  const el = scrollRef.current;
  if (el) {
    console.log(
      "window.innerWidth",
      window.innerWidth,
      "el.scrollWidth",
      el!.scrollWidth,
      "contentLength",
      contentLength
    );
  }
  function timestampConvertDate(time: string | number | Date) {
    const dateObj = new Date(time);
    const month = dateObj.getMonth();
    const date = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();
    const dataValue = `${month.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}/${date.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })} ${hours.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}:${minutes.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}:${seconds.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}`;
    return dataValue;
  }

  // 刪除儲存關鍵字
  useEffect(() => {
    if (userState.uid) {
      const unsub = onSnapshot(doc(db, "users", userState.uid), (doc: any) => {
        setSavedKeyWords(doc.data().savedKeyWords);
      });
      return () => unsub();
    }
  }, [userState.uid]);

  async function deleteSavedKeyword(keyword: string) {
    const userRef = doc(db, "users", userState.uid);
    await updateDoc(userRef, {
      savedKeyWords: arrayRemove(keyword),
    });
  }

  // 標示當前閱覽位置
  useEffect(() => {
    const el = scrollRef.current;
    if (!articleState) return;
    if (!scrolling) return;
    const scrollMovingHandler = (e: WheelEvent) => {
      if (e.deltaY < 0 && distance <= 0) {
        setDistance(0);
      }
      if (distance >= window.innerWidth - 10) {
        setDistance(window.innerWidth - 10);
      }
      e.preventDefault();
      setDistance(
        (prev) => prev + (e.deltaY / contentLength) * window.innerWidth
      );
    };

    el!.addEventListener("wheel", scrollMovingHandler);
    return () => el!.removeEventListener("wheel", scrollMovingHandler);
  }, [articleState, distance, window.innerWidth]);

  const scrollBackFirst = () => {
    console.log(firstRef.current);
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
                    }}
                    ref={index === 0 ? firstRef : null}
                  >
                    {index}
                    <br />
                    <Highlighter
                      highlightClassName="Highlight"
                      searchWords={[keyword]}
                      autoEscape={true}
                      textToHighlight={`${article.title}`}
                    />
                    {article.author}

                    <SavedNews
                      newsId={article.id}
                      unOpen={() => setIsOpen(true)}
                    />
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
        {/* <BulletinPanel>
          <UserPanel>
            <UserPhotoDiv />
            <UserName>{userState.displayName}</UserName>
          </UserPanel>
          <PopularPanel>
            <SavedKeyWordsPanel>
              <PanelTitle>儲存關鍵字</PanelTitle>
              {savedKeywords &&
                savedKeywords.map((item, index) => {
                  return (
                    <KeyWordBlock key={index + item}>
                      <KeyWordText
                        onClick={() => {
                          setKeyword(item);
                        }}
                      >
                        {item}
                      </KeyWordText>
                      <KeyWordDelete
                        onClick={() => {
                          deleteSavedKeyword(item);
                        }}
                      >
                        X
                      </KeyWordDelete>
                    </KeyWordBlock>
                  );
                })}
            </SavedKeyWordsPanel>
            <PopularNewsPanel>
              <PanelTitle>熱門新聞</PanelTitle>
            </PopularNewsPanel>
            <PopularChatRoomPanel>
              <PanelTitle>熱門聊天室</PanelTitle>
            </PopularChatRoomPanel>
          </PopularPanel>
        </BulletinPanel> */}
      </Container>
    </>
  );
}

export default Home;
