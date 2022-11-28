import React,{ useEffect, useState } from "react";
import styled from "styled-components"
import NewsArticleBlock from "../components/newsArticleBlock";
import {
  doc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../utils/firebase";

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  margin: 30px auto 150px;
  width: 800px;
  @media screen and (max-width: 799px) {
    margin: 10px auto 50px;
    width: 100%;
    min-width: 360px;
  }
`;

const HotNewsTitle = styled.div`
width:fit-content;
border-bottom: 3px solid #000000;
  font-size: 36px;
  font-weight: bold;
  line-height: 55px;
`

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

function HotNews() {
  const [hotNewsState, setHotNews] = useState<ArticleType[]>([]);

  useEffect(() => {
    async function getHotNews() {
      const newsRef = collection(db, "news");
      const q = query(newsRef, orderBy("clicks", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      const hotNews: ArticleType[] = [];
      querySnapshot.forEach((doc) => hotNews.push(doc.data() as ArticleType));
      setHotNews(hotNews);
    }

    getHotNews();
  }, []);


  return (
    <Container>
      <Wrapper>
        <HotNewsTitle>Hot NEWS</HotNewsTitle>
        <NewsArticleBlock newsState={hotNewsState} />
      </Wrapper>
    </Container>
  );
}

export default HotNews;
