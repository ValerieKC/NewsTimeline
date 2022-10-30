function FetchContent(){
let url =
  "https://newsapi.org/v2/everything?" +
  "q=Apple&" +
  "sortBy=publishedAt&" +
  "apiKey=ea52c362b8da48b58557203c34dba3ef";

// Make the request with axios' get() function
fetch(url).then(function (r1) {
  console.log(r1);
  // let firstResult = r1.data.articles[0];
});

}

export default FetchContent