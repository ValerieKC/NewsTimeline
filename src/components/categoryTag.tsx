import styled from "styled-components";
const CategoryDiv = styled.div`
  display: flex;
`;

interface Prop {
  fontSize?: string;
  divHeight?: string;
}

const CategoryTag = styled.div`
  height: ${(props: Prop) => props.divHeight};
  font-size: ${(props: Prop) => props.fontSize};
  padding: 0 20px;
  min-width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  background-color: #ca8d57;
  color: white;
  border-radius: 16px;
`;



export default function CategoryComponent({
  categoryName,
  fontSize,
  divHeight,
}: {
  categoryName: string;
  fontSize: string;
  divHeight: string;
}) {
  return (
    <CategoryDiv>
      <CategoryTag fontSize={fontSize} divHeight={divHeight}>
        #{categoryName}
      </CategoryTag>
    </CategoryDiv>
  );
}
