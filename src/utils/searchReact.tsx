import React, { useState } from "react";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Hits,
  useInstantSearch,
} from "react-instantsearch-hooks-web";

const searchClient = algoliasearch(
  "SZ8O57X09U",
  "0cbbf774149c55f5830de69053290117"
);


function SearchInput() {

  const [result, setResult] = useState<string[]>([]);

  function Stats(): any {
    const { results } = useInstantSearch();
    let objectIndex: number[] = [];
    const hits = results.hits;
    const newResults = hits.map((id) => objectIndex.push(id.objectID));
    console.log(hits);
  }

  return (
    <InstantSearch searchClient={searchClient} indexName="newstimeline">
      <SearchBox searchAsYouType={false} />
      <Stats />
      {/* {Stats()} */}
    </InstantSearch>
  );
}

export default SearchInput;
