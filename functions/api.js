import fetch from "node-fetch";
import { db } from "./firebase_fetchNews.js";
import { doc, setDoc, collection } from "firebase/firestore";
import fetchContent from "./fetchContent.js";



const baseUrl = `https://newsapi.org/v2/`;

// const apiKey = `ea52c362b8da48b58557203c34dba3ef`;
const apiKey = `2c24c6f282b54e1389b727bb2e1d61c7`;
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
const category = ["entertainment"];

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
        category: category,
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


  const uniqueDatas = datas.filter(
    (item, index, arr) => arr.findIndex((t) => t.url === item.url) === index
  );

console.log(datas.length,uniqueDatas.length)



const docRef = datas.map(async (article, index) => {
  console.log("fetchContent() start:", index);

  const articleContent = await fetchContent(article.url);
  console.log("fetchContent() finish:", index);

  const getIdRef = doc(collection(db, "news"));
  setDoc(doc(db, "news", getIdRef.id), {
    id: getIdRef.id,
    author: article.author,
    category: article.category,
    country: article.country,
    briefContent: article.content,
    description: article.description,
    publishedAt: article.publishedAt,
    source: { id: article["source"]["id"], name: article["source"]["name"] },
    title: article.title,
    url: article.url,
    urlToImage: article.urlToImage,
    articleContent: articleContent,
    clicks: 0,
  });
});

    console.log("done");

        // publishedAt: new Date(Date.parse(article.publishedAt)),


// setDoc(doc(db, "articlesAmount", "amount_tw2_health"), {
//   amount_datas: datas.length,
// });
