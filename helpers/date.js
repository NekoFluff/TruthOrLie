export function timestampToDate(UNIX_timestamp) {
  return new Date(UNIX_timestamp * 1000);
}

export function approximateTimeTillDate(endDate) {
    const now = new Date();
    if (endDate < now) { 
      return {days: 0, hours: 0, minutes: 0, seconds: 0}
    } 

    // get total seconds between the times
    var delta = Math.abs(endDate - now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // // what's left is seconds
    var seconds = delta % 60;  // in theory the modulus is not required
    return {days, hours, minutes, seconds};
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
  var difference = date - now / 1000;

  return difference;
}
