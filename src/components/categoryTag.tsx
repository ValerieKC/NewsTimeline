import styled from "styled-components";
import CategoryArray from "./category"

const CategoryDiv = styled.div`
  display: flex;
  align-items: center;
  height:12px;
`;

interface Prop {
  color:string;
}

const CategorySplit = styled.div`
  height: 12px;
  padding-right: 10px;
  border-left: 3px solid ${(props: Prop) => props.color};
`;

const CategoryTag = styled.div`
  font-size: 12px;
  line-height: 12px;
`;



export default function CategoryComponent({
  categoryName
}: {
  categoryName: string;
}) {

  const colorIndex = CategoryArray.findIndex(item=>
    item.category.toLowerCase()===categoryName
  )

  return (
    <CategoryDiv>
      <CategorySplit color={CategoryArray[colorIndex]?.color} />
      <CategoryTag>{categoryName.toUpperCase()}</CategoryTag>
    </CategoryDiv>
  );
}
