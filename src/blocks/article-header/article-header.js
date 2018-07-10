moment.locale("ru");

var $element  = $("[data-get='date']"),
    date      = $element.data("time"),
    moment    = moment(date, "YYYYMMDD").fromNow();

$element.append(moment);