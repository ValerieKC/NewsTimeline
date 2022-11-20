export default function timestampConvertDate(time: string | number | Date) {
  const dateObj = new Date(time);
  const year=dateObj.getFullYear().toString()
  const month = dateObj.getMonth();
  const date = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  // const dataValue = `${month.toLocaleString(undefined, {
  //   minimumIntegerDigits: 2,
  // })}/${date.toLocaleString(undefined, {
  //   minimumIntegerDigits: 2,
  // })} ${hours.toLocaleString(undefined, {
  //   minimumIntegerDigits: 2,
  // })}時`;
  // return dataValue;
  return [year,month, date, hours,minutes];
}
