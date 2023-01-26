import {
  useContext,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from "react";
import styled from "styled-components";
import { AuthContext } from "../context/authContext";
import newsCategory from "./category";
import Download from "../img/unSavedSign.png";
import DeletedSign from "../img/x.png";


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

const RecentSearchContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const RecentSearch = styled.li`
  padding: 0 16px;
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
  &:hover {
    cursor: pointer;
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
    font-size: 12px;
  }
`;
const CategoryDiv = styled.div`
  position: relative;
`;

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

interface LoginProps {
  center: boolean;
}

interface BackgroundImg {
  imgUrl: string;
}

export default function RenderOpenDropDownList({
  keywordHistory,
  setKeyword,
  savedKeywordHandler,
  deleteSavedKeyword,
  setIsOpen,
  setSavedKeyWordBtn,
  savedWordsState,
  setInputIsShow,
  forwardedRef,
}: {
  keywordHistory: string[] | null;
  savedWordsState: string[] | undefined;
  setKeyword: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSavedKeyWordBtn: Dispatch<SetStateAction<boolean>>;
  setInputIsShow: Dispatch<SetStateAction<boolean>>;
  savedKeywordHandler: (keyword: string) => Promise<void>;
  deleteSavedKeyword: (keyword: string) => Promise<void>;
  forwardedRef: MutableRefObject<HTMLInputElement | null>;
}) {
  const { userState } = useContext(AuthContext);

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
                    key={item}
                    onClick={() => {
                      setKeyword(item);
                      forwardedRef!.current!.value = item;
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
                        forwardedRef!.current!.value = item;
                      }}
                    >
                      <SavedKeywordListDiv>{item}</SavedKeywordListDiv>
                      <DeleteSavedWords
                        onClick={(e) => {
                          e.stopPropagation();
                          forwardedRef!.current!.value = "";
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
                <CategoryDiv key={item.category}>
                  <CategoryList
                    imgUrl={item.img}
                    onClick={() => {
                      setKeyword(item.category);
                      forwardedRef!.current!.value = item.category;
                    }}
                  />
                  <CategoryListWord
                    onClick={() => {
                      setKeyword(item.category);
                      // setIsOpen(true);
                      forwardedRef!.current!.value = item.category;
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
      <DropDownOverlay
        onClick={() => {
          setIsOpen(false);
          setInputIsShow(false);
        }}
      />
    </>
  );
}
