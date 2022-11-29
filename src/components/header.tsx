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
import Download from "./unSavedSign.png";
import DeletedSign from "../pages/x.png";
import Business from "./business.png";
import Entertainment from "./entertainment.png";
import General from "./general.png";
import Health from "./health.png";
import Science from "./science.png";
import Sports from "./sports.png";
import Technology from "./technology.png";

const categoryImg = [
  Business,
  Entertainment,
  General,
  Health,
  Science,
  Sports,
  Technology,
];

const HeaderDiv = styled.div`
  width: 100%;
  height: 70px;
  position: relative;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  box-shadow: 0px 7px 8px -8px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 7px 8px -8px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 7px 8px -8px rgba(0, 0, 0, 0.75);
  @media screen and (max-width: 1280px) {
    height: 50px;
  }
`;

const LogoDiv = styled.div`
  width: 300px;
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
  width: calc(100% - 300px - 100px - 100px);
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
  right: 10px;
  z-index: 100;
  width: calc(100% - 20px);
  max-height: 400px;
  padding: 10px;
  border-radius: 0 0 20px 20px;
  background-color: #f1eeed;
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

const UndoBtnDiv = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  right: 34px;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
  }
  @media screen and (max-width: 1280px) {
    width: 25px;
    height: 25px;
    right: 26px;
  }
`;
const UndoSearchBtn = styled.button`
  width: 20px;
  height: 20px;

  border: 1px solid #979797;
  border-radius: 50%;
  background-image: url(${DeletedSign});
  background-size: 10px;
  background-repeat: no-repeat;
  background-color: #00000000;
  background-position: center;
  &:hover {
    cursor: pointer;
    border: 1px solid #000000;
  }

  @media screen and (max-width: 1280px) {
    width: 16px;
    height: 16px;
    background-size: 7px;
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
  margin-top: 15px;
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
  padding: 0 16px;
  margin-right: 8px;
  display: flex;
  justify-content: ${(props: LoginProps) =>
    props.center ? "space-between" : "center"};
  align-items: center;
  list-style: none;
  min-width: 80px;
  height: 30px;
  line-height: 30px;
  border-radius: 16px;
  background-color: #ffffff;
`;

const SavedKeywords = styled(DropDownListContent)``;

const SavedKeywordsList = styled(RecentSearch)``;
const SavedKeywordListDiv = styled.div`
  line-height: 30px;
  transform: translateY(-3%);
`;

const DeleteSavedWords = styled(SavedButton)`
  width: 12px;
  height: 12px;
  margin-left: 5px;
  background-image: url(${DeletedSign});
  background-size: 8px;
  background-repeat: no-repeat;
  background-color: #00000000;
  background-position: center;
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
const CategoryDiv = styled.div`
  position: relative;
`;

interface BackgroundImg {
  imgUrl: string;
}

const CategoryList = styled.div`
  height: 80px;
  width: 160px;
  list-style: none;
  background-image: url(${(props: BackgroundImg) => props.imgUrl});
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  filter: brightness(70%);
  &:hover {
    cursor: pointer;
  }
`;

const CategoryListWord = styled.div`
  position: absolute;
  z-index: 10;
  color: white;
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StatusDiv = styled.div`
  height: 100%;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const MemberBtnDiv = styled.div`
  width: 50%;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  &:hover {
    border: 1px solid #979797;
  }
`;

const LogInBtn = styled(MemberBtnDiv)``;

const LogInLink = styled(Link)`
  text-decoration: none;
`;

const MenuDropDownDiv = styled.div`
  width: 100px;
  position: absolute;
  right: 25px;
  top: 50px;
  z-index: 51;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #b1846050;
  @media screen and (max-width: 1280px) {
    top: 40px;
  }
`;

const MenuDropDownList = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
`;

const LinkBtn = styled(Link)`
  text-decoration: none;
  color: #000000;
  &:hover {
    color: #a07654;
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

const HotNews = styled(StatusDiv)`
  &:active {
    height: 60%;
    border-radius: 5px;
    border-top: 2px solid #000000;
    border-left: 2px solid #000000;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
  }
`;

const HotNewsPressed = styled(StatusDiv)`
  height: 60%;
  border-radius: 5px;
  border-top: 2px solid #000000;
  border-left: 2px solid #000000;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
`;

const EmptyDiv = styled(SearchInputDiv)``;

interface LoginProps {
  center: boolean;
}

function Header({
  keyword,
  setKeyword,
  searchState,
  setSearchState,
}: {
  keyword: string;
  setKeyword: Function;
  searchState: boolean;
  setSearchState: Function;
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
    localStorage.setItem("savedKeywords", JSON.stringify(saveSearch));

  }

  // useEffect(() => {
  //   localStorage.setItem("savedKeywords", JSON.stringify(keywordHistory));
  // }, [keywordHistory]);

  useEffect(() => {
    const value = localStorage.getItem("savedKeywords");
    if (typeof value === "string") {
      const parse = JSON.parse(value);
      setKeywordHistory(parse);
    }
  }, []);

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
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        recentSearch(inputRef.current!.value);
        setIsOpen(false);
      }
    });
    return () =>
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          recentSearch(inputRef.current!.value);
          setIsOpen(false);
        }
      });
  }, [keywordHistory]);

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
                        center={userState.logIn}
                        key={item}
                        onClick={(e) => {
                          setKeyword(item);
                          inputRef!.current!.value = item;
                        }}
                      >
                        <SavedKeywordListDiv>{item}</SavedKeywordListDiv>
                        <DeleteSavedWords
                          onClick={(e) => {
                            e.stopPropagation();
                            inputRef!.current!.value = "";
                            deleteSavedKeyword(item);
                          }}
                        />
                      </SavedKeywordsList>
                    );
                  })}
              </SavedKeywords>
            </DropDownListDiv>
          ) : (
            ""
          )}
          <DropDownListDiv>
            <DropDownListTitle>類別</DropDownListTitle>
            <DropDownListContent>
              {newsCategory.map((item, index) => {
                return (
                  <CategoryDiv key={item}>
                    <CategoryList
                      imgUrl={categoryImg[index]}
                      onClick={() => {
                        setKeyword(item);
                        // setIsOpen(true);
                        inputRef!.current!.value = item;
                      }}
                    ></CategoryList>
                    <CategoryListWord>{item}</CategoryListWord>
                  </CategoryDiv>
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

  useEffect(() => {
    window.addEventListener("click", () => {
      setIsOpenMenu(false);
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    });

    return () => {
      window.removeEventListener("click", () => setIsOpenMenu(false));
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      });
    };
  }, []);

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
      {location.pathname === "/" ? (
        <SearchInputDiv>
          <InputPanel>
            <InputDiv
              ref={inputRef}
              onChange={(e) => {
                setKeyword(inputRef.current!.value.trim());
                // setSearchState(true);
              }}
              onClick={(e) => {
                setIsOpen(true);
                e.stopPropagation();
              }}
            />

            {isOpen && openDropDownList()}
            <SearchButton />
            {keyword && (
              <UndoBtnDiv>
                <UndoSearchBtn
                  onClick={() => {
                    setKeyword("");
                    inputRef.current!.value = "";
                  }}
                />
              </UndoBtnDiv>
            )}
          </InputPanel>
        </SearchInputDiv>
      ) : (
        <EmptyDiv />
      )}

      {location.pathname !== "/account" && (
        <>
          {location.pathname === "/hotnews" ? (
            <HotNewsPressed>
              <LinkBtn to="/hotnews">熱門頭條</LinkBtn>
            </HotNewsPressed>
          ) : (
            <HotNews>
              <LinkBtn to="/hotnews">熱門頭條</LinkBtn>
            </HotNews>
          )}
          <StatusDiv>
            {statusBtn()}
            {isOpenMenu && openMenuList()}
          </StatusDiv>
        </>
      )}
    </HeaderDiv>
  );
}

export default Header;
