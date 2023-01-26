import styled, { keyframes } from "styled-components";

const NewsBlock = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 333px;
  height: 370px;
  justify-content: center;
  ////////
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0px 0px 11px 2px rgba(0, 0, 0, 0.35);
  -webkit-box-shadow: 0px 0px 11px 2px rgba(0, 0, 0, 0.35);
  -moz-box-shadow: 0px 0px 11px 2px rgba(0, 0, 0, 0.35);
  
  &:nth-child(even) {
    left: 60px;
  }
  
  @media screen and (max-width: 1280px) {
    height: calc((100% - 40px) / 2);

    &:nth-child(even) {
      left: 30px;
    }
  }

  @media screen and (max-width: 700px) {
    width: 300px;
    height: 360px;
    &:nth-child(even) {
      left: 0px;
    }
  }
`;


const Animation = keyframes`
   0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
`;

const PageOnLoadPhoto = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  animation: ${Animation} 0.5s linear infinite alternate;
`;

const PageOnLoadContent = styled.div`
  padding: 10px 20px;
  width: 100%;
  height: 55%;
`;

const PageOnLoadInformDiv = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 20px;
`;

const PageOnLoadInformTag = styled.div`
  width: 30%;
  height: 20px;
  margin-right: auto;
  animation: ${Animation} 0.5s linear infinite alternate;
  border-radius: 10px;
`;

const PageOnLoadInformTime = styled.div`
  width: 20%;
  height: 20px;
  margin-left: auto;
  animation: ${Animation} 0.5s linear infinite alternate;
  border-radius: 10px;
`;

const PageOnLoadDescription = styled.div`
  width: 100%;
  height: 70%;
  animation: ${Animation} 0.5s linear infinite alternate;
  border-radius: 10px;
`;

export function HomePageCardOnLoad() {
  return Array.from({
    length: 12,
  }).map((_, index) => {
    return (
      <NewsBlock key={`key-${index}`}>
        <PageOnLoadPhoto />
        <PageOnLoadContent>
          <PageOnLoadInformDiv>
            <PageOnLoadInformTag />
            <PageOnLoadInformTime />
          </PageOnLoadInformDiv>
          <PageOnLoadDescription />
        </PageOnLoadContent>
      </NewsBlock>
    );
  });
}

const MobileNewsBlock = styled.div`
  width: calc(100% - 40px);
  height: 136px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  &:hover {
    cursor: pointer;
  }
`;

const MobileNewsContentDiv = styled.div`
  padding: 10px;
  width: calc(100% - 120px);
  display: flex;
  flex-direction: column;
`;

const MobileOnLoadText = styled.div`
  padding: 10px;
  height: 116px;
  animation: ${Animation} 0.5s linear infinite alternate;
`;

const MobileOnLoadImgDiv = styled.div`
  width: 120px;
  height: 75px;
  margin-left: auto;
  border-radius: 2px;
  animation: ${Animation} 0.5s linear infinite alternate;
`;
export function MobileCardOnLoad() {
  return Array.from({
    length: 10,
  }).map((_, index) => {
    return (
      <MobileNewsBlock key={`key-${index}`}>
        <MobileNewsContentDiv>
          <MobileOnLoadText />
        </MobileNewsContentDiv>
        <MobileOnLoadImgDiv />
      </MobileNewsBlock>
    );
  });
}
