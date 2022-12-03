import { useState, useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/authContext";
import ReactLoading from "react-loading";


const Container = styled.div`
  height: calc(100% - 70px);
  display: flex;
  
  @media screen and (max-width: 1280px) {
    height: calc(100% - 50px);
  }
`;

const Wrapper = styled.div`
  width: 340px;
  height: fit-content;
  margin: 0 auto;
  margin-top: 50px;
  border: 1px solid #979797;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 2px 12px -3px rgba(0, 0, 0, 0.63);
  -webkit-box-shadow: -2px 2px 12px -3px rgba(0, 0, 0, 0.63);
  -moz-box-shadow: -2px 2px 12px -3px rgba(0, 0, 0, 0.63);
`;

const TitlePanel = styled.div`
  display: flex;
  height: 32px;
  color: #000000;
  justify-content: center;
`;

const TitleBtn = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  line-height: 32px;
  color: ${(props: { showColor: string }) => props.showColor};
`;

const Divide=styled.span`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-size: 24px;
  line-height: 26px;
  color:#6e6c6c;
`

const InputPanel = styled.div`
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin-top: 15px;
`;

const InputLabel = styled.label`
  padding-bottom: 5px;
  color: #000000;
  display: flex;
  align-items: center;
`;

const InputArea = styled.input`
  width: 100%;
  margin: auto;
  height: 36px;
`;

const SubmitBtnPanel = styled.div`
  display: flex;
  justify-content: space-evenly;
  color: #000000;
`;

const BtnPanel = styled.div`
  width: 300px;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  margin-top: 15px;
  margin-bottom: 15px;
  width: 100%;
  height: 36px;
  border: 1px solid #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: black;
  &:hover {
font-weight:bold;
cursor: pointer;
}
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto 0;
`;

function Account() {
  const [colorRegister, setColorRegister] = useState<string>("#979797");
  const [colorSignin, setColorSignin] = useState<string>("none");
  const emailRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const userNameRef = useRef<HTMLInputElement>(null!);
  // const location = useLocation();


  
  const {
    activeStatus,
    setActiveStatus,
    isLoading,
    signInRequest,
  } = useContext(AuthContext);

  function changeIdentity(status: string) {
    if (status === "signin") {
      setActiveStatus("signin");
      setColorSignin("#000000");
    } else {
      setColorSignin("#979797");
    }
    if (status === "register") {
      setActiveStatus("register");
      setColorRegister("#000000");
    } else {
      setColorRegister("#979797");
    }

  }
  return (
    <Container>
      {isLoading ? (
        <Loading type="spinningBubbles" color="black" />
      ) : (
        <>
          {
            <Wrapper>
              <TitlePanel>
                <TitleBtn
                  showColor={colorSignin}
                  onClick={() => {
                    changeIdentity("signin");
                  }}
                >
                  登入
                </TitleBtn>
                <Divide>|</Divide>
                <TitleBtn
                  showColor={colorRegister}
                  onClick={() => {
                    changeIdentity("register");
                  }}
                >
                  註冊
                </TitleBtn>
              </TitlePanel>
              <InputPanel>
                <InputDiv>
                  <InputLabel>信箱</InputLabel>
                  <InputArea
                    ref={emailRef}
                    onChange={(e) => (emailRef.current.value = e.target.value)}
                  ></InputArea>
                </InputDiv>
                <InputDiv>
                  <InputLabel>密碼</InputLabel>
                  <InputArea
                    ref={passwordRef}
                    type="password"
                    onChange={(e) =>
                      (passwordRef.current.value = e.target.value)
                    }
                  ></InputArea>
                </InputDiv>
                {activeStatus === "register" ? (
                  <InputDiv>
                    <InputLabel>暱稱</InputLabel>
                    <InputArea
                      ref={userNameRef}
                      onChange={(e) =>
                        (userNameRef.current.value = e.target.value)
                      }
                    ></InputArea>
                  </InputDiv>
                ) : (
                  ""
                )}
                <SubmitBtnPanel>
                  <BtnPanel>
                    <Button
                      onClick={() => {
                        signInRequest(
                          activeStatus,
                          emailRef.current.value,
                          passwordRef.current.value,
                          userNameRef.current?.value
                        );
                      }}
                    >
                      {activeStatus === "register" && "註冊"}
                      {activeStatus === "signin" && "登入"}
                    </Button>
                  </BtnPanel>
                </SubmitBtnPanel>
              </InputPanel>
            </Wrapper>
          }
        </>
      )}
    </Container>
  );
}

export default Account;
