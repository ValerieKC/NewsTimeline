import fetch from "node-fetch";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

// function FetchContent() {
// let url =
//   "https://www.tmz.com/2022/10/30/chris-redd-attack-injury-photos-brass-knuckles/";
let url =
  "https://www.nbcnews.com/pop-culture/music/dolly-parton-says-doesnt-plan-tour-confirms-rock-n-roll-album-rcna54633";

async function fetchData() {
  const resp = await fetch(url);
  const result = await resp.text();
  let dom = new JSDOM(result, {
    url: url,
  });
  let article = new Readability(dom.window.document).parse();
  console.log(article.textContent);
}
// }

fetchData();

// export default FetchContent;
