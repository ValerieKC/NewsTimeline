import React from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox } from "react-instantsearch-hooks-web";

const searchClient = algoliasearch(
  "SZ8O57X09U",
  "0cbbf774149c55f5830de69053290117"
);

function SearchInput() {
  return (
    <InstantSearch searchClient={searchClient} indexName="newstimeline">
      <SearchBox />
    </InstantSearch>
  );
}

export default SearchInput