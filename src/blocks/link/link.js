(function openExternalLinks() {
  var SELECTOR = 'a[href^="http://"], a[href^="https://"]',
    links = document.querySelectorAll( SELECTOR );

  for ( var i = 0; i < links.length; i++ ) {
    links[i].setAttribute.target = "_blank";
  }
})();