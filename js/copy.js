"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _get(e,t,r){return(_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,r){var o=_superPropBase(e,t);if(o){var n=Object.getOwnPropertyDescriptor(o,t);return n.get?n.get.call(r):n.value}})(e,t,r||e)}function _superPropBase(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=_getPrototypeOf(e)););return e}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Copy=function(e){function r(){var e;return _classCallCheck(this,r),(e=_possibleConstructorReturn(this,_getPrototypeOf(r).call(this)))._trigger=document.querySelector(".js-copy-url-trigger"),e._field=document.querySelector(".js-copy-url-field"),e._wrapper=e._field.parentElement,e}return _inherits(r,Collapse),_createClass(r,[{key:"listen",value:function(){this._trigger.addEventListener("click",this._handle.bind(this))}},{key:"_handle",value:function(){var e=this,t=this._getDuration(this._wrapper);_get(_getPrototypeOf(r.prototype),"_handle",this).call(this,this._trigger,[this._wrapper]),setTimeout(function(){e._copyUrl(),setTimeout(function(){e._showMessage()},t)},t)}},{key:"_copyUrl",value:function(){this._field.value=window.location.href.replace(/\#\d$/i,""),this._field.focus(),this._field.select(),document.execCommand("Copy")}},{key:"_showMessage",value:function(){this._field.blur(),this._field.value="Ссылка скопирована!"}}]),r}(),copyUrl=new Copy;copyUrl.listen();