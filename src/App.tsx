import React from "react";
import { Outlet } from "react-router-dom";
// import api from "./utils/api";
// import FetchContent from "../fetchContent";

import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";
import logo from "./logo.svg";
import "./App.css";

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing:border-box;
  }

  body{
    font-family:'Noto Sans TC', sans-serif;
    height:100%;
  }

  #root{
  }
`;


function App() {
  // async function fetchNews() {
  //   const result = await api.fetchApi();
  //   console.log(result);
  // }
  // fetchNews();
  
  return (
    <>
    <Reset />
    <GlobalStyle />
    <Outlet />
    </>
  );
}

export default App;
