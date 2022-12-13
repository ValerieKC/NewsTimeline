import { useContext } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const MenuDropDownDiv = styled.div`
  margin: 5px;
  width: 160px;
  height: 90px;
  position: absolute;
  right: 10px;
  top: 60px;
  z-index: 51;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 3px 5px rgba(0, 0, 0, 0.5);

  @media screen and (max-width: 1280px) {
    top: 40px;

    width: 120px;
    height: 67.5px;
    border-radius: 12px;
  }

  @media screen and (max-width: 700px) {
    top: -70px;
    right: 17%;
    border: none;
    width: 120px;
    height: 67.5px;
    border-radius: 12px;
  }
`;

const MenuDropDownList = styled.div`
  width: 140px;
  height: 36px;
  border-radius: 12px;
  &:hover {
    background-color: #e9e9e9;
    font-weight: bold;
  }

  @media screen and (max-width: 1280px) {
    top: 40px;

    width: 100px;
    height: 26px;
    border-radius: 8px;
  }
`;

const LinkBtn = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #000000;
  @media screen and (max-width: 1280px) {
    font-size: 12px;
  }
`;

export default function RenderOpenMenuList() {
  const { logOut } = useContext(AuthContext);

  return (
    <MenuDropDownDiv>
      <MenuDropDownList>
        <LinkBtn to="/member">收藏文章</LinkBtn>
      </MenuDropDownList>
      <MenuDropDownList
        onClick={(e) => {
          logOut();
        }}
      >
        <LinkBtn to="/account">登出</LinkBtn>
      </MenuDropDownList>
    </MenuDropDownDiv>
  );
}
