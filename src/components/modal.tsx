import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";
import Highlighter from "react-highlight-words";

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
  /* overflow-y: scroll; */
`;

const PortanNews = styled.div`
  width: 100%;
`;
const PortalMessage = styled.div`
  width: 100%;
  height: 100px;
  margin-top: 40px;
`;

const PortalMessageInput = styled.textarea.attrs({
  type: "textarea",
})`
width:100%;
height:100%;
padding:10px;
  border-radius: 8px;
  border: solid 1px #979797;
  line-height: normal;
`;

const modalRoot = document.getElementById("root") as HTMLElement;

// function Modal({ content }: { content: string });

function Modal({
  content,
  onClose,
}: {
 
  content: string;
  onClose: () => void;
}) {
  const keyword = useOutletContext<{ keyword: string; setKeyword: () => {} }>();
const portalInputRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <>
      {createPortal(
        <PortalRoot onClick={onClose}>
          <PortalContent
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <PortanNews>
              <Highlighter
                highlightClassName="Highlight"
                searchWords={[keyword.keyword]}
                autoEscape={true}
                textToHighlight={`${content}`}
              />
            </PortanNews>
            <PortalMessage>
              <PortalMessageInput ref={portalInputRef}>
              </PortalMessageInput>
              </PortalMessage>
          </PortalContent>
        </PortalRoot>,
        modalRoot
      )}
    </>
  );
}



export default Modal;
