"use strict";!function(){var e,o,n;document.addEventListener("mouseover",function(t){t.target.classList.contains("js-tooltip-trigger")&&(e=t.target,o=e.title,e.title="",(n=document.createElement("aside")).className="tooltip",'<button class="tooltip__close" type="button"></button>',n.innerHTML=o+'<button class="tooltip__close" type="button"></button>',document.body.append(n))}),document.addEventListener("mousemove",function(t){t.target.classList.contains("js-tooltip-trigger")&&(n.style.left="".concat(t.pageX+20,"px"),n.style.top="".concat(t.pageY+10,"px"))}),document.addEventListener("mouseout",function(t){t.target.classList.contains("js-tooltip-trigger")&&(e.title=n.textContent,document.body.removeChild(n))})}();