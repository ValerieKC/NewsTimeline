import  {
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Link, useLocation } from "react-router-dom";

import ReactLoading from "react-loading";

import styled from "styled-components";
import { AuthContext } from "../context/authContext";
import Arrow from "./downwards-arrow-key.png";

const MemberBtnDiv = styled.div`
  width: 50%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  @media screen and (max-width: 1280px) {
    font-size: 12px;
    height: 50px;
  }
`;

const MemberStrg = styled.div``;
const ArrowDiv = styled.div`
  width: 12px;
  height: 100%;
  background-image: url(${Arrow});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  @media screen and (max-width: 799px) {
    width: 8px;
    transform: scaleY(-1);
  }
`;

const LogInBtn = styled(MemberBtnDiv)``;

const Loading = styled(ReactLoading)`
  width: 40px;
  height: 40px;
  /* margin-right: 20px; */
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LogInLink = styled(Link)`
  text-decoration: none;
`;

export default function StatusBtn({setIsOpenMenu }:{setIsOpenMenu:Dispatch<SetStateAction<boolean>>}) {

  const { isLoading, userState } = useContext(AuthContext);
  if (isLoading) {
    return (
      <Loading type="spinningBubbles" color="#000000" height={24} width={24} />
    );
  } else {
    return userState.logIn ? (
      <MemberBtnDiv
        onClick={(e) => {
          setIsOpenMenu((prev) => !prev);
          e.stopPropagation();
        }}
      >
        <MemberStrg>帳戶</MemberStrg>
        <ArrowDiv />
      </MemberBtnDiv>
    ) : (
      <LogInBtn>
        <LogInLink to="/account">登入</LogInLink>
      </LogInBtn>
    );
  }
}
