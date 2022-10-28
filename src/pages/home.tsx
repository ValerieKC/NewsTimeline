import styled from "styled-components";

const Header = styled.div`
  width: 100%;
  height: 90px;
  border: 2px solid salmon;
`;

const Container = styled.div`
  
`

const TimelinePanel = styled.div`
  width: 100%;
  height: 800px;
  background-color: #181F58;
`;

function Home() {
  return (
    <>
      <Header />
      <Container>
        <TimelinePanel>

        </TimelinePanel>
      </Container>
    </>
  );
}

export default Home;
