import { createPortal } from "react-dom";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";
import Highlighter from "react-highlight-words";

import ModalComment from "./modalComment";
import ModalBulletin from "./modalBulletin";
import SavedNews from "./savedNews";
import { useState } from "react";

const PortalRoot = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
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
  padding: 40px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1200px;
  height: 80%;
  background: #fff;
  overflow-y: scroll;
`;

const PortalNews = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const modalRoot = document.getElementById("root") as HTMLElement;

function Modal({
  content,
  newsArticleUid,
  onClose,
}: {
  content: string;
  newsArticleUid: string;
  onClose: () => void;
}) {
  const keyword = useOutletContext<{ keyword: string; setKeyword: () => {} }>();

  const [isOpen, setIsOpen] = useState(false);
  // const open=true
  // console.log("modal");
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
              <SavedNews
                newsId={newsArticleUid}
                unOpen={() => {
                  setIsOpen(true);
                }}
              />
              <Highlighter
                highlightClassName="Highlight"
                searchWords={[keyword.keyword]}
                autoEscape={true}
                textToHighlight={`${content}`}
              />
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
