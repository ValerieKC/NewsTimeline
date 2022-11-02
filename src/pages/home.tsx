import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase.js";
import { Portal, PortalWithState } from "react-portal";
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

const PortalRoot = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #00000073;
  overflow-y: scroll;
  display: ${(props: Prop) => props.show};
  ::-webkit-scrollbar {
    /* display: none; */
  }
`;

const PortalContent = styled.div`
  width: 60%;
  height: 1000px;
  margin: 100px auto;
  background: #fff;
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
  content: string | null;
  country: string;
  description: string | null;
  id: string;
  publishedAt: number;
  source: {id:string | null,name:string | null};
  title: string;
  url: string;
  uriToImage: string;
}

interface Prop {
  show?: string;
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
    async function queryNews(item: number | QueryDocumentSnapshot<DocumentData>) {
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
      if (el!.scrollWidth - (window.innerWidth + el!.scrollLeft) <= 100) {
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

  const [urlState, setUrlState] = useState<string>("");

  // async function fetchNewsContent(url:string){
  //   const resp = await fetch(url);
  //   const result = await resp.text();
  //   let dom = new JSDOM(result, {
  //     url: url,
  //   });
  //   let newsArticle = new Readability(dom.window.document).parse();
  //   console.log(newsArticle!.textContent);
  // }

  const [modalState, setModalState] = useState<boolean>(true);

  return (
    <>
      <Header />
      <Container>
        <TimelinePanel ref={scrollRef}>
          <NewsPanel>
            {articleState.map((article, index) => {
              return (
                <PortalWithState closeOnEsc key={`key-` + index}>
                  {({ openPortal, closePortal, isOpen, portal }) => (
                    <React.Fragment>
                      <NewsBlock
                        key={`key-` + index}
                        onClick={() => {
                          openPortal();
                          setModalState((prev) => !prev);
                        }}
                        data-url={article.url}
                      >
                        {index}
                        {article.title}
                        <br />
                        {article.author}
                      </NewsBlock>

                      {portal(
                        <PortalRoot
                          onClick={() => setModalState((prev) => !prev)}
                          show={modalState ? "none" : "flex"}
                        >
                          <PortalContent
                            onClick={() => {
                              setModalState(true);
                            }}
                            // fetchContent(article.url);
                          ></PortalContent>
                        </PortalRoot>
                      )}
                    </React.Fragment>
                  )}
                </PortalWithState>
              );
            })}
            {/* <NewsBlock>1</NewsBlock>
            <NewsBlock>2</NewsBlock>*/}
          </NewsPanel>
        </TimelinePanel>
      </Container>
    </>
  );
}

export default Home;
