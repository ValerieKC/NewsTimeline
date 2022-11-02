import fetch from "node-fetch";
import { db } from "./firebase_fetchNews.js";
import { doc, setDoc, collection, updateDoc } from "firebase/firestore";
import fetchContent from "./fetchContent.js";

const baseUrl = `https://newsapi.org/v2/`;

// const apiKey = process.env.REACT_APP_NEWSAPI_KEY;
const apiKey = `2c24c6f282b54e1389b727bb2e1d61c7`
// const country = [`tw`,'us','jp'];
const country = [`tw`];
// const category = [
//   "business",
//   "entertainment",
//   "general",
//   "health",
//   "science",
//   "sports",
//   "technology",
// ];
const category = ["health", "science", "sports", "technology"];

async function fetchNewsApi(nation, category) {
  try {
    const response = await fetch(
      `${baseUrl}top-headlines?country=${nation}&category=${category}&pageSize=100&apiKey=${apiKey}`
    );
    const data = await response.json();
    const articles = data.articles;
    // console.log(articles)
    const newArticles = articles.map((article) => {
      let addParameter = {
        country: nation,
        category: category
      };
      return { ...article, ...addParameter };
    });
    return newArticles;
  } catch (e) {
    console.error("fetchNewsApi() failed", e);
  }
}

const datas = [];
for (let i = 0; i < country.length; i++) {
  for (let j = 0; j < category.length; j++) {
    const data = await fetchNewsApi(country[i], category[j]);
    datas.push(...data);
  }
}

const docRef = datas.map(async (article, index) => {
const articleContent = await fetchContent(article.url)
console.log(index)
  const getIdRef = doc(collection(db, "news"));
  setDoc(doc(db, "news", getIdRef.id), {
    id: getIdRef.id,
    author: article.author,
    category: article.category,
    country: article.country,
    brief_content: article.content,
    description: article.description,
    publishedAt: new Date(Date.parse(article.publishedAt)) ,
    source: { id: article["source"]["id"], name: article["source"]["name"] },
    title: article.title,
    url: article.url,
    urlToImage: article.urlToImage,
    article_content:articleContent
  });
 
});

 setDoc(doc(db, "articlesAmount","amount2_tw"), {
   amount: datas.length
 });

