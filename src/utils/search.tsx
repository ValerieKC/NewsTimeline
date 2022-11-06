import algoliasearch from "algoliasearch";
import React, { useState, useEffect } from "react";
const client = algoliasearch("SZ8O57X09U", "fcb0bc9c88ae7376edbb907752f92ee6");
const index = client.initIndex("newstimeline");

function SearchInput() {
  let total: number;
  const [pageState, setPageState] = useState<number>(0);

  index.search("台中").then((resp) => {
    setPageState(resp.nbHits);
  });
  index.search("台中", { hitsPerPage: pageState + 1 }).then(({ hits }) => {
    let searchTotal: string[] = [];

    const totalHits = hits.map((news) => searchTotal.push(news.objectID));
    console.log(searchTotal);
  });
}

export default SearchInput;
