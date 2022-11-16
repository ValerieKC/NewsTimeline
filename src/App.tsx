import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import { createGlobalStyle } from "styled-components"
import { Reset } from "styled-reset"
import Header from "./components/header"
import { AuthContextProvider } from "./context/authContext"
import "./App.css"

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing:border-box;
  }

  body{
    font-family:'Noto Sans TC', sans-serif;
    font-size:20px;
    position:relative;
    overflow: hidden;
@media screen and (max-width: 1279px) {
   font-size:16px;
  }

  }

  #root{
        height:100vh;

  }
`;

function App() {
  // async function fetchNews() {
  //   const result = await api.fetchApi();
  //   console.log(result);
  // }
  // fetchNews();
  const [keyword, setKeyword] = useState<string>("")

  return (
    <>
      <Reset />
      <GlobalStyle />
      <AuthContextProvider>
        <Header keyword={keyword} setKeyword={setKeyword} />
        <Outlet context={{ keyword, setKeyword }} />
      </AuthContextProvider>
    </>
  )
}

export default App
