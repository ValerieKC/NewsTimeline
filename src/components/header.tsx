import { useState, useRef, useContext, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { debounce } from "lodash";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";
import newsCategory from "./category";
import StatusBtn from "./StatusBtn";
import SearchSign from "./search.png";
import Download from "./unSavedSign.png";
import DeletedSign from "../pages/x.png";

const HeaderDiv = styled.div`
  width: 100%;
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f1eeed;

  font-size: 16px;
  box-shadow: 0px 7px 8px -8px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 7px 8px -8px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 7px 8px -8px rgba(0, 0, 0, 0.75);
  @media screen and (max-width: 1280px) {
    height: 50px;
  }

  @media screen and (max-width: 700px) {
    height: 50px;
    justify-content: center;
  }
`;

const LogoDiv = styled.div`
  width: 340px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding:0 20px;
  /* margin-left: 20px;
  margin-right: 20px; */
  @media screen and (max-width: 1280px) {
    width: 280px;
    /* margin: 0; */
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

interface MobileInputShow{
  inputIsShow:boolean
}

const SearchInputDiv = styled.div`
  width: calc(100% - 340px - 240px);
  height: 30px;
  display: flex;
  justify-content: center;
  @media screen and (max-width: 1280px) {
    width: calc(100% - 280px - 200px);
    height: 25px;
  }

  @media screen and (max-width: 700px) {
    display: ${(props: MobileInputShow) =>
      props.inputIsShow ? "flex" : "none"};
    position: fixed;
    width: 100%;
  }
`;

const InputPanel = styled.div`
  position: relative;
  width: calc(100% - 100px - 60px);
  min-width: 250px;
  @media screen and (max-width: 700px) {
    width: calc(100% - 40px);
  }
`;

const InputDiv = styled.input`
  height: 100%;
  width: 100%;
  border-radius: 10px 10px;
  border-bottom-left-radius: ${(props: DropDownListProp) =>
    props.openRadius ? "0px" : "10px"};
  border-bottom-right-radius: ${(props: DropDownListProp) =>
    props.openRadius ? "0px" : "10px"};

  border: 1px solid #979797;
  padding-left: 10px;

  &:focus {
    border: 1px solid #979797;
    outline: none;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.75);
  }
`;

const DropDownList = styled.div`
  position: absolute;
  z-index: 100;
  width: 100%;
  max-height: 400px;
  padding: 10px;
  border: 1px solid #979797;
  border-radius: 0 0 10px 10px;
  background-color: #f1eeed;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.75);
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

const MobileSearchBtn = styled.div`
  display: none;
  @media screen and (max-width: 700px) {
    display: ${(props:MobileInputShow)=>props.inputIsShow?"none":"flex"};
    position: absolute;
    z-index: 10;
    right: 24px;
    border: none;
    background-image: url(${SearchSign});
    background-size: 20px;
    background-repeat: no-repeat;
    background-color: #00000000;
    background-position: center;
    width: 25px;
    height: 25px;
    background-size: 12px;
    &:hover {
      cursor: pointer;
    }
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
  gap: 10px;
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

  @media screen and (max-width: 700px) {
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

const RecentSearchContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const RecentSearch = styled.li`
  padding: 0 16px;
  /* margin-right: 8px; */
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
  &:hover {
    cursor: pointer;
  }
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

  @media screen and (max-width: 700px) {
    width: 50%;
  }
`;

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
const HeaderRightBtnDiv = styled.div`
  height: 100%;
  width: 240px;
  display: flex;
  align-items: center;
  @media screen and (max-width: 1280px) {
    width: 210px;
  }
  @media screen and (max-width: 700px) {
    display: none;
  }
`;
const HotNews = styled.div`
  width: 140px;
  height: 36px;
  border-radius: 12px;
  &:hover {
    background-color: #e9e9e9;
    font-weight: bold;
  }

  @media screen and (max-width: 1280px) {
    font-size: 12px;
    width: 100px;
  }

  @media screen and (max-width: 700px) {
  }
`;

const HotNewsPressed = styled.div`
  width: 140px;
  height: 36px;
  border-radius: 12px;
  background-color: black;
  color: white;
  font-weight: bold;

  @media screen and (max-width: 1280px) {
    width: 100px;
  }

  @media screen and (max-width: 700px) {
  }
`;
const HotNewsLink = styled(LinkBtn)`
  &:hover {
    font-weight: bold;
  }
`;

const HotNewsLinkFocus = styled(LinkBtn)`
  color: #ffffff;
`;

const EmptyDiv = styled(SearchInputDiv)`
  @media screen and (max-width: 700px) {
    display: none;
  }
`;

const HeaderBottom = styled.div`
  display: none;
  @media screen and (max-width: 700px) {
    display: flex;
    width: 100%;
    min-width: 360px;
    height: 50px;
    position: fixed;
    bottom: 0;
    background-color: #f1eeed;
    box-shadow: 0px -7px 8px -8px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: 0px -7px 8px -8px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px -7px 8px -8px rgba(0, 0, 0, 0.75);
  }
`;

const HeaderBottomUnit = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface LoginProps {
  center: boolean;
}

interface DropDownListProp {
  openRadius: boolean;
}

function Header({
  keyword,
  setKeyword,
  searchState,
  setSearchState,
  windowResized,
}: {
  keyword: string;
  setKeyword: Function;
  searchState: boolean;
  setSearchState: Function;
  windowResized: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { userState, isLoading, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [keywordHistory, setKeywordHistory] = useState<string[] | null>([]);
  const [savedWordsState, setSavedWords] = useState<string[]>();
  const [savedKeyWordBtn, setSavedKeyWordBtn] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [inputIsShow,setInputIsShow]=useState<boolean>(false)
  const location = useLocation();

  async function savedKeywordHandler(keyword: string) {
    const useRef = doc(db, "users", userState.uid);
    await updateDoc(useRef, {
      savedKeyWords: arrayUnion(keyword),
    });

    const saveSearch = keywordHistory?.filter((item) => item !== keyword);
    setKeywordHistory(saveSearch as string[]);
    localStorage.setItem("savedKeywords", JSON.stringify(saveSearch));
  }

  useEffect(() => {
    const value = localStorage.getItem("savedKeywords");
    if (typeof value === "string") {
      const parse = JSON.parse(value);
      setKeywordHistory(parse);
    }
  }, []);

  const recentSearch = useCallback(
    (text: string) => {
      function recentSearching(text: string) {
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
      recentSearching(text);
    },
    [keywordHistory, setKeyword]
  );

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
                  <CategoryDiv key={"key+" + item.category}>
                    <CategoryList
                      imgUrl={item.img}
                      onClick={() => {
                        setKeyword(item);
                        // setIsOpen(true);
                        inputRef!.current!.value = item.category;
                      }}
                    />
                    <CategoryListWord
                      onClick={() => {
                        setKeyword(item.category);
                        // setIsOpen(true);
                        inputRef!.current!.value = item.category;
                      }}
                    >
                      {item.category}
                    </CategoryListWord>
                  </CategoryDiv>
                );
              })}
            </DropDownListContent>
          </DropDownListDiv>
        </DropDownList>
        <DropDownOverlay onClick={() => {
          setIsOpen(false);
          setInputIsShow(false);
          }} />
      </>
    );
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

    const debouncedSearch = useRef(
      debounce((keyword) => {
        setKeyword(inputRef.current!.value.trim());
      }, 300)
    ).current;

    useEffect(() => {
      return () => {
        debouncedSearch.cancel();
      };
    }, [debouncedSearch]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      debouncedSearch(e.target.value);
    }

    console.log(inputRef?.current?.value);

  return (
    <HeaderDiv
      onClick={() => {
        setIsOpen(false);
        setInputIsShow(false);
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
        <SearchInputDiv inputIsShow={inputIsShow}>
          <InputPanel>
            <InputDiv
              openRadius={isOpen}
              ref={inputRef}
              onChange={
                handleChange
                // setKeyword(inputRef.current!.value.trim());
              }
              onClick={(e) => {
                setIsOpen((prev)=>!prev)
                e.stopPropagation();
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  recentSearch(inputRef.current!.value);
                }
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
        <EmptyDiv inputIsShow={inputIsShow} />
      )}
      {location.pathname==="/"&&<MobileSearchBtn inputIsShow={inputIsShow} onClick={(e) => {
        setInputIsShow(true);
      e.stopPropagation()
      }} />}
      {location.pathname !== "/account" && (
        <HeaderRightBtnDiv>
          {location.pathname === "/hotnews" ? (
            <HotNewsPressed>
              <HotNewsLinkFocus to="/hotnews">熱門頭條</HotNewsLinkFocus>
            </HotNewsPressed>
          ) : (
            <HotNews>
              <HotNewsLink to="/hotnews">熱門頭條</HotNewsLink>
            </HotNews>
          )}
          <StatusDiv>
            <StatusBtn setIsOpenMenu={setIsOpenMenu} />
            {isOpenMenu && openMenuList()}
          </StatusDiv>
        </HeaderRightBtnDiv>
      )}
      <HeaderBottom>
        {location.pathname !== "/account" && (
          <>
            {location.pathname === "/hotnews" ? (
              <HeaderBottomUnit>
                <HotNewsPressed>
                  <HotNewsLinkFocus to="/hotnews">熱門頭條</HotNewsLinkFocus>
                </HotNewsPressed>
              </HeaderBottomUnit>
            ) : (
              <HeaderBottomUnit>
                <HotNews>
                  <HotNewsLink to="/hotnews">熱門頭條</HotNewsLink>
                </HotNews>
              </HeaderBottomUnit>
            )}
            <HeaderBottomUnit>
              <StatusDiv>
                <StatusBtn setIsOpenMenu={setIsOpenMenu} />
                {/* {statusBtn()} */}
                {isOpenMenu && openMenuList()}
              </StatusDiv>
            </HeaderBottomUnit>
          </>
        )}
      </HeaderBottom>
    </HeaderDiv>
  );
}

export default Header;
