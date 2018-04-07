addCyrillicOrder("ol ol");

function addCyrillicOrder(element) {

  var style = document.createElement("style");
  document.head.appendChild(style);

  $(element).addClass("has-cyrillic-order");

  "абвгдежзиклмнопрстуфхцчшщэюя".split("").forEach(function(c, i) {
    return style.sheet.insertRule(
      element +
        "> li:nth-child(" + (i + 1) + ')::before { content: "' + c + ')"}',
      0
    );
  });
}
