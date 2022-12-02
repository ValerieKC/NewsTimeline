import React, { useRef, useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import Modal from "../components/modal";
import Highlighter from "react-highlight-words";
import algoliasearch from "algoliasearch";
import { RankingInfo } from "@algolia/client-search";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";
import SavedNewsBtn from "../components/savedNewsBtn";
import Arrow from "./left-arrow.png";
import timestampConvertDate from "../utils/timeStampConverter";
import EyeImg from "../pages/view.png";
import CategoryTag from "../components/categoryTag";
import ReactLoading from "react-loading";



const ViewsDiv = styled.div`
width:30px;
display: flex;
  align-items: center;
  @media screen and (max-width: 1280px) {
    width: 12px;
  }
`;

const ViewImg = styled.img`
  width: 14px;
  height: auto;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1280px) {
  }
`;

const ViewsNumber = styled.div`
font-size: 14px;
transform:translateY(-1px);
  @media screen and (max-width: 1280px) {
    font-size: 12px;
  }
`;

interface ArticleType {
  author: string | null;
  category: string;
  briefContent: string | null;
  country: string;
  description: string | null;
  id: string;
  publishedAt: { seconds: number; nanoseconds: number };
  source: { id: string | null; name: string | null };
  title: string;
  url: string;
  urlToImage: string;
  articleContent: string;
  clicks: number;
}

export default function ViewCount({ clicks }: { clicks: number }) {
  return (
      <ViewsDiv>
        <ViewImg src={EyeImg} />
        <ViewsNumber>{clicks}</ViewsNumber>
      </ViewsDiv>
  );
}
