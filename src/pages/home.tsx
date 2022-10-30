import React, { useRef, useEffect } from "react";
import styled from "styled-components";

const Header = styled.div`
  width: 100%;
  height: 90px;
  outline: 2px solid salmon;
`;

const Container = styled.div``;

const TimelinePanel = styled.div`
  /* width: 100%; */
  height: 800px;
  display: flex;
  align-items: center;
  background-color: #181f58;
  overflow-x: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`;

const NewsPanel = styled.div`
  width: 100%;
  height: 450px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  row-gap: 50px;
`;

const NewsBlock = styled.div`
  width: 300px;
  height: 200px;
  background-color: lightcoral;
  &:nth-child(even) {
    margin-left: 100px;
  }
`;

interface WheelEvent<T = Element> {
  preventDefault: any;
  deltaMode: number;
  deltaX: number;
  deltaY: number;
  deltaZ: number;
}

function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const scrollEvent = (e: WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      };
      el.addEventListener("wheel", scrollEvent);
      return () => el.removeEventListener("wheel", scrollEvent);
    }
  }, []);

  return (
    <>
      <Header />
      <Container>
        <TimelinePanel ref={scrollRef}>
          <NewsPanel>
            <NewsBlock>1</NewsBlock>
            <NewsBlock>2</NewsBlock>
            <NewsBlock>3</NewsBlock>
            <NewsBlock>4</NewsBlock>
            <NewsBlock>5</NewsBlock>
            <NewsBlock>6</NewsBlock>
            <NewsBlock>7</NewsBlock>
            <NewsBlock>8</NewsBlock>
            <NewsBlock>9</NewsBlock>
            <NewsBlock>10</NewsBlock>
            <NewsBlock>11</NewsBlock>
            <NewsBlock>12</NewsBlock>
            <NewsBlock>13</NewsBlock>
            <NewsBlock>14</NewsBlock>
            <NewsBlock>15</NewsBlock>
            <NewsBlock>16</NewsBlock>
            <NewsBlock>17</NewsBlock>
            <NewsBlock>18</NewsBlock>
            <NewsBlock>19</NewsBlock>
            <NewsBlock>20</NewsBlock>
          </NewsPanel>
        </TimelinePanel>
      </Container>
    </>
  );
}

export default Home;
