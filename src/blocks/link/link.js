/**
 * Open external links in the new tabs.
 * @module externalLinks
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
(function() {
  var SELECTOR = 'a[href^="http://"], a[href^="https://"]',
    links = document.querySelectorAll( SELECTOR );

  for ( var i = 0; i < links.length; i++ ) {
    links[i].target = "_blank";
  }
})();