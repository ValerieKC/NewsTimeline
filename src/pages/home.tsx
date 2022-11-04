import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase.js";
import { createPortal } from "react-dom";
import {
  getDocs,
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import Modal from "../components/modal";


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
  brief_content: string | null;
  country: string;
  description: string | null;
  id: string;
  publishedAt: number;
  source: { id: string | null; name: string | null };
  title: string;
  url: string;
  uriToImage: string;
  article_content: string;
}

function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  const [articleState, setArticles] = useState<ArticleType[]>([]);

  useEffect(() => {
    let latestDoc: QueryDocumentSnapshot<DocumentData>;
    let isFetching = false;
    async function queryNews(
      item: number | QueryDocumentSnapshot<DocumentData>
    ) {
      isFetching = true;
      const q = query(
        collection(db, "news"),
        orderBy("publishedAt"),
        startAfter(item || 0),
        limit(15)
      );
      const querySnapshot = await getDocs(q);
      const newPage: ArticleType[] = [];
      querySnapshot.forEach((doc) => newPage.push(doc.data() as ArticleType));
      setArticles((prev) => [...prev, ...newPage]);

      latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      if (!latestDoc) {
        return;
      }

      isFetching = false;
    }

    async function scrollHandler(e: WheelEvent) {
      const el = scrollRef.current;
      if (el!.scrollWidth - (window.innerWidth + el!.scrollLeft) <= 400) {
        if (e.deltaY < 0) return;
        if (isFetching) return;
        queryNews(latestDoc);
      }
    }

    queryNews(0);
    window.addEventListener("wheel", scrollHandler);
    return () => {
      window.removeEventListener("wheel", scrollHandler);
    };
  }, []);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [order,setOrder] = useState<number>(0)
  return (
    <>
      <Container>
        <TimelinePanel ref={scrollRef}>
          <NewsPanel>
            {articleState.map((article, index) => {
              // console.log(article.article_content)
              return (
                <NewsBlock
                  key={`key-` + index}
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                    setOrder(index);
                  }}
                >
                  {index}
                  {article.title}
                  <br />
                  {article.author}
                </NewsBlock>
              );
            })}
            {isOpen&&<Modal
              content={articleState[order]?.article_content}
              onClose={() => setIsOpen(false)}
            />}
            {/* <NewsBlock>1</NewsBlock>
            <NewsBlock>2</NewsBlock>*/}
          </NewsPanel>
        </TimelinePanel>
      </Container>
    </>
  );
}

export default Home;
