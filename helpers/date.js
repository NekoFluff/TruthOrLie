export function timestampToDate(UNIX_timestamp) {
  return new Date(UNIX_timestamp * 1000);
}

export function dateToString(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  return day + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
}

export function timestampToString(UNIX_timestamp) {
  return dateToString(timestampToDate(UNIX_timestamp));
}

export function secondsTillDate(targetDate) {
  // Set the date we're counting down to
  var date = targetDate.getTime();

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var difference = date - now;

  return difference;
}
