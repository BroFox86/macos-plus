/**
 * Wrapper function that set a specific time unit from days.
 */
function setDate( calcDiff, localizeUnits ) {
  "use strict";

  return ( selector ) => {
    const element = document.querySelector( selector );

    if ( !element ) return;

    const modifiedDate = element.getAttribute("datetime");
    const days = calcDiff( modifiedDate );

    let amount;
    let units;

    if ( days <= 2 ) {

      if ( days < 0 ) {
        element.innerHTML = "Только что обновлено.";
      }

      if ( days == 0 ) {
        element.innerHTML = "Обновлено сегодня.";
      }

      if ( days == 1 ) {
        element.innerHTML = "Обновлено вчера.";
      }

      if ( days == 2 ) {
        element.innerHTML = "Обновлено позавчера.";
      }

      return;
    }

    if ( days <= 6 ) {

      amount = days;

      units = localizeUnits( "days", amount );

    } else if ( days <= 27 ) {

      amount = Math.floor( days / 7 );

      units = localizeUnits( "weeks", amount );

    } else if ( days >= 28 && days < 365 ) {

      amount = ( days < 30 ) ? 1 : Math.floor( days / 30 );

      units = localizeUnits( "months", amount );

    } else if ( days >= 365 ) {

      amount = Math.floor( days / 365 );

      units = localizeUnits( "years", amount );
    }

    switch( amount ) {
      case 1:
        element.innerHTML = `Обновлено ${units} назад.`;
        break;

      default:
        element.innerHTML = `Обновлено ${amount} ${units} назад.`;
        break;
    }
  };
}

/**
 * Calculate interval between dates in days.
 * @param {string} modDate - Modified date in MM-DD-YYYY format.
 * @returns {number} - Amount of days.
 */
function calcDiff( modDate ) {
  const currentDate = new Date();
  const modifiedDate = new Date( modDate );
  const DAY_MS = 86400000;

  return Math.floor( (currentDate - modifiedDate) / DAY_MS );
}

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

    case "weeks":
      return ( amount == 1 ) ? "неделю": "недели";

    case "months":
      return  ( amount == 1 ) ? "месяц"
            : ( amount <= 4 ) ? "месяца"
            : "месяцев";

    case "years":
      return  ( amount == 1 ) ? "год"
            : ( amount <= 4 ) ? "года"
            : "лет";
  }
}

const setRelativeDate = setDate( calcDiff, localizeUnits );

setRelativeDate(".js-date-modified");