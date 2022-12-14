import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./pages/home";
import Account from "./pages/account";
import Member from "./pages/member"
import HotNews from "./pages/hotnews"

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="account" element={<Account />} />
        <Route path="member" element={<Member />} />
        <Route path="hotnews" element={<HotNews />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
