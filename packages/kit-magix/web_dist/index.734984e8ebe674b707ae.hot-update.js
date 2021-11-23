self["webpackHotUpdate_ali_mm_kit_magix"]("index",{

/***/ "./web/component/toast/toast.js":
/*!**************************************!*\
  !*** ./web/component/toast/toast.js ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toast_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toast.css */ "./web/component/toast/toast.css");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @alifd/next */ "./node_modules/_@alifd_next@1.22.26@@alifd/next/es/overlay/index.js");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @alifd/next */ "./node_modules/_@alifd_next@1.22.26@@alifd/next/es/message/index.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/_@pmmmwh_react-refresh-webpack-plugin@0.4.3@@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/_@pmmmwh_react-refresh-webpack-plugin@0.4.3@@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/_@pmmmwh_react-refresh-webpack-plugin@0.4.3@@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/_@pmmmwh_react-refresh-webpack-plugin@0.4.3@@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/_react-refresh@0.9.0@react-refresh/runtime.js */ "../mm-scripts/node_modules/_react-refresh@0.9.0@react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var id = 'global-toast-container';
var timeout = 3000;
var messages = [];
var uuid = 0;

var Toast = /*#__PURE__*/function (_React$Component) {
  _inherits(Toast, _React$Component);

  var _super = _createSuper(Toast);

  function Toast() {
    _classCallCheck(this, Toast);

    return _super.apply(this, arguments);
  }

  _createClass(Toast, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_3__.default, {
        visible: this.props.visible,
        hasMask: false,
        align: "tc tc",
        offset: [0, 100]
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("ul", null, this.props.messages.map(function (m) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("li", {
          key: m.id
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
          className: "global-toast"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_4__.default, {
          type: m.level || 'warning',
          title: "\u63D0\u793A"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", {
          className: "message-body",
          title: m.message
        }, m.message))));
      })));
    }
  }], [{
    key: "run",
    value: function run(messages) {
      var container = Toast.init();
      react_dom__WEBPACK_IMPORTED_MODULE_2___default().render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Toast, {
        visible: messages.length > 0,
        messages: messages
      }), container);
    }
  }, {
    key: "init",
    value: function init() {
      var container = document.getElementById(id);

      if (!container) {
        container = document.createElement('div');
        container.setAttribute('id', id);
        document.body.appendChild(container);
      }

      return container;
    }
  }, {
    key: "show",
    value: function show(msg) {
      var _this = this;

      var auto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'warning';
      var id = "item-".concat(uuid++, "-").concat(new Date().getTime());
      messages.unshift({
        id: id,
        message: msg,
        level: level
      });

      while (messages.length > 10) {
        messages.pop();
      }

      Toast.run(messages);

      if (auto) {
        setTimeout(function () {
          _this.hide(id);
        }, timeout);
      }

      return id;
    }
  }, {
    key: "hide",
    value: function hide(id) {
      messages = messages.filter(function (m) {
        return m.id !== id;
      });
      Toast.run(messages);
    }
  }]);

  return Toast;
}((react__WEBPACK_IMPORTED_MODULE_1___default().Component));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Toast);

const currentExports = __react_refresh_utils__.getModuleExports(module.id);
__react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.id);

if (true) {
  const isHotUpdate = !!module.hot.data;
  const prevExports = isHotUpdate ? module.hot.data.prevExports : null;

  if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
    module.hot.dispose(
      /**
       * A callback to performs a full refresh if React has unrecoverable errors,
       * and also caches the to-be-disposed module.
       * @param {*} data A hot module data object from Webpack HMR.
       * @returns {void}
       */
      function hotDisposeCallback(data) {
        // We have to mutate the data object to get data registered and cached
        data.prevExports = currentExports;
      }
    );
    module.hot.accept(
      /**
       * An error handler to allow self-recovering behaviours.
       * @param {Error} error An error occurred during evaluation of a module.
       * @returns {void}
       */
      function hotErrorHandler(error) {
        if (
          typeof __react_refresh_error_overlay__ !== 'undefined' &&
          __react_refresh_error_overlay__
        ) {
          __react_refresh_error_overlay__.handleRuntimeError(error);
        }

        if (typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__) {
          if (window.onHotAcceptError) {
            window.onHotAcceptError(error.message);
          }
        }

        __webpack_require__.c[module.id].hot.accept(hotErrorHandler);
      }
    );

    if (isHotUpdate) {
      if (
        __react_refresh_utils__.isReactRefreshBoundary(prevExports) &&
        __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)
      ) {
        module.hot.invalidate();
      } else {
        __react_refresh_utils__.enqueueUpdate(
          /**
           * A function to dismiss the error overlay after performing React refresh.
           * @returns {void}
           */
          function updateCallback() {
            if (
              typeof __react_refresh_error_overlay__ !== 'undefined' &&
              __react_refresh_error_overlay__
            ) {
              __react_refresh_error_overlay__.clearRuntimeErrors();
            }
          }
        );
      }
    }
  } else {
    if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
      module.hot.invalidate();
    }
  }
}

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("46986843e6e7ce45f999")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=index.734984e8ebe674b707ae.hot-update.js.map