var hook = ".js-modified-date";
var date = $(hook).data("time");
moment.locale("ru");
var moment = moment(date, "YYYYMMDD").fromNow();

$(document).ready(function() {
  $(hook).append(moment);
});
