moment.locale("ru");

var $modDate = $("article time.js-modified-date"),
    date     = $modDate.data("time"),
    moment   = moment(date, "YYYYMMDD").fromNow();

$(document).ready(function() {
  $modDate.append(moment);
});
