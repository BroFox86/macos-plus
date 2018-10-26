"use strict";

/**
 * Add the relative date of the post from the published date to the modified date.
 * @module relativeDate
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
(function() {
  var relativeDate = setDate( calcDiff, localizeUnits ),
    SELECTOR = "[data-modified]";

  relativeDate(SELECTOR);

  /**
   * Wrapper function that set the specific time unit from days
   * @private
   * @param {function} calcDiff - Calculate the interval between the dates in days.
   * @param {function} localizeUnits - Set the name of the time units in accordance with the Russian grammar.
   * @returns {function}
   */
  function setDate( calcDiff, localizeUnits ) {

    return function() {
      var elem = document.querySelector( arguments[0] );

      if ( !elem ) {
        return;
      }

      var modifiedDate = elem.getAttribute("datetime"),
        days = calcDiff( modifiedDate ),
        amount,
        units;

      if ( days == 0 ) {

        elem.innerHTML = "Обновлено сегодня.";

        return;
      }

      else if ( days == 1 ) {

        elem.innerHTML = "Обновлено вчера.";

        return;
      }

      else if ( days == 2 ) {

        elem.innerHTML = "Обновлено позавчера.";

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
          elem.innerHTML = "Обновлено " + units + " назад.";
          break;

        default:
          elem.innerHTML = "Обновлено " + amount + " " + units + " назад.";
          break;
      }
    }
  }

  /**
   * Calculate the interval between the dates in days.
   * @private
   * @param {string} modDate - Modified date in MM-DD-YYYY.
   * @returns {number|undefined} - Amount of days of undefined.
   */
  function calcDiff( modDate ) {
    var now = new Date(),
      current = new Date( now.getFullYear(), now.getMonth(), now.getDate() ),
      modified = new Date( modDate ).setHours( 0 ),
      days = Math.floor( (current - modified) / 86400000 );

    return days = ( days >= 0 ) ? days : undefined;
  }

  /**
   * Set the name of the time units in accordance with the Russian grammar.
   * @private
   * @param {string} units - Name of the units of time in English.
   * @param {!number} amount - Amount of the time units.
   * @returns {string} - Name of the time units with decline.
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
  }
})();


