import {
  useState,
  useRef,
  useContext,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  DocumentData,
} from "firebase/firestore";
import { debounce } from "lodash";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/authContext";
import { ArticleType } from "../utils/articleType";
import RenderOpenMenuList from "./renderOpenMenuList";
import RenderOpenDropDownList from "./renderOpenDropDownList";
import StatusBtn from "./StatusBtn";
import SearchSign from "../img/search.png";
import DeletedSign from "../img/x.png";

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
  padding: 0 20px;
  @media screen and (max-width: 1280px) {
    width: 280px;
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

interface MobileInputShow {
  inputIsShow: boolean;
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
    display: ${(props: MobileInputShow) =>
      props.inputIsShow ? "none" : "flex"};
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

interface DropDownListProp {
  openRadius: boolean;
}

function Header({
  keyword,
  setKeyword,
  setArticles,
  setMobileArticles,
}: {
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  setArticles: Dispatch<SetStateAction<ArticleType[]>>;
  setMobileArticles: Dispatch<SetStateAction<ArticleType[]>>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { userState } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [keywordHistory, setKeywordHistory] = useState<string[] | null>([]);
  const [savedWordsState, setSavedWords] = useState<string[] | undefined>();
  const [savedKeyWordBtn, setSavedKeyWordBtn] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [inputIsShow, setInputIsShow] = useState<boolean>(false);
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

  useEffect(() => {
    location.pathname !== "/" && setKeyword("");
  }, [location.pathname, setKeyword]);

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
      const unsub = onSnapshot(
        doc(db, "users", userState.uid),
        (doc: DocumentData) => {
          setSavedWords(doc.data().savedKeyWords);
        }
      );
      return () => unsub();
    }
  }, [userState.uid]);

  async function deleteSavedKeyword(keyword: string) {
    const userRef = doc(db, "users", userState.uid);
    await updateDoc(userRef, {
      savedKeyWords: arrayRemove(keyword),
    });
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
              onChange={handleChange}
              onClick={(e) => {
                setIsOpen((prev) => !prev);
                e.stopPropagation();
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  recentSearch(inputRef.current!.value);
                }
              }}
            />

            {isOpen && (
              <RenderOpenDropDownList
                keywordHistory={keywordHistory}
                setKeyword={setKeyword}
                savedKeywordHandler={savedKeywordHandler}
                deleteSavedKeyword={deleteSavedKeyword}
                setIsOpen={setIsOpen}
                setSavedKeyWordBtn={setSavedKeyWordBtn}
                setInputIsShow={setInputIsShow}
                savedWordsState={savedWordsState}
                forwardedRef={inputRef}
              />
            )}
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
      {location.pathname === "/" && (
        <MobileSearchBtn
          inputIsShow={inputIsShow}
          onClick={(e) => {
            setInputIsShow(true);
            e.stopPropagation();
          }}
        />
      )}
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
            {isOpenMenu && <RenderOpenMenuList />}
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
                {isOpenMenu && <RenderOpenMenuList />}
              </StatusDiv>
            </HeaderBottomUnit>
          </>
        )}
      </HeaderBottom>
    </HeaderDiv>
  );
}

export default Header;
