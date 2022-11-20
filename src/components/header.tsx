import React, { useState, useRef, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";
import newsCategory from "./category";
import ReactLoading from "react-loading";
import SearchSign from "./search.png";
import Download from "./floppy-disk.png";
import DeletedSign from "../pages/x_white.png"


const HeaderDiv = styled.div`
  width: 100%;
  height: 70px;
  position: relative;
  top:0;
  z-index:2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 7px 8px -8px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 7px 8px -8px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 7px 8px -8px rgba(0, 0, 0, 0.75);
  @media screen and (max-width: 1280px) {
    height: 50px;
  }
`;

const LogoDiv = styled.div`
  width: 380px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  @media screen and (max-width: 1280px) {
    width: 280px;
    margin: 0;
  }
`;

const NewsTimeLineLogo = styled(Link)`
  font-family: "Vollkorn", serif;
  font-size: 40px;
  font-weight: 700;
  color: #000000;
  text-decoration: none;
  @media screen and (max-width: 1280px) {
    font-size: 30px;
  }
`;

const SearchInputDiv = styled.div`
  width: calc(100% - 380px - 100px);
  height: 30px;
  display: flex;
  justify-content: center;
  @media screen and (max-width: 1280px) {
    width: calc(100% - 280px - 60px);
    height: 25px;
  }
`;

const InputPanel = styled.div`
  position: relative;
  width: calc(100% - 100px - 60px);
  min-width: 250px;
`;

const InputDiv = styled.input`
  height: 100%;
  width: 100%;
  border-radius: 20px;
  border: 1px solid #979797;
  padding-left: 10px;
  &:focus {
    border: 2px solid #979797;
    outline: none;
  }
`;

const DropDownList = styled.div`
  position: absolute;
  z-index: 100;
  width: calc(100% - 10px);
  max-height: 400px;
  padding: 10px;
  border-radius: 20px;
  background-color: #ffffff;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const SearchButton = styled.button`
  width: 30px;
  height: 30px;
  position: absolute;
  right: 4px;
  border: none;
  background-image: url(${SearchSign});
  background-size: 20px;
  background-repeat: no-repeat;
  background-color: #00000000;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1280px) {
    width: 25px;
    height: 25px;
    background-size: 12px;
  }
`;

const SavedButton = styled.button`
  width: 12px;
  height: 12px;
  margin-left: 5px;
  background-color: #00000000;
  background-image: url(${Download});
  background-size: cover;

  border: none;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1280px) {
    /* width: 80px;
    right: 25px; */
    font-size: 12px;
  }
`;

const DropDownListDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const DropDownListContent = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 15px;
`;

const DropDownListTitle = styled.ul`
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const DropDownOverlay = styled.div`
  position: fixed;
  top: 70px;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 50;
  background: #00000050;
  overflow-y: scroll;
  @media screen and (max-width: 1280px) {
    top: 50px;
  }
`;

const RecentSearchContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
`;

const RecentSearch = styled.li`
  display: flex;
  justify-content: ${(props: LoginProps) =>
    props.center ? "space-between" : "center"};
  align-items: center;
  list-style: none;
  min-width: 60px;
  border-radius: 15px;
  padding: 0 5px;
  border: 1px solid #d4d2d2;
`;

const SavedKeywords = styled(DropDownListContent)`
  font-size: 14px;
`;

const SavedKeywordsList = styled.li`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #04413c90;
  list-style: none;
  width: 100px;
  height: 30px;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
  }
`;

const DeleteSavedWords = styled.div`
  width: 7px;
  height: 7px;
  position: absolute;
  right: 4px;
  top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  /* font-size: 10px; */
  background-image: url(${DeletedSign});
  background-size: cover;
  &:hover {
    border: 1px solid #ffffff;
    background-color: #ffffff50;
    cursor: pointer;
  }
`;

const CategoryList = styled(SavedKeywordsList)`
  background-color: #14437290;
  height: 50px;
`;

const StatusDiv = styled.div`
  /* position: absolute; */
  /* z-index: 2; */
  /* right: 25px; */
  height: 100%;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover{
    cursor:pointer;
  }
`;


const MemberBtnDiv = styled.div`
  width: 50%;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  &:hover {
    border: 1px solid #979797;
  }
`;

const LogInBtn = styled(MemberBtnDiv)`
`;

const LogInLink=styled(Link)`
text-decoration: none;
`

const MenuDropDownDiv = styled.div`
  width: 100px;
  position: absolute;
  right: 25px;
  top: 40px;
  z-index: 51;
  display:flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius:4px;
`;
const MenuDropDownList = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
 
`;

const MenuDropDownLink = styled(Link)`
  text-decoration: none;
  color:#000000;
  &:hover {
    color: #a38f08;
  }
`;

const Loading = styled(ReactLoading)`
  width: 40px;
  height: 40px;
  /* margin-right: 20px; */
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface LoginProps {
  center: boolean;
}

function Header({
  keyword,
  setKeyword,
}: {
  keyword: string;
  setKeyword: Function;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { userState, isLoading, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [keywordHistory, setKeywordHistory] = useState<string[] | null>([]);
  const [savedWordsState, setSavedWords] = useState<string[]>();
  const [savedKeyWordBtn, setSavedKeyWordBtn] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
const location = useLocation();   

  async function savedKeywordHandler(keyword: string) {
    // if (!inputRef.current?.value.length) return;

    const useRef = doc(db, "users", userState.uid);
    await updateDoc(useRef, {
      savedKeyWords: arrayUnion(keyword),
    });

    const saveSearch = keywordHistory?.filter((item) => item !== keyword);
    setKeywordHistory(saveSearch as string[]);
    localStorage.setItem("savedKeywords", JSON.stringify(keywordHistory));
  }

  useEffect(() => {
    localStorage.setItem("savedKeywords", JSON.stringify(keywordHistory));
  }, [keywordHistory]);

  useEffect(() => {
    const value = localStorage.getItem("savedKeywords");

    if (typeof value === "string") {
      const parse = JSON.parse(value);
      setKeywordHistory(parse);
    } else {
      setKeywordHistory([]);
    }
  }, [keyword]);

  function recentSearch(text: string) {
    setKeyword(text);
    const newKeywordsArray = [...keywordHistory!];

    if (text === "") return;
    if (newKeywordsArray.includes(text)) return;
    newKeywordsArray.unshift(text);
    if (newKeywordsArray.length > 5) {
      newKeywordsArray.length = 5;
    }
    setKeywordHistory(newKeywordsArray);
    localStorage.setItem("savedKeywords", JSON.stringify(newKeywordsArray));
    setSavedKeyWordBtn(true);
  }

  useEffect(()=>{
    window.addEventListener("keydown",(e)=>{
      if(e.key==="Enter"){     
        recentSearch(inputRef.current!.value);
        setIsOpen(false);
      }
    })
    return () =>
      window.removeEventListener( "keydown", (e) => {
        if (e.key === "Enter") {
          recentSearch(inputRef.current!.value);
          setIsOpen(false);
        }
      });
  },[])

  useEffect(() => {
    if (userState.uid) {
      const unsub = onSnapshot(doc(db, "users", userState.uid), (doc: any) => {
        setSavedWords(doc.data().savedKeyWords);
      });
      return () => unsub();
    }
  }, [userState.uid]);

  async function deleteSavedKeyword(keyword: string) {
    const userRef = doc(db, "users", userState.uid);
    await updateDoc(userRef, {
      savedKeyWords: arrayRemove(keyword),
    });
  }

  function openDropDownList() {
    return (
      <>
        <DropDownList>
          {keywordHistory ? (
            <DropDownListDiv>
              <DropDownListTitle>最近的搜尋</DropDownListTitle>
              <RecentSearchContent>
                {keywordHistory.map((item, index) => {
                  return (
                    <RecentSearch
                      center={userState.logIn}
                      key={`${index}-{item}`}
                      onClick={() => {
                        setKeyword(item);
                        inputRef!.current!.value = item;
                      }}
                    >
                      {item}
                      {userState.logIn && (
                        <SavedButton
                          onClick={(e) => {
                            e.stopPropagation();
                            savedKeywordHandler(item);

                            setIsOpen(true);
                            setSavedKeyWordBtn(false);
                          }}
                        />
                      )}
                    </RecentSearch>
                  );
                })}
              </RecentSearchContent>
            </DropDownListDiv>
          ) : (
            ""
          )}

          {userState.logIn ? (
            <DropDownListDiv>
              <DropDownListTitle>儲存關鍵字</DropDownListTitle>
              <SavedKeywords>
                {savedWordsState &&
                  savedWordsState.map((item) => {
                    return (
                      <SavedKeywordsList
                        key={item}
                        onClick={(e) => {
                          setKeyword(item);
                          inputRef!.current!.value = item;
                        }}
                      >
                        <DeleteSavedWords
                          onClick={(e) => {
                            e.stopPropagation();
                            inputRef!.current!.value = "";
                            deleteSavedKeyword(item);
                          }}
                         />
                        {item}
                      </SavedKeywordsList>
                    );
                  })}
              </SavedKeywords>
            </DropDownListDiv>
          ) : (
            ""
          )}
          <DropDownListDiv>
            <DropDownListTitle>Category</DropDownListTitle>
            <DropDownListContent>
              {newsCategory.map((item) => {
                return (
                  <CategoryList
                    key={item}
                    onClick={() => {
                      setKeyword(item);
                      // setIsOpen(true);
                      inputRef!.current!.value = item;
                    }}
                  >
                    {item}
                  </CategoryList>
                );
              })}
            </DropDownListContent>
          </DropDownListDiv>
        </DropDownList>
        <DropDownOverlay onClick={() => setIsOpen(false)}></DropDownOverlay>
      </>
    );
  }

  function statusBtn() {
    if (isLoading) {
      return (
        <Loading
          type="spinningBubbles"
          color="#000000"
          height={24}
          width={24}
        />
      );
    } else {
      return userState.logIn ? (
        <MemberBtnDiv
          onClick={(e) => {
            console.log("click!")
            setIsOpenMenu((prev) => !prev);
            e.stopPropagation();
          }}
        >
          帳戶
        </MemberBtnDiv>
      ) : (
        <LogInBtn>
          <LogInLink to="/account">登入</LogInLink>
        </LogInBtn>
      );
    }
  }

  function openMenuList() {
    return (
      <MenuDropDownDiv>
        <MenuDropDownList>
          <MenuDropDownLink to="/member">收藏文章</MenuDropDownLink>
        </MenuDropDownList>
        <MenuDropDownList
          onClick={(e) => {
            logOut();
          }}
        >
          <MenuDropDownLink to="/account">登出</MenuDropDownLink>
        </MenuDropDownList>
      </MenuDropDownDiv>
    );
  }

  useEffect(()=>{
    window.addEventListener("click", () => {setIsOpenMenu(false);
    })
window.addEventListener("keydown", (e) => {
  if(e.key==="Escape"){
  setIsOpen(false);
  }});


    return () =>{
      window.removeEventListener("click", () => setIsOpenMenu(false));
      window.removeEventListener("keydown", (e) => {
         if (e.key === "Escape") {
           setIsOpen(false);
         }
      });
}},[])

  return (
    <HeaderDiv
      onClick={() => {
        setIsOpen(false);
      }}
    >
      <LogoDiv
        onClick={() => {
          setKeyword("");
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        }}
      >
        <NewsTimeLineLogo to="/">News Timeline</NewsTimeLineLogo>
      </LogoDiv>
      {location.pathname === "/" && (
        <SearchInputDiv>
          <InputPanel>
            <InputDiv
              ref={inputRef}
              onClick={(e) => {
                setIsOpen(true);
                e.stopPropagation();
              }}
            />

            {isOpen && openDropDownList()}
            <SearchButton
              onClick={() => {
                recentSearch(inputRef.current!.value.trim());
              }}
            />
          </InputPanel>
        </SearchInputDiv>
      )}
      {location.pathname!=="/account"&&(<StatusDiv>
        {statusBtn()}
        {isOpenMenu && openMenuList()}
      </StatusDiv>)}
    </HeaderDiv>
  );
}

export default Header;
