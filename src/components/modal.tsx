import React, { useState } from "react";
import {createPortal} from "react-dom"
import { useOutletContext } from "react-router-dom";
import styled from "styled-components"
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
  width: 60%;
  height: 1000px;
  margin: 100px auto;
  background: #fff;
`;

  const modalRoot = document.getElementById("root") as HTMLElement;

  // function Modal({ content }: { content: string });

function Modal({content,onClose}:{content:string,onClose:()=>void}) {
  const keyword: any = useOutletContext();
  return (
    <>
      {createPortal(
        <PortalRoot onClick={onClose}>
          <PortalContent>
            <Highlighter
              highlightClassName="Highlight"
              searchWords={[keyword.keyword]}
              autoEscape={true}
              textToHighlight={`${content}`}
            />

            {content}
          </PortalContent>
        </PortalRoot>,
        modalRoot
      )}
    </>
  );
}

export default Modal