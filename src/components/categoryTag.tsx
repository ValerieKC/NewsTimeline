import styled from "styled-components";
const CategoryDiv = styled.div`
  display: flex;
`;

const CategoryTag = styled.div`
  width: 100%;
  padding: 0 20px;
  min-width: 80px;
  max-width: 120px;
  text-align: center;
  font-size: 14px;
  background-color: #ca8d57;
  color: white;
  border-radius: 16px;
`;

export default function CategoryComponent({categoryName}:{categoryName:string}){
  return(
  <CategoryDiv>
    <CategoryTag>{categoryName}</CategoryTag>
  </CategoryDiv>
  )
}
