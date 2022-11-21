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
  overflow-y: scroll;
  /* display: ${(props: Prop) => props.show}; */
  ::-webkit-scrollbar {
    /* display: none; */
  }
`;

interface Prop {
  show?: string;
}

const PortalContent = styled.div`
  padding: 60px 100px;
  padding-top: 70px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 70vw;
  min-width: 800px;
  height: 80vh;
  background: #fff;
  overflow-y: scroll;
  font-size: 16px;
`;

const PortalNews = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SavedSignDiv = styled.div`
  width: 12px;
  height: 12px;
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 20px;
  top: 20px;
`;
const NewsTitleDiv = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  line-height: 26px;
`;

const NewsInformationDiv = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  font-size:12px;
`;
const NewsInformationDetail = styled.div``;
const NewsContent=styled.div`
  margin-top: 30px;
  line-height: 28px;
`

const modalRoot = document.getElementById("root") as HTMLElement;

function Modal({
  content,
  title,
  author,
  time,
  newsArticleUid,
  onClose,
}: {
  content: string;
  title: string;
  author: string | null;
  time: number;
  newsArticleUid: string;
  onClose: () => void;
}) {
  const keyword = useOutletContext<{ keyword: string; setKeyword: () => {} }>();

  const [isOpen, setIsOpen] = useState(false);
  // const open=true
  // console.log("modal");
  function timeExpression(time: number) {
    const [year,month, date, hours, minutes] = timestampConvertDate(time);
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
              <SavedSignDiv>
                <SavedNews
                  newsId={newsArticleUid}
                  unOpen={() => {
                    setIsOpen(true);
                  }}
                />
              </SavedSignDiv>
              <NewsTitleDiv>
                <Highlighter
                  highlightClassName="Highlight"
                  searchWords={[keyword.keyword]}
                  autoEscape={true}
                  textToHighlight={`${title.split("-")[0]}`}
                />
              </NewsTitleDiv>
              <NewsInformationDiv>
                <NewsInformationDetail>作者:{author}</NewsInformationDetail>
                <NewsInformationDetail>
                  發布時間:{timeExpression(time)}
                </NewsInformationDetail>
              </NewsInformationDiv>
              <NewsContent>
                <Highlighter
                  highlightClassName="Highlight"
                  searchWords={[keyword.keyword]}
                  autoEscape={true}
                  textToHighlight={`${content}`}
                />
              </NewsContent>
            </PortalNews>

            <ModalComment articleId={newsArticleUid} />
            <ModalBulletin articleId={newsArticleUid} />
          </PortalContent>
        </PortalRoot>,
        modalRoot
      )}
    </>
  );
}

export default Modal;
