// import api from "./config.js"
const api = require("./config.cjs");

const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore.
const firebase = require("firebase-admin");
firebase.initializeApp();
const firestore = firebase.firestore();
const fetch = require("node-fetch");

const { Readability } = require("@mozilla/readability");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const baseUrl = `https://newsapi.org/v2/`;

const apiKey = api.key;

// const country = [`tw`,`us`];
const country = [`us`];
// const category = [
//   "business",
//   "entertainment",
//   "general",
//   "health",
//   "science",
//   "sports",
//   "technology",
// ];

const category = ["technology"];

exports.us7_NewsApi = functions.pubsub
  .schedule("30 06 * * *")
  .timeZone("Asia/Taipei")
  .onRun(async (context) => {
    async function fetchNewsApi(nation, category) {
      try {
        const response = await fetch(
          `${baseUrl}top-headlines?country=${nation}&category=${category}&pageSize=100&apiKey=${apiKey}`
        );
        const data = await response.json();
        const articles = data.articles;
        const newArticles = articles.map((article) => {
          let addParameter = {
            country: nation,
            category: category,
          };
          return { ...article, ...addParameter };
        });
        return newArticles;
      } catch (e) {
        console.error("fetchNewsApi() failed:", e);
      }
    }

    async function fetchContent(url, index) {
      try {
        const resp = await fetch(url);
        const result = await resp.text();
        let dom = new JSDOM(result, {
          url: url,
        });
        let article = new Readability(dom.window.document).parse();
        if (!article) return null;
        if (!article.textContent) return null;

        return article.textContent;
      } catch (e) {
        console.error(index, "fetchContent failed:", e);
      }
    }

    console.log("fetch NEWS API start!!!!");
    const datas = [];
    for (let i = 0; i < country.length; i++) {
      for (let j = 0; j < category.length; j++) {
        const result = await fetchNewsApi(country[i], category[j]);

        datas.push(...result);
      }
    }

    const uniqueDatas = datas.filter(
      (item, index, arr) => arr.findIndex((t) => t.url === item.url) === index
    );

    await Promise.allSettled(
      uniqueDatas.map(async (article, index) => {
        console.log("fetchContent() start:", index);
        const articleContent = await fetchContent(article.url, index);
        console.log(`${index},,${articleContent}`);
        if (articleContent === null || article.urlToImage === null) return;

        try {
          const getIdRef = firestore.collection("news").doc();
          await getIdRef.set({
            id: getIdRef.id,
            author: article.author,
            category: article.category,
            country: article.country,
            briefContent: article.content,
            description: article.description,
            publishedAt: new Date(Date.parse(article.publishedAt)),
            source: {
              id: article["source"]["id"],
              name: article["source"]["name"],
            },
            title: article.title,
            url: article.url,
            urlToImage: article.urlToImage,
            articleContent: articleContent,
            clicks: 0,
          });

          console.log("finish crawling and writing:", index);
        } catch (e) {
          console.error(index, "writes to firedtore failed!", e);
        }
      })
    );

    console.log("done");
    return null;
  });
