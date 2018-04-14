moment.locale("ru");

var $modDate = $(".js-modified-date"),
    date     = $modDate.data("time"),
    moment   = moment(date, "YYYYMMDD").fromNow();

$modDate.append(moment);
