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
    background-color: #f1eeed;
    overflow: hidden;
    @media screen and (max-width: 1280px) {
       font-size:14px;
       line-height: 18px;

  }

   @media screen and (max-width: 700px) {
       /* min-height:auto; */
       overflow-y:scroll ;
        scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none; /* for Chrome, Safari, and Opera */
    }
  }

  }

  #root{
    min-width:360px;
        height:100vh;
        @media screen and (max-width: 700px) {
       height:auto;

  }
  }
`;

function App() {
  const [keyword, setKeyword] = useState<string>("");
  const [searchState, setSearchState] = useState<boolean>(false);

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
