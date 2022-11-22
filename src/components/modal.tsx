import { createPortal } from "react-dom";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import Highlighter from "react-highlight-words";

import ModalComment from "./modalComment";
import ModalBulletin from "./modalBulletin";
import SavedNews from "./savedNews";
import timestampConvertDate from "../utils/timeStampConverter";

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
  min-width: 800px;
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
`;

const PortalContainer=styled.div`
  width:100%;
  Height:100%;
  position: relative;
`

const PortalNews = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position:relative;
`;

const TagDiv=styled.div`
width:100%;
display: flex;
justify-content: space-between;
`

const SavedSignDiv = styled.div`
  width: 22px;
  height: 22px;
  
`;

const CategoryTag = styled.div`
padding:0 20px;
min-width: 80px;
text-align: center;
  font-size: 16px;
  background-color: #ca8d57;
  color:white;
  border-radius: 16px;
`;

const PortalHeader = styled.div`
  width: 100%;
  margin-top: 24px;
  
`;
const NewsTitleDiv = styled.div`
width:100%;
  padding: 24px 60px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;
  z-index:2000;
  font-weight: bold;
  line-height: 30px;
  background-color: #f1eeed;
  box-shadow: 0px 2px 5px 0px rgba(219, 203, 203, 0.75);
  -webkit-box-shadow: 0px 2px 5px 0px rgba(219, 203, 203, 0.75);
  -moz-box-shadow: 0px 2px 5px 0px rgba(219, 203, 203, 0.75);
`;

const NewsInformationDiv = styled.div`

  width: 100%;
  display: flex;
  /* justify-content: space-between; */
  font-size: 14px;
  color:#979797;
`;
const NewsInformationDetail = styled.div`
margin-right:30px;
letter-spacing:1px;
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
width:100%;

  padding: 15px 60px 20px 60px;
  background-color: #ffffff;
`;

const modalRoot = document.getElementById("root") as HTMLElement;

function Modal({
  content,
  title,
  author,
  time,
  newsArticleUid,
  category,
  onClose,
}: {
  content: string;
  title: string;
  author: string | null;
  time: number;
  newsArticleUid: string;
  category:string,
  onClose: () => void;
}) {
  const keyword = useOutletContext<{ keyword: string; setKeyword: () => {} }>();

  const [isOpen, setIsOpen] = useState(false);
  // const open=true
  // console.log("modal");
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
  return (
    <>
      {createPortal(
        <PortalRoot onClick={onClose}>
          <PortalContent
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <PortalNews>
              <PortalHeader />
              <NewsTitleDiv>
                <TagDiv>
                  <CategoryTag>#{category}</CategoryTag>
                  <SavedSignDiv>
                    <SavedNews
                      newsId={newsArticleUid}
                      unOpen={() => {
                        setIsOpen(true);
                      }}
                    />
                  </SavedSignDiv>
                </TagDiv>
                <NewsTitle>
                  <Highlighter
                    highlightClassName="Highlight"
                    searchWords={[keyword.keyword]}
                    autoEscape={true}
                    textToHighlight={`${title.split("-")[0]}`}
                  />
                </NewsTitle>
                <NewsInformationDiv>
                  <NewsInformationDetail>作者:{author}</NewsInformationDetail>
                  <NewsInformationDetail>
                    發布時間:{timeExpression(time)}
                  </NewsInformationDetail>
                </NewsInformationDiv>
              </NewsTitleDiv>
              <NewsContent>
                <Highlighter
                  highlightClassName="Highlight"
                  searchWords={[keyword.keyword]}
                  autoEscape={true}
                  textToHighlight={`${content}`}
                />
              </NewsContent>
              <FeedBackDiv>
                <ModalBulletin articleId={newsArticleUid} />
              </FeedBackDiv>
            </PortalNews>
            <ModalComment articleId={newsArticleUid} />
          </PortalContent>
        </PortalRoot>,
        modalRoot
      )}
    </>
  );
}

export default Modal;
