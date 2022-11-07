import algoliasearch from "algoliasearch";
import React, { useState, useEffect } from "react";
const client = algoliasearch("SZ8O57X09U", "fcb0bc9c88ae7376edbb907752f92ee6");
const index = client.initIndex("newstimeline");

function SearchInput() {
  let total: number;
  const [pageState, setPageState] = useState<number>(0);

  async function searchNews() {
    const resp = await index.search("", { page: 2 });
    console.log(resp);
  }
  searchNews();
}

export default SearchInput;
