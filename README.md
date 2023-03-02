# News Timeline
[Website URL](https://newstimeline-62758.web.app/)

#### Test Account : guest@test.com
#### Test password : 1111111
#### Test DisplayName : guest

## Description
By displaying news on a horizontal timeline, this website tries to faithfully present the development
of news events, readers who visit this website are allowed to keep track of news development by
time at a glance.

### News Source API
Mainly from [News API](https://newsapi.org/)
But now I'm planing to change to [newscatcherapi](https://docs.newscatcherapi.com/api-docs/endpoints/latest-headlines)

## Technique

### Fundamentals
- HTML
- CSS
- JavaScript (ES6+)
- TypeScript
- Node.js

### Libraries
- React
- React Router
- Styled-Components
- Create React App
- Lodash Debounce

### Cloud Service 
- Firestore
- Hosting
- Cloud Functions
- Authentication
- Algolia

### Others
- ESLint

## Function Map
<p align="center">
  <img src="./src/img/functionMap(view).png" alt="Function Map(View)"/>
</p>
<p align="center">
  <img src="./src/img/functionMap(function).png" alt="Function Map(Function)"/>
</p>

## Flow Chart
<p align="center">
  <img src="./src/img/flowChart.png" alt="Flow Chart"/>
</p>

## 功能展示
- Implemented a horizontal infinite scroll to load news.
<p align="center">
  <img src="./src/img/readMe03.png" alt="Horizontal Infinite Scroll"/>
</p>


- Fulfilled the function to remember user’s five recent search keywords in search bar.
- Provided a saved keywords feature for member to save their favorite keywords.

<p align="center">
  <img src="./src/img/readMe04.png" alt="Search Function"/>
</p>

- Categorized news and can send search requests based on each category.
<p align="center">
  <img src="./src/img/readMe05.png" alt="Search Function"/>
</p>

- Monitored the total number of clicks of each news to rank popular news in Hot News page.

<p align="center">
  <img src="./src/img/readMe02.png" alt="HotNews page"/>
</p>

- Provided a saved news feature for member to store their favorite news.

<p align="center">
  <img src="./src/img/readMe06.png" alt="HotNews page"/>
</p>

- Used Styled-Components to build UI and RWD of the website.
<p align="center" width="100%">
<img src="./src/img/readMe07.png"  width="30%" height="100%" alt="RWD1"/>&nbsp;&nbsp;<img src="./src/img/readMe08.png"  width="30%" height="100%" alt="RWD2"/>&nbsp;&nbsp;<img src="./src/img/readMe09.png"  width="30%" height="100%" alt="RWD3"/>
</p>