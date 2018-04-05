addCyrillicOrder("ol ol");

function addCyrillicOrder(element) {
  var classname = element,
      style     = document.createElement("style");

  document.head.appendChild(style);

  "абвгдежзиклмнопрстуфхцчшщэюя".split("").forEach(function(c, i) {
    return style.sheet.insertRule(
      classname +
        "> li:nth-child(" + (i + 1) + ')::before { content: "' + c + ')"}',
      0
    );
  });
}
