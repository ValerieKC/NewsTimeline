import styled from "styled-components";
import EyeImg from "../pages/view.png";


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

export default function ViewCount({ clicks }: { clicks: number }) {
  return (
      <ViewsDiv>
        <ViewImg src={EyeImg} />
        <ViewsNumber>{clicks}</ViewsNumber>
      </ViewsDiv>
  );
}
