import fetch from "node-fetch";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

// let url =
//   "https://www.nbcnews.com/pop-culture/music/dolly-parton-says-doesnt-plan-tour-confirms-rock-n-roll-album-rcna54633";

async function fetchContent(url) {
  const resp = await fetch(url);
  const result = await resp.text();
  let dom = new JSDOM(result, {
    url: url,
  });
  let article = new Readability(dom.window.document).parse();
  // console.log(article);
  if (!article) return null;
  if (!article.textContent) return null;

  return article.textContent;
}


// fetchContent();

export default fetchContent;
