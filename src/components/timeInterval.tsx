import styled from "styled-components";
import timestampConvertDate from "../utils/timeStampConverter";

const TimeTag = styled.div`
  padding-left: 5px;
  position: absolute;
  text-align: center;
  bottom: -33px;
  left: 0px;
  z-index: 4;
  font-size: 16px;
  line-height: 20px;
  border-left: 2px solid #000000;
  font-family: "Quicksand", sans-serif;
  font-weight: 500;
  @media screen and (max-width: 1280px) {
    bottom: -18px;
    font-size: 10px;
    line-height: 12px;
  }
`;

const TimeTagEven = styled.div`
  position: absolute;
  padding-left: 5px;
  text-align: center;
  top: -33px;
  left: 0px;
  z-index: 4;
  font-size: 16px;
  line-height: 20px;
  border-left: 2px solid #000000;
  font-family: "Quicksand", sans-serif;
  font-weight: 500;
  @media screen and (max-width: 1280px) {
    top: -18px;
    font-size: 10px;
    line-height: 12px;
  }
`;

 function timeExpression(time: number) {
   const [, month, date, hours] = timestampConvertDate(time);
   const dataValue = `${month.toLocaleString(undefined, {
     minimumIntegerDigits: 2,
   })}/${date.toLocaleString(undefined, {
     minimumIntegerDigits: 2,
   })} ${hours.toLocaleString(undefined, {
     minimumIntegerDigits: 2,
   })}時`;
   return dataValue;
 }

export default function TimeInterval(time: number, index: number) {
  const interval = (Date.now() - time) / 1000;
  const hours = Math.floor(interval / 3600);
  if (hours < 24) {
    return index % 2 === 0 ? (
      <TimeTag>{hours}小時前</TimeTag>
    ) : (
      <TimeTagEven>{hours}小時前</TimeTagEven>
    );
  } else if (hours <= 48) {
    return index % 2 === 0 ? (
      <TimeTag>{Math.round(hours / 24)}天前</TimeTag>
    ) : (
      <TimeTagEven>{Math.round(hours / 24)}天前</TimeTagEven>
    );
  } else {
    return index % 2 === 0 ? (
      <TimeTag>{timeExpression(time)}</TimeTag>
    ) : (
      <TimeTagEven>{timeExpression(time)}</TimeTagEven>
    );
  }
}
