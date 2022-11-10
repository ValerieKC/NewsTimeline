import React, { useRef, useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import Modal from "../components/modal";
import Highlighter from "react-highlight-words";

import algoliasearch from "algoliasearch";
import { RankingInfo } from "@algolia/client-search";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";
import SavedNews from "../components/savedNews"

const client = algoliasearch("SZ8O57X09U", "fcb0bc9c88ae7376edbb907752f92ee6");
const index = client.initIndex("newstimeline");

const Container = styled.div``;

const TimelinePanel = styled.div`
  /* width: 100%; */
  padding-left: 30px;
  height: 600px;
  display: flex;
  align-items: center;
  background-color: #181f58;
  overflow-x: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`;

const NewsPanel = styled.div`
  width: 100%;
  height: 450px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  row-gap: 50px;
`;

const NewsBlock = styled.div`
  /* position: relative; */
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 300px;
  height: 200px;
  background-color: lightcoral;
  &:nth-child(even) {
    margin-left: 100px;
  }
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

function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const keyword = useOutletContext<{ keyword: string; setKeyword: () => {} }>();
  const { userState, setUserState, isLogIn } = useContext(AuthContext);
  const [articleState, setArticles] = useState<ArticleType[]>([]);

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
    setArticles([]);

    async function queryNews(input: string) {
      isFetching = true;

      const resp = await index.search(`${input}`, { page: paging });
      const hits = resp.hits;
      paging = paging + 1;
      let newHits: HitsType[] = [];
      hits.map((item) => newHits.push(item as HitsType));
      setArticles((prev) => [...prev, ...newHits]);
      if (paging === resp.nbPages) {
        isPaging = false;
        return;
      }
      isFetching = false;
    }

    async function scrollHandler(e: WheelEvent) {
      const el = scrollRef.current;
      if (el!.scrollWidth - (window.innerWidth + el!.scrollLeft) <= 400) {
        if (e.deltaY < 0) return;
        if (isFetching) return;
        if (!isPaging) return;
        queryNews(keyword.keyword);
      }
    }

    queryNews(keyword.keyword);
    window.addEventListener("wheel", scrollHandler);

    return () => {
      window.removeEventListener("wheel", scrollHandler);
    };
  }, [keyword.keyword]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);


  return (
    <>
      <Container>
        <TimelinePanel ref={scrollRef}>
          <NewsPanel>
            {articleState.map((article, index) => {
              return (
                <NewsBlock
                  key={`key-` + index}
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                    setOrder(index);
                  }}
                >
                  {index}
                  <br />
                  {new Date(article.publishedAt).toString()}
                  <br />
                  <br />

                  <Highlighter
                    highlightClassName="Highlight"
                    searchWords={[keyword.keyword]}
                    autoEscape={true}
                    textToHighlight={`${article.title}`}
                  />
                  {article.author}

                  <SavedNews
                    newsId={article.id}
                    unOpen={() => setIsOpen(true)}
                  />
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
        </TimelinePanel>
      </Container>
    </>
  );
}

export default Home;
