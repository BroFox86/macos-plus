/* ==========================================================================
   Add relative date of published
   ========================================================================== */

moment.locale("ru");

var $element  = $("[data-modified]"),
    date      = $element.data("modified"),
    moment    = moment(date, "YYYYMMDD").fromNow();

$element.append(moment);