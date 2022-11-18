import React, { useState, useRef, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
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

const HeaderDiv = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
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
  width: calc(100% - 380px - 60px);
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
  z-index: 10;
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
  justify-content: space-between;
  align-items: center;
  list-style: none;
  min-width: 60px;
  border-radius: 15px;
  padding: 0 5px;
  border: 1px solid #d4d2d2;
  /* text-align: center; */
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
  width: 14px;
  height: 14px;
  position: absolute;
  right: 1px;
  top: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 10px;
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
  height: 100%;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogInBtn = styled.button`
  height: 40px;
`;

const MemberBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Loading = styled(ReactLoading)`
  width: 40px;
  height: 40px;
  margin-right: 20px;
`;

function Header({
  keyword,
  setKeyword,
}: {
  keyword: string;
  setKeyword: Function;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { userState, isLoading } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [keywordHistory, setKeywordHistory] = useState<string[] | null>([]);
  const [savedWordsState, setSavedWords] = useState<string[]>();
  const [savedKeyWordBtn, setSavedKeyWordBtn] = useState<boolean>(false);

  async function savedKeywordHandler(keyword: string) {
    // if (!inputRef.current?.value.length) return;

    const useRef = doc(db, "users", userState.uid);
    await updateDoc(useRef, {
      savedKeyWords: arrayUnion(keyword),
    });

    const saveSearch = keywordHistory?.filter((item) => item !== keyword);
    setKeywordHistory(saveSearch as string[]);
    console.log(keywordHistory)
    localStorage.setItem("savedKeywords", JSON.stringify(keywordHistory));
  }
  
  useEffect(()=>{ 
    localStorage.setItem("savedKeywords", JSON.stringify(keywordHistory));
  },[keywordHistory])

  console.log(keywordHistory)
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
        <Link to="./member">
          <MemberBtn>You</MemberBtn>
        </Link>
      ) : (
        <Link to="./account">
          <LogInBtn>登入</LogInBtn>
        </Link>
      );
    }
  }

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

  // console.log(keyword);
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
                      key={`${index}-{item}`}
                      onClick={() => {
                        setKeyword(item);
                        inputRef!.current!.value = item;
                      }}
                    >
                      {item}
                      <SavedButton
                        onClick={(e) => {
                          console.log("saved!!");
                          e.stopPropagation();
                          savedKeywordHandler(item);
                        
                          setIsOpen(true);
                          setSavedKeyWordBtn(false);
                        }}
                      />
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
                        >
                          x
                        </DeleteSavedWords>
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
          {/* {savedKeyWordBtn&&(
            <SavedButton
              onClick={(e) => {
                e.stopPropagation();
                savedKeywordHandler(inputRef.current!.value);
                setIsOpen(true);
                setSavedKeyWordBtn(false)
              }}
            >
              儲存關鍵字
            </SavedButton>
          )} */}
        </InputPanel>
      </SearchInputDiv>
      <StatusDiv>{statusBtn()}</StatusDiv>
    </HeaderDiv>
  );
}

export default Header;
