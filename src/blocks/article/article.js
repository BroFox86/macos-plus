addCyrillicOrder();

function addCyrillicOrder() {
  var classname = "ol ol",
      style     = document.createElement("style");

  document.head.appendChild(style);

  "абвгдежзиклмнопрстуфхцчшщэюя".split("").forEach(function(c, i) {
    return style.sheet.insertRule(
      classname +
        "> li:nth-child(" + (i + 1) + ')::before { content: "' + c + ')"}',
      0
    );
  });

  style.sheet.insertRule(
    classname + ">li{list-style-type:none;position:relative}",
    0
  );

  style.sheet.insertRule(
    classname +
      ">li::before{position:absolute;width:2em;left:-2.25em;text-align:right;display:inline-block}",
    0
  );
}
