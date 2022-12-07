import React, { useRef, useEffect, useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { useOutletContext } from "react-router-dom";
import { debounce } from "lodash";
import Modal from "../components/modal";
import Highlighter from "react-highlight-words";
import algoliasearch from "algoliasearch";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { ArticleType } from "../utils/articleType";


export default async function gainViews(
  order: number,
  views: number,
  newsId: string,
  articles:ArticleType[]
) {
  await updateDoc(doc(db, "news", newsId), {
    clicks: views + 1,
  });

  const newArticles = articles.map((item, index) => {
    if (index === order) {
      item.clicks = views + 1;
    }
    return item;
  });
  return newArticles
}
