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

  function Hit({ hit }:{hit:any}) {
    return (
      <div>
        <p>{hit.title}</p>
      </div>
    );
  }

  return (
    <InstantSearch searchClient={searchClient} indexName="newstimeline">
      <SearchBox searchAsYouType={false} />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  );
}

export default SearchInput;
