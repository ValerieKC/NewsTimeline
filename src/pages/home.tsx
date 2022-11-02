import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase.js";
import {
  doc,
  getDocs,
  getDoc,
  setDoc,
  collection,
  updateDoc,
  query,
  orderBy,
  startAfter,
  limit,
  where,
} from "firebase/firestore";
const Header = styled.div`
  width: 100%;
  height: 90px;
  outline: 2px solid salmon;
`;

const Container = styled.div``;

const TimelinePanel = styled.div`
  /* width: 100%; */
  height: 800px;
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
  width: 300px;
  height: 200px;
  background-color: lightcoral;
  &:nth-child(even) {
    margin-left: 100px;
  }
`;

interface WheelEvent<T = Element> {
  preventDefault: any;
  deltaMode: number;
  deltaX: number;
  deltaY: number;
  deltaZ: number;
}

function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const scrollEvent = (e: WheelEvent<HTMLDivElement>) => {
        // console.log(el.scrollLeft, e.deltaY);

        e.preventDefault();
        el.scrollLeft += e.deltaY;
      };
      el.addEventListener("wheel", scrollEvent);
      return () => el.removeEventListener("wheel", scrollEvent);
    }
  }, []);

  const [articleState, setArticles] = useState<
    {
      author: string | null;
      category: string;
      content: string | null;
      country: string;
      description: string | null;
      id: string;
      publishedAt: number;
      source: any;
      title: string;
      url: string;
      uriToImage: string;
    }[]
  >([]);

  // console.log(articleState);

  useEffect(() => {
    let latestDoc: any = null;
    let isFetching = false;
    async function queryNews(item: any) {
      isFetching = true;
      const q = query(
        collection(db, "news"),
        orderBy("publishedAt"),
        startAfter(item || 0),
        limit(10)
      );
console.log("ok")
      const querySnapshot = await getDocs(q);
      ///////這裡有個any////////
      const newPage: any = [];
      querySnapshot.forEach((doc) => {
        return newPage.push(doc.data());
      });
      setArticles((prev) => [...prev, ...newPage]);

      latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      if (!latestDoc) {
        return;
      }

      isFetching = false;
    }

    ///////這裡有個any////////
    async function scrollHandler(e: any) {
      const el = scrollRef.current;
      if (el!.scrollWidth - (window.innerWidth + el!.scrollLeft) > 100) {
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

  return (
    <>
      <Header />
      <Container>
        <TimelinePanel ref={scrollRef}>
          <NewsPanel>
            {articleState.map((article, index) => {
              return (
                <NewsBlock key={`key-` + index}>
                  {index}
                  {article.title}
                  <br />
                  {article.author}
                </NewsBlock>
              );
            })}
            {/* <NewsBlock>1</NewsBlock>
            <NewsBlock>2</NewsBlock>
            <NewsBlock>3</NewsBlock>
            <NewsBlock>4</NewsBlock>
            <NewsBlock>5</NewsBlock>
            <NewsBlock>1</NewsBlock>
            <NewsBlock>2</NewsBlock>
            <NewsBlock>3</NewsBlock>
            <NewsBlock>4</NewsBlock>
            <NewsBlock>5</NewsBlock> */}
          </NewsPanel>
        </TimelinePanel>
      </Container>
    </>
  );
}

export default Home;
