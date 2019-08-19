/**
 * Open external links in new tabs.
 */
{
  const SELECTORS = 'a[href^="http://"], a[href^="https://"]';
  const links = document.querySelectorAll( SELECTORS );

  for ( let link of links ) {
    link.target = "_blank";
  }
}