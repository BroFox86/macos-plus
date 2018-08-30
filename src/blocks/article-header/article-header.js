"use strict";

/* ==========================================================================
   Add the relative date of published
   ========================================================================== */

// Wrapper function that get the specific time unit from days
function setDate(calcDiff, localize) {
  return function() {
    var days = calcDiff.apply(this, arguments),
        amount, units;
    
    if (days == 0) { 
      return "Обновлено сегодня."; 
    } 
    
    else if (days == 1) { 
      return "Обновлено вчера."; 
    } 
    
    else if (days == 2) { 
      return "Обновлено позавчера."; 
    } 
    
    else if (days <= 6) {
      amount = days;
      units  = localize("days", amount);
    } 
    
    else if (days <= 27) {
      amount = Math.floor(days / 7);
      units  = localize("weeks", amount);
    } 
    
    else if (days >= 28 && days < 365) {    
      amount = (days < 30 ) ? 1 : Math.floor(days / 30);
      units  = localize("months", amount);
    } 
    
    else if (days >= 365) {
      amount = Math.floor(days / 365);
      units  = localize("years", amount);
    }
    
    switch(amount) {
      case 1:
        return "Обновлено " + units + " назад.";
        break;
        
      default:
        return "Обновлено " + amount + " " + units + " назад.";
        break;
    }
  }
}

// Calculate difference in ms between the current date and the modified date
function calcDiff(modDate) {
  var now = new Date(),
      current = new Date(now.getFullYear(), now.getMonth(), now.getDate()), 
      modified  = new Date(modDate).setHours(0),
      days = Math.floor( (current - modified) / 86400000);

  return days = (days >= 0 ) ? days : undefined;
}

// Set the name of time units in accordance with the Russian grammar 
function localizeUnits(units, amount) {
  switch(units) {
    case "days":
      return  (amount == 1) ? "день" 
            : (amount <= 4) ? "дня"  
            : "дней";
      break;
      
    case "weeks":
      return (amount == 1) ? "неделю": "недели";
      break;

    case "months":
      return  (amount == 1) ? "месяц" 
            : (amount <= 4) ? "месяца" 
            : "месяцев";
      break;

    case "years":
      return  (amount == 1) ? "год" 
            : (amount <= 4) ? "года" 
            : "лет";
      break;
  }
}

// Set the relative date
(function() {
  var relativeDate = setDate(calcDiff, localizeUnits),
      $element     = $("[data-modified]");

  $element.append(relativeDate($element.data("modified")));
})();