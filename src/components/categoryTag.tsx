import styled from "styled-components";
import CategoryArray from "./category"

const CategoryDiv = styled.div`
  display: flex;
  align-items: center;
`;

interface Prop {
  color:string;
}

const CategorySplit = styled.div`
  /* color: ${(props: Prop) => props.color}; */
  height:12px;
  padding-right: 10px;
  border-left: 3px solid ${(props: Prop) => props.color};
`;

const CategoryTag = styled.div`
  transform: translateY(-1px);
`;



export default function CategoryComponent({
  categoryName
}: {
  categoryName: string;
}) {

//   const test= CategoryArray.map(item=>
//     {
//       return item.category.toLowerCase()=== categoryName;
//       // console.log(item.category.toLowerCase(), categoryName);
//       // console.log(categoryName)
//     }
//   )
// console.log(test)
  const colorIndex = CategoryArray.findIndex(item=>
    item.category.toLowerCase()===categoryName
  )
  // console.log(categoryName)

  console.log(CategoryArray[colorIndex]?.color)

  return (
    <CategoryDiv>
      <CategorySplit color={CategoryArray[colorIndex]?.color} />
      <CategoryTag>{categoryName.toUpperCase()}</CategoryTag>
    </CategoryDiv>
  );
}
