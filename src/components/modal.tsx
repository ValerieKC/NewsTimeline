import { createPortal } from "react-dom";
import { useOutletContext, useLocation } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import Highlighter from "react-highlight-words";
import { ArticleType } from "../utils/articleType";
import ModalComment from "./modalComment";
import ModalBulletin from "./modalBulletin";
import SavedNewsBtn from "./savedNewsBtn";
import timestampConvertDate from "../utils/timeStampConverter";
import CategoryComponent from "../components/categoryTag";
import ClosedImg from "../img/x.png";

const PortalRoot = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 12;
  background: #00000050;
  /* overflow-y: scroll; */
  /* display: ${(props: Prop) => props.show}; */
  ::-webkit-scrollbar {
    /* display: none; */
  }
`;

interface Prop {
  show?: string;
}

const PortalContent = styled.div`
  width: 70vw;
  min-width: 700px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow-y: scroll;
  background-color: #f1eeed;
  font-size: 16px;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  @media screen and (max-width: 700px) {
    width: 100%;
    min-width: 360px;
  }
`;

const PortalNews = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TagDiv = styled.div`
  padding: 0 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const SavedSignDiv = styled.div`
  width: 20px;
  height: 20px;
`;

const PortalHeader = styled.div`
  width: 100%;
  margin-top: 24px;
`;
const NewsTitleDiv = styled.div`
  width: 100%;
  padding: 0 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: -3px;
  z-index: 2000;
  font-weight: bold;
  line-height: 30px;
  background-color: #f1eeed;
`;

const NewsInformationDiv = styled.div`
  width: 100%;
  margin-bottom: 0;
  display: flex;
  font-size: 14px;
  color: #979797;

  @media screen and (max-width: 799px) {
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
`;
const NewsInformationDetail = styled.div`
  margin-right: 30px;
  letter-spacing: 1px;
`;

const NewsTitle = styled.div`
  width: 100%;
  display: flex;
  /* justify-content: center; */
  padding: 20px 0;
  font-size: 26px;
`;

const NewsContent = styled.div`
  padding: 0 60px 20px 60px;
  line-height: 28px;
`;

const FeedBackDiv = styled.div`
  width: 100%;

  padding: 15px 60px 20px 60px;
  background-color: #ffffff;
`;

const ClosedBtnDiv = styled.div`
  width: 28px;
  height: 28px;
  position: sticky;
  z-index: 2001;
  right: 2px;
  top: 2px;
  margin-left: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  &:hover {
    cursor: pointer;
    border: 1px solid #979797;
  }
`;
const ClosedBtn = styled.div`
  width: 12px;
  height: 12px;

  background-image: url(${ClosedImg});
  background-size: cover;
  background-position: center;
  &:hover {
    color: 1px solid #979797;
  }
`;

const modalRoot = document.getElementById("root") as HTMLElement;

function Modal({ news, onClose }: { news: ArticleType; onClose: () => void }) {
  const keyword = useOutletContext<{ keyword: string; setKeyword: () => {} }>();

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const {
    author,
    category,
    briefContent,
    country,
    description,
    id,
    publishedAt,
    source,
    title,
    url,
    urlToImage,
    articleContent,
    ...rest
  } = news;

  function timeExpression(time: number) {
    const [year, month, date, hours, minutes] = timestampConvertDate(time);
    const dataValue = `${year.toLocaleString(undefined, {
      minimumIntegerDigits: 4,
    })}年${month.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}月${date.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}日${hours.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}時${minutes.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}分`;
    return dataValue;
  }


  const handleClick = () => {
    onClose();
  };

  function addNewline() {
    if (country === "us") {
      const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });

      return Array.from(segmenter.segment(articleContent), (s, index) => (
        <div key={`key-` + index + s.segment}>
          <Highlighter
            highlightClassName="Highlight"
            searchWords={[keyword.keyword]}
            autoEscape={true}
            textToHighlight={s.segment}
          />
        </div>
      ));
    } else {
      const segmenter = new Intl.Segmenter("zh-TW", {
        granularity: "sentence",
      });

      return Array.from(segmenter.segment(articleContent), (s, index) => (
        <div key={`key-` + index + s.segment}>
          <Highlighter
            highlightClassName="Highlight"
            searchWords={[keyword.keyword]}
            autoEscape={true}
            textToHighlight={`${s.segment}`}
          />
        </div>
      ));
    }
  }
console.log(publishedAt)
  return (
    <>
      {createPortal(
        <PortalRoot onClick={handleClick}>
          <PortalContent
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <PortalNews>
              <ClosedBtnDiv onClick={handleClick}>
                <ClosedBtn />
              </ClosedBtnDiv>
              <PortalHeader />
              <TagDiv>
                <CategoryComponent categoryName={category} />
                <SavedSignDiv>
                  {location.pathname === "/" && (
                    <SavedNewsBtn
                      newsId={id}
                      unOpen={() => {
                        setIsOpen(true);
                      }}
                    />
                  )}
                </SavedSignDiv>
              </TagDiv>
              <NewsTitleDiv>
                <NewsTitle>
                  <Highlighter
                    highlightClassName="Highlight"
                    searchWords={[keyword.keyword]}
                    autoEscape={true}
                    textToHighlight={title.split("-")[0]}
                  />
                </NewsTitle>
              </NewsTitleDiv>
              <NewsContent>
                <NewsInformationDiv>
                  <NewsInformationDetail>作者:{author}</NewsInformationDetail>
                  <NewsInformationDetail>
                    {location.pathname!=="/"?`發布時間:${timeExpression(publishedAt*1000)}`:`發布時間:${timeExpression(publishedAt)}`}
                  </NewsInformationDetail>
                </NewsInformationDiv>
                {addNewline()}
              </NewsContent>
              <FeedBackDiv>
                <ModalBulletin articleId={id} />
              </FeedBackDiv>
            </PortalNews>
            <ModalComment articleId={id} />
          </PortalContent>
        </PortalRoot>,
        modalRoot
      )}
    </>
  );
}

export default Modal;
