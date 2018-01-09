moment.locale("ru");

var $modDate = $(".js-modified-date"),
    date     = $modDate.data("time"),
    moment   = moment(date, "YYYYMMDD").fromNow();

$(document).ready(function() {
  $modDate.append(moment);
});
