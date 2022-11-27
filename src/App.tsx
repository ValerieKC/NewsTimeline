import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";
import Header from "./components/header";
import { AuthContextProvider } from "./context/authContext";
import "./App.css";

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing:border-box;
  }

  body{
    font-family:'Noto Sans TC', sans-serif;
    font-weight: 300;
    font-size:16px;
    line-height: 20px;
    position:relative;
    overflow: hidden;
    @media screen and (max-width: 1280px) {
       font-size:14px;
       line-height: 18px;

  }

  }

  #root{
        height:100vh;
        background-color: #f1eeed;
  }
`;

function App() {
  // async function fetchNews() {
  //   const result = await api.fetchApi();
  //   console.log(result);
  // }
  // fetchNews();
  const [keyword, setKeyword] = useState<string>("");
const [searchState, setSearchState] = useState<boolean>(true);

  return (
    <>
      <Reset />
      <GlobalStyle />
      <AuthContextProvider>
        <Header
          keyword={keyword}
          setKeyword={setKeyword}
          searchState={searchState}
          setSearchState={setSearchState}
        />
        <Outlet
          context={{ keyword, setKeyword, searchState, setSearchState }}
        />
      </AuthContextProvider>
    </>
  );
}

export default App;
