import React,{useState} from "react";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";
import Header from "./components/header"
import Home from "./pages/home"
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
  const [keyword, setKeyword] = useState<string>("");
  return (
    <>
      <Reset />
      <GlobalStyle />
      <Header keyword={keyword} setKeyword={setKeyword} />
      <Outlet context={{ keyword, setKeyword }} />
      {/* <Outlet /> */}
    </>
  );
}

export default App;
