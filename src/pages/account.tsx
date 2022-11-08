import { useState, useRef, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/authContext";
import ReactLoading from "react-loading";

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const Wrapper = styled.div`
  width: 340px;
  margin: 0 auto;
  padding-top: 200px;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const TitlePanel = styled.div`
  display: flex;
  font-size: 36px;
  color: #000000;
  justify-content: center;
`;

const TitleBtn = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  background-color: ${(props: { showColor: string }) => props.showColor};
`;

const InputPanel = styled.div`
  /* border: 1px solid #000000; */
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const InputLabel = styled.label`
  font-size: 24px;
  color: #000000;
  display: flex;
  align-items: center;
`;

const InputArea = styled.input`
  /* border: 1px solid #000000; */
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
  width: 100%;
  height: 36px;
  border: 1px solid #000000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserProfilePanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const HelloUser = styled.h1`
  color: #000000;
  line-height: 24px;
`;

const UserNickName = styled.div`
  color: #000000;
  line-height: 24px;
`;

const UserEmail = styled.div`
  color: #000000;
  line-height: 24px;
`;

const Logout = styled.button`
  width: 100px;
  height: 30px;
  border: 1px solid #000000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loading = styled(ReactLoading)`
  margin: 0 auto;
`;

function Account() {

  const [colorRegister, setColorRegister] = useState<string>("#f0b30b");
  const [colorSignin, setColorSignin] = useState<string>("none");
  const emailRef = useRef<HTMLInputElement>(null!);
    const passwordRef = useRef<HTMLInputElement>(null!);
  const userNameRef = useRef<HTMLInputElement>(null!);

  const {
    activeStatus,
    setActiveStatus,
    userState,
    setUserState,
    isLoading,
    logOut,
    isLogIn,
    signInRequest,
  } = useContext(AuthContext);

  function changeIdentity(status: string) {
    if (status === "register") {
      setActiveStatus("register");
      setColorRegister("#f0b30b");
    } else {
      setColorRegister("none");
    }

    if (status === "signin") {
      setActiveStatus("signin");
      setColorSignin("#f0b30b");
    } else {
      setColorSignin("none");
    }
  }
  return (
    <Container>
      <Wrapper>
        {isLoading ? (
          <Loading type="bars" color="black"/>
        ) : (
          <>
            {userState.logIn ? (
              <>
                <UserProfilePanel>
                  <HelloUser>歡迎!</HelloUser>
                  <UserNickName>{userState.name}</UserNickName>
                  <UserEmail>{userState.email}</UserEmail>
                  <Logout
                    onClick={() => {
                      logOut();
                    }}
                  >
                    登出
                  </Logout>
                </UserProfilePanel>
              </>
            ) : (
              <>
                <TitlePanel>
                  <TitleBtn
                    showColor={colorRegister}
                    onClick={() => {
                      changeIdentity("register");
                    }}
                  >
                    註冊
                  </TitleBtn>
                  <TitleBtn
                    showColor={colorSignin}
                    onClick={() => {
                      changeIdentity("signin");
                    }}
                  >
                    登入
                  </TitleBtn>
                </TitlePanel>
                <InputPanel>
                  <InputDiv>
                    <InputLabel>信箱</InputLabel>
                    <InputArea
                      ref={emailRef}
                      onChange={(e) =>
                        (emailRef.current.value = e.target.value)
                      }
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
              </>
            )}
          </>
        )}
      </Wrapper>
    </Container>
  );
}

export default Account;
