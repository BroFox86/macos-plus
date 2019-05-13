"use strict";

// Wrapper function that set a specific time unit from days.
function setDate( calcDiff, localizeUnits ) {

  return function() {
    var element = document.querySelector( arguments[0] );

    if ( !element ) {
      return;
    }

    var modifiedDate = element.getAttribute("datetime");
    var days = calcDiff( modifiedDate );
    var amount;
    var units;

    if ( days == 0 ) {

      element.innerHTML = "Обновлено сегодня.";

      return;
    }

    else if ( days == 1 ) {

      element.innerHTML = "Обновлено вчера.";

      return;
    }

    else if ( days == 2 ) {

      element.innerHTML = "Обновлено позавчера.";

      return;
    }

    else if ( days <= 6 ) {

      amount = days;

      units = localizeUnits( "days", amount );
    }

    else if ( days <= 27 ) {

      amount = Math.floor( days / 7 );

      units = localizeUnits( "weeks", amount );
    }

    else if ( days >= 28 && days < 365 ) {

      amount = ( days < 30 ) ? 1 : Math.floor( days / 30 );

      units = localizeUnits( "months", amount );
    }

    else if ( days >= 365 ) {

      amount = Math.floor( days / 365 );

      units = localizeUnits( "years", amount );
    }

    switch( amount ) {
      case 1:
        element.innerHTML = "Обновлено " + units + " назад.";
        break;

      default:
        element.innerHTML = "Обновлено " + amount + " " + units + " назад.";
        break;
    }
  }
};

/**
 * Calculate interval between dates in days.
 * @param {string} modDate - Modified date in MM-DD-YYYY.
 * @returns {number|undefined} - Amount of days.
 */
function calcDiff( modDate ) {
  var date = new Date();
  var current = new Date( date.getFullYear(), date.getMonth(), date.getDate() );
  var modified = new Date( modDate ).setHours( 0 );
  var DAY = 86400000; // ms
  var days = Math.floor( (current - modified) / DAY );

  return days = ( days >= 0 ) ? days : undefined;
};

/**
 * Set the name of time units in accordance with Russian grammar.
 * @param {string} units - Name of time units in English.
 * @param {number} amount - Amount of time units.
 * @returns {string} - Name of time units with decline.
 */
function localizeUnits( units, amount ) {

  switch( units ) {

    case "days":
      return  ( amount == 1 ) ? "день"
            : ( amount <= 4 ) ? "дня"
            : "дней";
      break;

    case "weeks":
      return ( amount == 1 ) ? "неделю": "недели";
      break;

    case "months":
      return  ( amount == 1 ) ? "месяц"
            : ( amount <= 4 ) ? "месяца"
            : "месяцев";
      break;

    case "years":
      return  ( amount == 1 ) ? "год"
            : ( amount <= 4 ) ? "года"
            : "лет";
      break;
  }
};

// Add a relative date of a post from the published date to the modified date.
var relativeDate = setDate( calcDiff, localizeUnits );

relativeDate(".js-date-modified");