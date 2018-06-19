moment.locale("ru");

var $element  = $(".js-modified-date"),
    date      = $element.data("time"),
    moment    = moment(date, "YYYYMMDD").fromNow();

$element.append(moment);