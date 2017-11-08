webpackJsonp([0],{

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Hello world';

  var element = document.createElement('div');
  var funccc = function funccc(arg) {
    return arg;
  };
  element.className = 'fa fa-hand-spock-o fa-1g';
  element.innerHTML = text;
  return element;
};

/***/ }),

/***/ 13:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 14:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(3);

var _component = __webpack_require__(12);

var _component2 = _interopRequireDefault(_component);

__webpack_require__(13);

__webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.body.appendChild((0, _component2.default)());

/***/ })

},[7]);
//# sourceMappingURL=app.js.map