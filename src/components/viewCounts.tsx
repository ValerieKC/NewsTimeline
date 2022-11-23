import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  doc,
  collection,
  getDoc,
  DocumentSnapshot,
  DocumentData,
  updateDoc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import EyeImg from "../pages/view.png";

const ViewsDiv = styled.div`
  display: flex;
`;

const ViewImg = styled.img`
  width: 100%;
  height: 100%;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1280px) {
  }
`;

const ViewsNumber = styled.div``;

function NewsViews({
  newsId,
  viewsCounts,
  clickStatus,
}: {
  newsId: string;
  viewsCounts: number;
  clickStatus: boolean;
}) {



  return (
    <ViewsDiv>
      <ViewImg src={EyeImg} />
      <ViewsNumber>{viewsCounts}</ViewsNumber>
    </ViewsDiv>
  );
}

export default NewsViews;
