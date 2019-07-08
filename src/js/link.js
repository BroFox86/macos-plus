// Open external links in new tabs.
(function() {
  "use strict";

  var SELECTORS = 'a[href^="http://"], a[href^="https://"]';
  var links = document.querySelectorAll( SELECTORS );

  for ( var i = 0; i < links.length; i++ ) {
    links[i].target = "_blank";
  }
})();