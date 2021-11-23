(self["webpackChunk_ali_mm_kit_magix"] = self["webpackChunk_ali_mm_kit_magix"] || []).push([["web_index_js"],{

/***/ "./web/component/toast/toast.js":
/*!**************************************!*
  !*** ./web/component/toast/toast.js ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _toast_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toast.css */ "./web/component/toast/toast.css");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_3__);
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
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

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

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
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_3__.Overlay, {
        visible: this.props.visible,
        hasMask: false,
        align: "tc tc",
        offset: [0, 100]
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("ul", null, this.props.messages.map(function (m) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("li", {
          key: m.id
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
          className: "global-toast"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_3__.Message, {
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

/***/ }),

/***/ "./web/index.js":
/*!**********************!*
  !*** ./web/index.js ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _widgets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./widgets */ "./web/widgets.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

// import WebTestCommand from './pageComponent/test'
// import Iconfont from './pageComponent/iconfont'
// import Spmlog from './pageComponent/spmlog'
// import Chartpark from './pageComponent/chartpark'
// import Gallery from './pageComponent/gallery'
// import Publish from './pageComponent/publish'
// import './index.css'

console.log('Magix widgets', _widgets__WEBPACK_IMPORTED_MODULE_0__.default);
_widgets__WEBPACK_IMPORTED_MODULE_0__.default.forEach(function (widget) {
  window.RMX.register(widget);
});

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

/***/ }),

/***/ "./web/pageComponent/chartpark.jsx":
/*!*****************************************!*
  !*** ./web/pageComponent/chartpark.jsx ***!
  \*****************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/api */ "./web/utils/api.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var curdir = window.RMX.project.dir;

var ChartPark = /*#__PURE__*/function (_React$Component) {
  _inherits(ChartPark, _React$Component);

  var _super = _createSuper(ChartPark);

  function ChartPark(props) {
    var _this;

    _classCallCheck(this, ChartPark);

    _this = _super.call(this, props);
    _this.state = {
      canClick: false,
      errorTip: ''
    };
    return _this;
  }

  _createClass(ChartPark, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      (0,_utils_api__WEBPACK_IMPORTED_MODULE_2__.get)('/extra/magix/config', {
        cwd: curdir
      }).then(function (res) {
        if (res) {
          _this2.setState({
            canClick: !!res.chartParkId,
            errorTip: res.chartParkId ? '' : '还未配置chartParkId'
          });
        }
      });
    }
  }, {
    key: "exec",
    value: function exec() {
      this.props.emit('chartpark', 'magixChartpark', {
        cwd: curdir
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      // 0 代表停止
      // 1 代表运行
      var status = this.props.status;
      var _this$state = this.state,
          canClick = _this$state.canClick,
          errorTip = _this$state.errorTip;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-detail"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-head"
      }, "\u540C\u6B65chartpark\u4E0A\u7684\u6570\u636E\u5230\u9879\u76EE\u4E2D"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-btn"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
        disabled: !canClick || status == 1,
        onClick: function onClick() {
          return _this3.exec();
        }
      }, "\u5F00\u59CB\u540C\u6B65"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "action-error"
      }, errorTip)));
    }
  }]);

  return ChartPark;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChartPark);

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

/***/ }),

/***/ "./web/pageComponent/cliConfig.jsx":
/*!*****************************************!*
  !*** ./web/pageComponent/cliConfig.jsx ***!
  \*****************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/api */ "./web/utils/api.js");
/* harmony import */ var _component_toast_toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component/toast/toast */ "./web/component/toast/toast.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }






var DevItem = /*#__PURE__*/function (_React$Component) {
  _inherits(DevItem, _React$Component);

  var _super = _createSuper(DevItem);

  function DevItem() {
    _classCallCheck(this, DevItem);

    return _super.apply(this, arguments);
  }

  _createClass(DevItem, [{
    key: "render",
    value: function render() {
      var value = this.props.value;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, value.map(function (_ref) {
        var name = _ref.name,
            host = _ref.host,
            ip = _ref.ip;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          className: "item-row"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: "mr5"
        }, "\u540D\u79F0:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Input, {
          defaultValue: name,
          className: "mb5"
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: "mr5 ml5"
        }, "IP:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Input, {
          placeholder: "IP",
          className: "mb5",
          defaultValue: ip
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: "mr5 ml5"
        }, "\u57DF\u540D:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Input, {
          placeholder: "\u57DF\u540D",
          className: "mb5",
          defaultValue: host
        })));
      }));
    }
  }]);

  return DevItem;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

var GalleryItem = /*#__PURE__*/function (_React$Component2) {
  _inherits(GalleryItem, _React$Component2);

  var _super2 = _createSuper(GalleryItem);

  function GalleryItem() {
    _classCallCheck(this, GalleryItem);

    return _super2.apply(this, arguments);
  }

  _createClass(GalleryItem, [{
    key: "render",
    value: function render() {
      var value = this.props.value;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, value.map(function (_ref2) {
        var name = _ref2.name,
            path = _ref2.path;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          className: "item-row"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: "mr5"
        }, "\u7EC4\u4EF6\u5E93\u540D\u79F0:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Input, {
          defaultValue: name,
          className: "mb5"
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: "mr5 ml5"
        }, "\u540C\u6B65\u5230\u8DEF\u5F84:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Input, {
          defaultValue: path,
          className: "mb5"
        })));
      }));
    }
  }]);

  return GalleryItem;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

var InputItem = /*#__PURE__*/function (_React$Component3) {
  _inherits(InputItem, _React$Component3);

  var _super3 = _createSuper(InputItem);

  function InputItem() {
    _classCallCheck(this, InputItem);

    return _super3.apply(this, arguments);
  }

  _createClass(InputItem, [{
    key: "render",
    value: function render() {
      var value = this.props.value;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, value.map(function (v) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: "item-short "
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Input, {
          className: "width100",
          defaultValue: v
        }));
      }));
    }
  }]);

  return InputItem;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component)); // const curdir = window.RMX.project.dir
// const Tooltip = Balloon.Tooltip


var FormItem = _alifd_next__WEBPACK_IMPORTED_MODULE_1__.Form.Item;
var formItemLayout = {
  labelCol: {
    fixedSpan: 6
  },
  wrapperCol: {
    span: 18
  }
};

var CliConfig = /*#__PURE__*/function (_React$Component4) {
  _inherits(CliConfig, _React$Component4);

  var _super4 = _createSuper(CliConfig);

  function CliConfig(props) {
    var _this;

    _classCallCheck(this, CliConfig);

    _this = _super4.call(this, props);
    _this.field = new _alifd_next__WEBPACK_IMPORTED_MODULE_1__.Field(_assertThisInitialized(_this), {
      deepReset: true
    });

    _this.handleSubmit = function (values) {
      var customValues = _this.field.getValues();

      var config = {}; // "ipConfig": {
      //   "日常": "11.160.79.18",
      // } 格式装换

      customValues.ipConfig.forEach(function (_ref3) {
        var name = _ref3.name,
            host = _ref3.host,
            ip = _ref3.ip;
        config[name] = ip;
      });
      customValues.ipConfig = config;
      (0,_utils_api__WEBPACK_IMPORTED_MODULE_2__.post)('/rmx/config/save', {
        config: _objectSpread(_objectSpread({}, values), customValues),
        cwd: window.RMX.project.dir
      }).then(function (res) {
        _component_toast_toast__WEBPACK_IMPORTED_MODULE_3__.default.show('保存成功');
      });
      console.log('values----', values, customValues);
    };

    _this.state = {
      defaultForm: {
        matPort: {
          label: 'MatPort',
          name: 'matPort',
          value: 1234,
          type: 'input'
        },
        timeout: {
          label: '接口超时',
          name: 'timeout',
          value: 1000,
          type: 'input'
        },
        autoOpenUrl: {
          label: '自动打开域名',
          name: 'autoOpenUrl',
          value: 'localhost',
          type: 'input'
        },
        apiMatch: {
          label: '代理配置',
          name: 'apiMatch',
          value: ['api/', '.json', '.action'],
          type: 'inputItem'
        },
        indexMatch: {
          label: '入口文件',
          name: 'indexMatch',
          value: ['index.html'],
          type: 'inputItem'
        },
        scopedCss: {
          label: 'scoped样式',
          name: 'scopedCss',
          value: ['./src/app/assets/iconfont.less'],
          type: 'inputItem'
        },
        globalCss: {
          label: 'global全局样式',
          name: 'globalCss',
          value: ['./src/app/gallery/mx-style/index.less'],
          type: 'inputItem'
        },
        magixLoaderType: {
          label: '模块类型',
          name: 'magixLoaderType',
          value: 'cmd',
          type: 'input'
        },
        magixJsTranspile: {
          label: '目标语言',
          name: 'magixJsTranspile',
          value: 'ES3',
          type: 'input'
        },
        rootAppName: {
          label: 'app唯一标识',
          name: 'rootAppName',
          value: 'app',
          type: 'input'
        },
        HMRWatchFiles: {
          label: '监听文件',
          name: 'HMRWatchFiles',
          value: ['src/**/*.js', 'src/**/*.ts', 'src/**/*.es', 'src/**/*.mx', 'src/**/*.css', 'src/**/*.html', 'src/**/*.scss', 'src/**/*.less'],
          type: 'inputItem'
        },
        dynamicProjectName: {
          label: '包名是否动态',
          name: 'dynamicProjectName',
          value: true,
          type: 'checkbox'
        },
        jsExtension: {
          label: 'add生成格式',
          name: 'jsExtension',
          value: '.es',
          type: 'input'
        },
        dataLimit: {
          label: 'POST请求大小',
          name: 'dataLimit',
          value: '10mb',
          type: 'input'
        },
        rapVersion: {
          label: 'Rap版本',
          name: 'rapVersion',
          value: 2,
          type: 'input'
        },
        rapProjectId: {
          label: 'Rap版本',
          name: 'rapProjectId',
          value: 2,
          type: 'input',
          disabled: true
        },
        modelsPath: {
          label: 'models路径',
          name: 'modelsPath',
          value: 'src/app/services/models.js',
          type: 'input',
          disabled: true
        },
        modelsTmpl: {
          label: 'models模板',
          name: 'modelsTmpl',
          value: '',
          type: 'input',
          disabled: true
        },
        srcFolder: {
          label: '源文件目录',
          name: 'srcFolder',
          value: 'src',
          type: 'input'
        },
        buildFolder: {
          label: '编译目录',
          name: 'buildFolder',
          value: 'build',
          type: 'input'
        },
        cloudBuild: {
          label: '云构建',
          name: 'cloudBuild',
          value: true,
          type: 'checkbox'
        },
        logkey: {
          label: '黄金令箭',
          name: 'logkey',
          value: 'alimama_bp.3.1',
          type: 'input'
        },
        spma: {
          label: 'spm-a段',
          name: 'spma',
          value: 'a2e17',
          type: 'input',
          disabled: true
        },
        // logkey: {
        //   label: '黄金令箭',
        //   name: 'logkey',
        //   value: 'alimama_bp.3.1',
        //   type: 'input'
        // },
        dataPlusConfigPath: {
          label: '数据小站配置',
          name: 'dataPlusConfigPath',
          value: 'src/app/dataplus/config.js',
          type: 'input'
        },
        dataPlusConfigTmpl: {
          label: '数据小站模板',
          name: 'dataPlusConfigTmpl',
          value: '',
          type: 'input'
        },
        spmFolder: {
          label: 'spm打点目录',
          name: 'spmFolder',
          value: 'src/app/views',
          type: 'input'
        },
        spmPropertyMatch: {
          label: 'spm规则',
          name: 'spmPropertyMatch',
          value: ['to="', ':to="'],
          type: 'inputItem'
        },
        chartParkId: {
          label: 'chartParkId',
          name: 'chartParkId',
          value: '',
          type: 'input'
        },
        chartParkIndexPath: {
          label: 'chartPark路径',
          name: 'chartParkIndexPath',
          value: 'src/app/chartpark/index.js',
          type: 'input'
        },
        chartParkIndexTmpl: {
          label: 'chartPark模板',
          name: 'chartParkIndexTmpl',
          value: '',
          type: 'input'
        },
        codeTmpl: {
          label: 'view代码片段',
          name: 'codeTmpl',
          value: '',
          type: 'input'
        },
        galleries: {
          label: '组件galler配置',
          name: 'galleries',
          value: [{
            name: '@ali/zs-gallery',
            // 组件库名称，可以@指定组件库版本
            path: 'src/app/gallery' // 组件同步到项目中的路径

          }],
          type: 'galleryItem'
        },
        galleriesMxRoot: {
          label: '通用组件路径',
          name: 'galleriesMxRoot',
          value: 'app/gallery',
          type: 'input'
        },
        galleriesLgRoot: {
          label: '组件路径',
          name: 'galleriesLgRoot',
          value: 'app/gallery-local',
          type: 'input'
        },
        defId: {
          label: 'defId',
          name: 'defId',
          value: '123',
          type: 'input',
          disabled: true
        },
        iconfontId: {
          label: 'iconfontId',
          name: 'iconfontId',
          value: '',
          type: 'input',
          disabled: true
        },
        iconfontScanPath: {
          label: 'iconfontScanPath',
          name: 'iconfontScanPath',
          value: 'src',
          type: 'input',
          disabled: true
        },
        iconfontPath: {
          label: 'iconfontPath',
          name: 'iconfontPath',
          value: 'src/app/assets/iconfont.less',
          type: 'input',
          disabled: true
        },
        rapper: {
          label: '启用rapper',
          name: 'rapper',
          value: true,
          type: 'checkbox',
          disabled: true
        },
        ipConfig: {
          label: '开发环境配置',
          name: 'ipConfig',
          value: [{
            name: '名称',
            ip: '127.0.0.1',
            host: 'magix.taobao.com'
          }],
          type: 'devItem'
        }
      }
    };
    return _this;
  }

  _createClass(CliConfig, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var defaultForm = this.state.defaultForm;
      var path = window.location.pathname.match(/^\/app\/(.*?)$/)[1];
      (0,_utils_api__WEBPACK_IMPORTED_MODULE_2__.get)("/project/get", {
        id: path
      }).then(function (res) {
        var magixCliConfig = res.magixCliConfig;

        if (magixCliConfig.ipConfig) {
          var keys = Object.keys(magixCliConfig.ipConfig);
          var ipConfig = keys.map(function (name) {
            return {
              name: name,
              ip: magixCliConfig.ipConfig[name],
              host: 'magix.taobao.com'
            };
          });
          magixCliConfig.ipConfig = ipConfig;
          console.log('projects', magixCliConfig);
        }

        var overrideKeys = Object.keys(magixCliConfig);
        overrideKeys.forEach(function (key) {
          var value = magixCliConfig[key];

          if (defaultForm[key]) {
            defaultForm[key].value = value;
          }
        });

        _this2.setState({
          defaultForm: defaultForm,
          loaded: true
        }); // let list = res.map((item) => {
        //   return {
        //     key:item.id,
        //     value:item.id
        //   }
        // })


        console.log('list', res);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$field = this.field,
          init = _this$field.init,
          setValue = _this$field.setValue,
          reset = _this$field.reset;
      var _this$state = this.state,
          defaultForm = _this$state.defaultForm,
          _this$state$loaded = _this$state.loaded,
          loaded = _this$state$loaded === void 0 ? false : _this$state$loaded;
      if (!loaded) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "loading");
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "side-extra-page"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, "MagixCliConfig\u914D\u7F6E"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Form, _extends({
        style: {
          width: '80%'
        }
      }, formItemLayout), Object.keys(defaultForm).map(function (key) {
        var _defaultForm$key = defaultForm[key],
            value = _defaultForm$key.value,
            name = _defaultForm$key.name,
            type = _defaultForm$key.type,
            label = _defaultForm$key.label,
            _defaultForm$key$disa = _defaultForm$key.disabled,
            disabled = _defaultForm$key$disa === void 0 ? false : _defaultForm$key$disa;
        var com = null;

        switch (type) {
          case 'input':
            com = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(FormItem, {
              label: label + ':'
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Input, {
              disabled: disabled,
              style: {
                width: 210
              },
              name: name,
              defaultValue: value
            }));
            break;

          case 'devItem':
            com = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(FormItem, {
              label: label + ':'
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(DevItem, init(name, {
              initValue: value
            })));
            break;

          case 'inputItem':
            com = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(FormItem, {
              label: label + ':'
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(InputItem, init(name, {
              initValue: value
            })));
            break;

          case 'checkbox':
            com = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(FormItem, {
              label: label + ':'
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Checkbox, {
              name: name,
              defaultChecked: value
            }));
            break;

          case 'galleryItem':
            com = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(FormItem, {
              label: label + ':'
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(GalleryItem, init(name, {
              initValue: value
            })));
            break;

          default:
            break;
        }

        return com;
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(FormItem, {
        label: " "
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Form.Submit, {
        onClick: this.handleSubmit
      }, "\u4FDD\u5B58\u914D\u7F6E"))));
    }
  }]);

  return CliConfig;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CliConfig);

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

/***/ }),

/***/ "./web/pageComponent/daily.js":
/*!************************************!*
  !*** ./web/pageComponent/daily.js ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/api */ "./web/utils/api.js");
/* harmony import */ var _component_toast_toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component/toast/toast */ "./web/component/toast/toast.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var curProject = window.RMX.project;

var Daily = /*#__PURE__*/function (_React$Component) {
  _inherits(Daily, _React$Component);

  var _super = _createSuper(Daily);

  function Daily(props) {
    var _this;

    _classCallCheck(this, Daily);

    _this = _super.call(this, props);
    _this.state = {
      isSpm: true,
      commitMsg: ''
    };
    return _this;
  }

  _createClass(Daily, [{
    key: "changeValue",
    value: function changeValue(key, val) {
      this.setState(_defineProperty({}, key, val));
    }
  }, {
    key: "exec",
    value: function exec() {
      var _this$state = this.state,
          isSpm = _this$state.isSpm,
          commitMsg = _this$state.commitMsg;

      if (!commitMsg) {
        _component_toast_toast__WEBPACK_IMPORTED_MODULE_3__.default.show('请先填写提交信息', 'warning');
        return;
      }

      this.props.emit('daily', 'magixDaily', {
        cwd: curProject.dir,
        branch: curProject.branch,
        message: commitMsg,
        nospm: !isSpm,
        uncheck: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      // 0 代表停止
      // 1 代表运行
      var status = this.props.status;
      var _this$state2 = this.state,
          isSpm = _this$state2.isSpm,
          commitMsg = _this$state2.commitMsg;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-detail"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-head"
      }, "\u5F00\u542F\u4E4B\u524D\uFF0C\u8BF7\u586B\u5199daily\u914D\u7F6E\u9879"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-config"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-label"
      }, "\u6267\u884C\u6253\u70B9\u4EFB\u52A1"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Switch, {
        className: "task-config-value",
        checked: isSpm,
        onChange: function onChange(val) {
          return _this2.changeValue('isSpm', val);
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-textarea-label"
      }, "commit\u4FE1\u606F"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Input.TextArea, {
        placeholder: "\u8BF7\u8F93\u5165commit\u4FE1\u606F",
        style: {
          width: '600px'
        },
        value: commitMsg,
        onChange: function onChange(val) {
          return _this2.changeValue('commitMsg', val);
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-btn"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
        disabled: status == 1,
        onClick: function onClick() {
          return _this2.exec();
        }
      }, "\u53D1\u5E03\u5230daily")));
    }
  }]);

  return Daily;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Daily);

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

/***/ }),

/***/ "./web/pageComponent/dev.js":
/*!**********************************!*
  !*** ./web/pageComponent/dev.js ***!
  \**********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/api */ "./web/utils/api.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
* Copyright(c) Alibaba Group Holding Limited.
*
* Authors:
*    昕雅 <yajun.wyj>
*/



var Tooltip = _alifd_next__WEBPACK_IMPORTED_MODULE_1__.Balloon.Tooltip; // const curdir = window.RMX.project.dir

var Dev = /*#__PURE__*/function (_React$Component) {
  _inherits(Dev, _React$Component);

  var _super = _createSuper(Dev);

  function Dev(props) {
    var _this;

    _classCallCheck(this, Dev);

    _this = _super.call(this, props);
    _this.state = {
      appPath: window.RMX.project.dir,
      port: '',
      ip: '',
      isHmr: true,
      isHttps: false,
      isDebug: false,
      isDocs: true,
      isDesiger: true,
      ipList: []
    };
    return _this;
  }

  _createClass(Dev, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      (0,_utils_api__WEBPACK_IMPORTED_MODULE_2__.get)('/extra/magix/config', {
        cwd: this.state.appPath
      }).then(function (res) {
        if (res) {
          var ipConfig = res.ipConfig || {};
          var ipList = [];

          for (var key in ipConfig) {
            ipList.push({
              label: key,
              value: ipConfig[key]
            });
          }

          _this2.setState({
            port: res.matPort || '',
            ipList: ipList
          });
        }
      });
    }
  }, {
    key: "exec",
    value: function exec() {
      var _this$state = this.state,
          port = _this$state.port,
          ip = _this$state.ip,
          isHmr = _this$state.isHmr,
          isHttps = _this$state.isHttps,
          isDebug = _this$state.isDebug,
          isDocs = _this$state.isDocs,
          isDesiger = _this$state.isDesiger;
      this.props.emit('dev', 'magixDev', {
        cwd: this.state.appPath,
        port: port,
        ip: ip,
        isCloseHmr: !isHmr,
        isHttps: isHttps,
        isDebug: isDebug,
        isCloseDocs: !isDocs,
        isCloseDesiger: !isDesiger
      });
    }
  }, {
    key: "stopExec",
    value: function stopExec() {
      this.props.emit('dev', 'magixDev', {
        cwd: this.state.appPath
      });
    }
  }, {
    key: "changeValue",
    value: function changeValue(key, val) {
      if (key === 'port' && !/^[0-9]*$/.test(val)) {
        return;
      }

      this.setState(_defineProperty({}, key, val));
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      // 0 代表停止
      // 1 代表运行
      var status = this.props.status;
      var _this$state2 = this.state,
          port = _this$state2.port,
          ip = _this$state2.ip,
          isHmr = _this$state2.isHmr,
          isHttps = _this$state2.isHttps,
          isDebug = _this$state2.isDebug,
          isDocs = _this$state2.isDocs,
          isDesiger = _this$state2.isDesiger,
          ipList = _this$state2.ipList,
          log = _this$state2.log;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-detail"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-head"
      }, "\u5F00\u542F\u4E4B\u524D\uFF0C\u8BF7\u586B\u5199dev\u914D\u7F6E\u9879"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-config"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-label"
      }, "\u7AEF\u53E3\u53F7"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Input, {
        className: "task-config-value",
        value: port,
        onChange: function onChange(val) {
          return _this3.changeValue('port', val);
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-label"
      }, "ip\u5730\u5740 ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Tooltip, {
        trigger: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Icon, {
          size: "xs",
          type: "help"
        }),
        align: "t"
      }, "\u5BF9\u63A5\u771F\u5B9E\u63A5\u53E3\u65F6\u7684ip\u5730\u5740\uFF0C\u683C\u5F0F\u4E3A \"ip\" \u6216\u8005 \"ip,\u57DF\u540D\" \uFF0C\u9ED8\u8BA4\u5BF9\u63A5RAP\u65F6\u65E0\u6B64\u503C")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Select, {
        className: "task-config-value",
        style: {
          width: '200px'
        },
        value: ip,
        dataSource: ipList,
        onChange: function onChange(val) {
          return _this3.changeValue('ip', val);
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-tips"
      }, "ip\u4E3A\u7A7A\u65F6\uFF0C\u8868\u793A\u8D70rap"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-label"
      }, "HMR\u70ED\u66F4\u65B0"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Switch, {
        className: "task-config-value",
        checked: isHmr,
        onChange: function onChange(val) {
          return _this3.changeValue('isHmr', val);
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-label"
      }, "\u53CD\u5411\u4EE3\u7406https"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Switch, {
        className: "task-config-value",
        checked: isHttps,
        onChange: function onChange(val) {
          return _this3.changeValue('isHttps', val);
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-label"
      }, "debug\u6A21\u5F0F ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Tooltip, {
        trigger: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Icon, {
          size: "xs",
          type: "help"
        }),
        align: "t"
      }, "\u5F00\u542Fdebug\u6A21\u5F0F\u4F1A\u6821\u9A8Crap\u63A5\u53E3\u7B49")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Switch, {
        className: "task-config-value",
        checked: isDebug,
        onChange: function onChange(val) {
          return _this3.changeValue('isDebug', val);
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-label"
      }, "\u5E2E\u52A9\u6587\u6863\u63D0\u793A"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Switch, {
        className: "task-config-value",
        checked: isDocs,
        onChange: function onChange(val) {
          return _this3.changeValue('isDocs', val);
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-label"
      }, "magix-desiger"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Switch, {
        className: "task-config-value",
        checked: isDesiger,
        onChange: function onChange(val) {
          return _this3.changeValue('isDesiger', val);
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-btn"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
        disabled: status == 1,
        className: "_mr10",
        onClick: function onClick() {
          return _this3.exec();
        }
      }, "\u5F00\u542Fdev"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
        disabled: status == 0,
        onClick: function onClick() {
          return _this3.stopExec();
        }
      }, "\u7ED3\u675Fdev")));
    }
  }]);

  return Dev;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dev);

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

/***/ }),

/***/ "./web/pageComponent/gallery.js":
/*!**************************************!*
  !*** ./web/pageComponent/gallery.js ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/api */ "./web/utils/api.js");
/* harmony import */ var _component_toast_toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component/toast/toast */ "./web/component/toast/toast.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var curdir = window.RMX.project.dir;

var Gallery = /*#__PURE__*/function (_React$Component) {
  _inherits(Gallery, _React$Component);

  var _super = _createSuper(Gallery);

  function Gallery(props) {
    var _this;

    _classCallCheck(this, Gallery);

    _this = _super.call(this, props);
    _this.state = {
      name: '',
      list: [],
      canClick: false,
      loading: false
    };
    return _this;
  }

  _createClass(Gallery, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      (0,_utils_api__WEBPACK_IMPORTED_MODULE_2__.get)('/extra/magix/list/gallery', {
        cwd: curdir
      }).then(function (res) {
        if (res && res.length > 0) {
          var list = [];

          for (var i = 0; i < res.length; i++) {
            if (res[i].list && res[i].list.length > 0) {
              for (var j = 0; j < res[i].list.length; j++) {
                list.push({
                  repoName: res[i].repoName,
                  path: res[i].path,
                  label: res[i].repoName + ': ' + res[i].list[j].name,
                  name: res[i].list[j].name,
                  value: res[i].list[j].name,
                  version: res[i].list[j].version
                });
              }
            }
          }

          _this2.setState({
            list: list
          });
        }
      });
    }
  }, {
    key: "changeValue",
    value: function changeValue(key, val) {
      this.setState(_defineProperty({}, key, val));
    }
  }, {
    key: "exec",
    value: function exec() {
      var name = this.state.name;
      this.props.emit('gallery', 'magixGallery', {
        cwd: curdir,
        name: name
      });
    }
  }, {
    key: "check",
    value: function check() {
      var _this3 = this;

      var name = this.state.name;
      this.setState({
        loading: true
      }); // this.props.emit('gallery', 'magixCheckGallery', {
      //   cwd: curdir,
      //   name
      // })

      (0,_utils_api__WEBPACK_IMPORTED_MODULE_2__.post)('/extra/magix/check/gallery', {
        cwd: curdir,
        name: name
      }).then(function (res) {
        _this3.setState({
          loading: false
        });

        if (res && res.length > 0) {
          var list = [];

          for (var i = 0; i < res.length; i++) {
            if (res[i].modifyFiles && res[i].modifyFiles.length > 0) {
              for (var j = 0; j < res[i].modifyFiles.length; j++) {
                list.push({
                  galleryName: res[i].galleryName,
                  name: res[i].modifyFiles[j].filePath,
                  status: res[i].modifyFiles[j].type
                });
              }
            }
          }

          _this3.showDiffGallery(list);
        } else {
          _this3.exec();
        }
      });
    }
  }, {
    key: "showDiffGallery",
    value: function showDiffGallery(data) {
      var me = this;
      var dialog = _alifd_next__WEBPACK_IMPORTED_MODULE_1__.Dialog.show({
        title: '更新过的组件',
        content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table, {
          dataSource: data,
          style: {
            width: 600
          }
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table.Column, {
          title: "\u7EC4\u4EF6\u540D",
          dataIndex: "galleryName"
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table.Column, {
          title: "\u8DEF\u5F84",
          dataIndex: "name"
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table.Column, {
          title: "\u72B6\u6001",
          dataIndex: "status"
        })),
        footer: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
          type: "primary",
          className: "_mr10",
          onClick: function onClick() {
            dialog.hide();
            me.exec();
          }
        }, "\u786E\u5B9A"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
          onClick: function onClick() {
            dialog.hide();
          }
        }, "\u53D6\u6D88"))
      });
    }
  }, {
    key: "showList",
    value: function showList() {
      var list = this.state.list;
      var dialog = _alifd_next__WEBPACK_IMPORTED_MODULE_1__.Dialog.show({
        title: '本地所有组件列表',
        content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table, {
          dataSource: list,
          style: {
            width: 600
          }
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table.Column, {
          title: "\u7EC4\u4EF6\u540D",
          dataIndex: "name"
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table.Column, {
          title: "\u7248\u672C",
          dataIndex: "version"
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table.Column, {
          title: "\u7EC4\u4EF6\u5E93\u540D",
          dataIndex: "repoName"
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table.Column, {
          title: "\u5B89\u88C5\u8DEF\u5F84",
          dataIndex: "path"
        })),
        footer: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
          onClick: function onClick() {
            dialog.hide();
          }
        }, "\u786E\u5B9A")
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      // 0 代表停止
      // 1 代表运行
      var status = this.props.status;
      var _this$state = this.state,
          name = _this$state.name,
          list = _this$state.list,
          loading = _this$state.loading;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-detail"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Loading, {
        visible: loading,
        fullScreen: true,
        shape: "fusion-reactor"
      }, list.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "warning-list"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "warning-link",
        onClick: function onClick() {
          _this4.showList();
        }
      }, "\u70B9\u51FB\u67E5\u770B\u672C\u5730\u6240\u6709\u7EC4\u4EF6\u5217\u8868")) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-head"
      }, "\u540C\u6B65gallery\u7EC4\u4EF6\u5230\u9879\u76EE\u4E2D"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-config"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-label"
      }, "\u7EC4\u4EF6"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Input, {
        className: "task-config-value",
        style: {
          width: '200px'
        },
        value: name,
        onChange: function onChange(val) {
          return _this4.changeValue('name', val);
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-tips"
      }, "\u5982\u679C\u4E0D\u586B\u5219\u662F\u5168\u91CF\u540C\u6B65")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-btn"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
        className: "_mr10",
        onClick: function onClick() {
          return _this4.check();
        }
      }, "\u6267\u884C"))));
    }
  }]);

  return Gallery;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gallery);

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

/***/ }),

/***/ "./web/pageComponent/iconfont.js":
/*!***************************************!*
  !*** ./web/pageComponent/iconfont.js ***!
  \***************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/api */ "./web/utils/api.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var curdir = window.RMX.project.dir;

var Iconfont = /*#__PURE__*/function (_React$Component) {
  _inherits(Iconfont, _React$Component);

  var _super = _createSuper(Iconfont);

  function Iconfont(props) {
    var _this;

    _classCallCheck(this, Iconfont);

    _this = _super.call(this, props);
    _this.state = {
      canClick: false,
      errorTip: ''
    };
    return _this;
  }

  _createClass(Iconfont, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      (0,_utils_api__WEBPACK_IMPORTED_MODULE_2__.get)('/extra/magix/config', {
        cwd: curdir
      }).then(function (res) {
        if (res) {
          var errorTip = '';

          if (!res.iconfontId) {
            errorTip = '还未配置iconfontId';
          } else if (!res.iconfontPath) {
            errorTip = '还未配置iconfontPath';
          }

          _this2.setState({
            canClick: res.iconfontId && res.iconfontPath,
            errorTip: errorTip
          });
        }
      });
    }
  }, {
    key: "exec",
    value: function exec() {
      this.props.emit('iconfont', 'magixIconfont', {
        cwd: curdir
      });
    }
  }, {
    key: "check",
    value: function check() {
      this.props.emit('iconfont', 'magixCheckIconfont', {
        cwd: curdir
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      // 0 代表停止
      // 1 代表运行
      var status = this.props.status;
      var _this$state = this.state,
          canClick = _this$state.canClick,
          errorTip = _this$state.errorTip;

      if (status == 1) {
        this.hasCheckOk = true;
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-detail"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-head"
      }, "\u540C\u6B65iconfont\u4E0A\u7684\u56FE\u6807\u5230\u9879\u76EE\u4E2D"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-btn"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
        className: "_mr10",
        disabled: !canClick || status == 1,
        onClick: function onClick() {
          return _this3.check();
        }
      }, "\u68C0\u6D4B"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
        disabled: !canClick || status == 1 || !this.hasCheckOk,
        onClick: function onClick() {
          return _this3.exec();
        }
      }, "\u5F00\u59CB\u540C\u6B65"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "action-error"
      }, errorTip)));
    }
  }]);

  return Iconfont;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Iconfont);

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

/***/ }),

/***/ "./web/pageComponent/models.js":
/*!*************************************!*
  !*** ./web/pageComponent/models.js ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/api */ "./web/utils/api.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
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

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
* Copyright(c) Alibaba Group Holding Limited.
*
* Authors:
*    昕雅 <yajun.wyj>
*/



var curdir = window.RMX.project.dir;

var Models = /*#__PURE__*/function (_React$Component) {
  _inherits(Models, _React$Component);

  var _super = _createSuper(Models);

  function Models(props) {
    var _this;

    _classCallCheck(this, Models);

    _this = _super.call(this, props);

    _this.handleCommand = function () {
      var noMatchAPis = _this.state.noMatchAPis;

      var me = _assertThisInitialized(_this);

      if (noMatchAPis.length > 0) {
        var dailog = _alifd_next__WEBPACK_IMPORTED_MODULE_1__.Dialog.confirm({
          title: '提醒',
          content: 'RAP上有接口被删除或修改，确定要同步',
          onOk: function onOk() {
            dailog.hide();
            me.exec();
            me.setState({
              noMatchAPis: []
            });
          },
          onCancel: function onCancel() {
            dailog.hide();
          }
        });
      } else {
        me.exec();
      }
    };

    _this.state = {
      models: [],
      repeatApis: [],
      originModels: [],
      noMatchAPis: [],
      canClick: false,
      errorTip: ''
    };
    return _this;
  }

  _createClass(Models, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      (0,_utils_api__WEBPACK_IMPORTED_MODULE_2__.get)('/extra/magix/config', {
        cwd: curdir
      }).then(function (res) {
        if (res && res.rapProjectId) {
          _this2.checkModels();
        } else {
          _this2.setState({
            errorTip: '还未配置rapProjectId'
          });
        }
      });
    }
  }, {
    key: "checkModels",
    value: function checkModels() {
      var _this3 = this;

      (0,_utils_api__WEBPACK_IMPORTED_MODULE_2__.post)('/extra/magix/check/models', {
        cwd: curdir
      }).then(function (res) {
        if (res && res.data) {
          var canClick = res.data.noMatchAPis && res.data.noMatchAPis.length > 0;

          _this3.setState({
            models: res.data.models || [],
            repeatApis: res.data.repeatApis || [],
            originModels: res.data.originModels || [],
            noMatchAPis: res.data.noMatchAPis || [],
            canClick: true,
            errorTip: canClick ? '' : '本地跟RAP上的接口一致，无需同步'
          });
        }
      });
    }
  }, {
    key: "exec",
    value: function exec() {
      var _this$state = this.state,
          models = _this$state.models,
          repeatApis = _this$state.repeatApis,
          originModels = _this$state.originModels;
      this.props.emit('models', 'magixModels', {
        cwd: curdir,
        models: models,
        repeatApis: repeatApis,
        originModels: originModels
      });
    }
  }, {
    key: "showNoMatch",
    value: function showNoMatch() {
      var noMatchAPis = this.state.noMatchAPis;
      var dialog = _alifd_next__WEBPACK_IMPORTED_MODULE_1__.Dialog.show({
        title: 'RAP上被删除或修改过的接口',
        content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table, {
          dataSource: noMatchAPis,
          style: {
            width: 600
          }
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table.Column, {
          title: "api\u540D\u79F0",
          dataIndex: "name"
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table.Column, {
          title: "\u65B9\u6CD5\u540D",
          dataIndex: "method"
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Table.Column, {
          title: "\u63A5\u53E3\u5730\u5740",
          dataIndex: "url"
        })),
        footer: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
          onClick: function onClick() {
            dialog.hide();
          }
        }, "\u786E\u5B9A")
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      // 0 代表停止
      // 1 代表运行
      var status = this.props.status;
      var _this$state2 = this.state,
          noMatchAPis = _this$state2.noMatchAPis,
          canClick = _this$state2.canClick,
          errorTip = _this$state2.errorTip;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-detail"
      }, noMatchAPis.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "warning-list"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "warning-link",
        onClick: function onClick() {
          _this4.showNoMatch();
        }
      }, "\u70B9\u51FB\u67E5\u770BRAP\u4E0A\u88AB\u5220\u9664\u6216\u4FEE\u6539\u8FC7\u7684\u63A5\u53E3")) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-head"
      }, "\u540C\u6B65RAP\u4E0A\u7684\u63A5\u53E3\u914D\u7F6E\u5230\u9879\u76EE\u4E2D"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-btn"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
        disabled: !canClick || status == 1,
        onClick: function onClick() {
          return _this4.handleCommand();
        }
      }, "\u5F00\u59CB\u540C\u6B65")));
    }
  }]);

  return Models;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Models);

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

/***/ }),

/***/ "./web/pageComponent/publish.js":
/*!**************************************!*
  !*** ./web/pageComponent/publish.js ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/api */ "./web/utils/api.js");
/* harmony import */ var _component_toast_toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component/toast/toast */ "./web/component/toast/toast.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var curProject = window.RMX.project;

var Publish = /*#__PURE__*/function (_React$Component) {
  _inherits(Publish, _React$Component);

  var _super = _createSuper(Publish);

  function Publish(props) {
    var _this;

    _classCallCheck(this, Publish);

    _this = _super.call(this, props);
    _this.state = {
      isSpm: true,
      commitMsg: '',
      international: false
    };
    return _this;
  }

  _createClass(Publish, [{
    key: "changeValue",
    value: function changeValue(key, val) {
      this.setState(_defineProperty({}, key, val));
    }
  }, {
    key: "exec",
    value: function exec() {
      var _this$state = this.state,
          isSpm = _this$state.isSpm,
          commitMsg = _this$state.commitMsg,
          international = _this$state.international;

      if (!commitMsg) {
        _component_toast_toast__WEBPACK_IMPORTED_MODULE_3__.default.show('请先填写提交信息', 'warning');
        return;
      }

      this.props.emit('publish', 'magixPublish', {
        cwd: curProject.dir,
        branch: curProject.branch,
        message: commitMsg,
        international: international,
        nospm: !isSpm,
        uncheck: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      // 0 代表停止
      // 1 代表运行
      var status = this.props.status;
      var _this$state2 = this.state,
          isSpm = _this$state2.isSpm,
          commitMsg = _this$state2.commitMsg,
          international = _this$state2.international;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-detail"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-head"
      }, "\u5F00\u542F\u4E4B\u524D\uFF0C\u8BF7\u586B\u5199publish\u914D\u7F6E\u9879"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-config"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-label"
      }, "\u53D1\u5E03\u524D\u6267\u884Cspm\u6253\u70B9"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Switch, {
        className: "task-config-value",
        checked: isSpm,
        onChange: function onChange(val) {
          return _this2.changeValue('isSpm', val);
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-label"
      }, "\u540C\u65F6\u53D1\u5E03\u5230\u56FD\u9645\u7248cdn"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Switch, {
        className: "task-config-value",
        checked: international,
        onChange: function onChange(val) {
          return _this2.changeValue('international', val);
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "task-config-textarea-label"
      }, "\u63D0\u4EA4\u4EE3\u7801\u7684commit\u4FE1\u606F"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Input.TextArea, {
        placeholder: "\u8BF7\u8F93\u5165commit\u4FE1\u606F",
        style: {
          width: '600px'
        },
        value: commitMsg,
        onChange: function onChange(val) {
          return _this2.changeValue('commitMsg', val);
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-btn"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
        disabled: status == 1,
        onClick: function onClick() {
          return _this2.exec();
        }
      }, "\u53D1\u5E03")));
    }
  }]);

  return Publish;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Publish);

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

/***/ }),

/***/ "./web/pageComponent/spmlog.js":
/*!*************************************!*
  !*** ./web/pageComponent/spmlog.js ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/api */ "./web/utils/api.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var curdir = window.RMX.project.dir;

var Spmlog = /*#__PURE__*/function (_React$Component) {
  _inherits(Spmlog, _React$Component);

  var _super = _createSuper(Spmlog);

  function Spmlog(props) {
    var _this;

    _classCallCheck(this, Spmlog);

    _this = _super.call(this, props);
    _this.state = {
      removeSpm: false,
      canClick: false,
      errorTip: ''
    };
    return _this;
  }

  _createClass(Spmlog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      (0,_utils_api__WEBPACK_IMPORTED_MODULE_2__.get)('/extra/magix/config', {
        cwd: curdir
      }).then(function (res) {
        if (res) {
          _this2.setState({
            canClick: !!res.spma,
            errorTip: res.spma ? '' : '还未配置spma'
          });
        }
      });
    }
  }, {
    key: "changeValue",
    value: function changeValue(key, val) {
      this.setState(_defineProperty({}, key, val));
    }
  }, {
    key: "exec",
    value: function exec(removeSpm) {
      this.props.emit('spmlog', 'magixSpmlog', {
        cwd: curdir,
        removeSpm: removeSpm
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      // 0 代表停止
      // 1 代表运行
      var status = this.props.status;
      var _this$state = this.state,
          removeSpm = _this$state.removeSpm,
          canClick = _this$state.canClick,
          errorTip = _this$state.errorTip;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "task-detail"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-head"
      }, "\u8FFD\u52A0spm\u6253\u70B9\uFF0C\u540C\u65F6\u540C\u6B65\u6570\u636E\u5C0F\u7AD9\u6570\u636E\u914D\u7F6E"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "action-btn"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
        className: "_mr10",
        disabled: !canClick || status == 1,
        onClick: function onClick() {
          return _this3.exec(false);
        }
      }, "\u6253\u70B9"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_1__.Button, {
        disabled: !canClick || status == 1,
        onClick: function onClick() {
          return _this3.exec(true);
        }
      }, "\u6E05\u7A7A\u6253\u70B9"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "action-error"
      }, errorTip)));
    }
  }]);

  return Spmlog;
}((react__WEBPACK_IMPORTED_MODULE_0___default().Component));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Spmlog);

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

/***/ }),

/***/ "./web/utils/api.js":
/*!**************************!*
  !*** ./web/utils/api.js ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fetch": () => /* binding */ Fetch,
/* harmony export */   "get": () => /* binding */ get,
/* harmony export */   "post": () => /* binding */ post,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var whatwg_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! whatwg-fetch */ "./node_modules/whatwg-fetch/fetch.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./url */ "./web/utils/url.js");
/* harmony import */ var _component_toast_toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component/toast/toast */ "./web/component/toast/toast.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);





function Fetch(url, options) {
  return fetch(url, Object.assign({}, {
    credentials: 'same-origin'
  }, options)).then(function (resp) {
    return resp.json();
  }).then(function (json) {
    if (!json.success) {
      _component_toast_toast__WEBPACK_IMPORTED_MODULE_3__.default.show(json.message || '系统错误');
    } else {
      if (json.data === void 0 || json.data === null) {
        json.data = json.data || {};
      }

      return json.data;
    }
  })["catch"](function (e) {
    _component_toast_toast__WEBPACK_IMPORTED_MODULE_3__.default.show(e.message);
  });
}
_c = Fetch;
function get(url, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var paramsStr = (0,_url__WEBPACK_IMPORTED_MODULE_2__.joinParams)(data);
  paramsStr = paramsStr ? "?".concat(paramsStr) : '';
  return Fetch("".concat(url).concat(paramsStr), options);
}
function post(url, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // const formData = new FormData();
  // for(let i in data){
  //   if(typeof data[i] === 'object'){
  //     formData.append(i, JSON.stringify(data[i]))
  //   }else{
  //     formData.append(i, data[i])
  //   }
  // }
  // return Fetch(url, {
  //   method: 'POST',
  //   body: formData
  // })
  var formData = {};

  for (var i in data) {
    if (data[i] !== void 0) {
      formData[i] = data[i];
    }
  }

  return Fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    // body: formData
    body: JSON.stringify(formData)
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Fetch);

var _c;

__webpack_require__.$Refresh$.register(_c, "Fetch");

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

/***/ }),

/***/ "./web/utils/url.js":
/*!**************************!*
  !*** ./web/utils/url.js ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parseParams": () => /* binding */ parseParams,
/* harmony export */   "joinParams": () => /* binding */ joinParams,
/* harmony export */   "joinParamsToUrl": () => /* binding */ joinParamsToUrl
/* harmony export */ });
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

// 多个pid默认取第一个
function parseParams(str) {
  var p = {};

  if (str) {
    for (var i = 0, s, d = str.split(/&+/), len = d.length; i < len; i++) {
      s = d[i];

      if (s) {
        var k, v;

        try {
          k = decodeURIComponent(s.replace(/=.*/, ""));
          v = decodeURIComponent(s.replace(/(.*?=)|(.*)/, ""));
        } catch (e) {
          k = "";
          v = "";
        }

        if (k || v) {
          if (k in p) {
            if (typeof p[k] === "string") p[k] = [p[k]];
            p[k].push(v);
          } else {
            p[k] = v;
          }
        }
      }
    }
  }

  return p;
}
function joinParams(obj) {
  var res = [],
      s = function s(k, v) {
    k = encodeURIComponent(k);
    v = encodeURIComponent(v);

    if (k || v) {
      res.push(k + (v === undefined ? "" : "=" + v));
    }
  };

  for (var k in obj) {
    var v = obj[k];

    if (v && v.constructor === Array) {
      for (var i = 0, len = v.length; i < len; i++) {
        s(k, v[i]);
      }
    } else {
      s(k, v);
    }
  }

  return res.join("&");
}
function joinParamsToUrl(obj) {
  var res = [],
      s = function s(k, v) {
    k = encodeURIComponent(k);
    v = encodeURIComponent(v);

    if (k || v) {
      res.push(k + (v === undefined ? "" : "=" + v));
    }
  };

  for (var k in obj) {
    var v = obj[k];

    if (v && v.constructor === Array) {
      s(k, v.join(','));
    } else {
      s(k, v);
    }
  }

  return res.join("&");
} // /*
// * 添加query string
// * @param {Object} opt
// * @param {Object} opt.data
// * @param {String} opt.url 默认为location.href
// * @param {Boolean} opt.ignoreEmpty 如果待添加的值为空是否忽略，默认为true
// * @example
// * Util.addQueryStr({
// *     data: {
// *         a: 1,
// *         b: 2
// *     },
// *     ignoreEmpty: true
// * })
// */
// Util.addQueryStr = function(opt) {
//   opt = opt || {};
//   var data = opt.data || {},
//     url = opt.url || location.href,
//     ignoreEmpty = typeof opt.ignoreEmpty == "boolean" ? opt.ignoreEmpty : true,
//     hasSearch = url.match(/\?/);
//   for (var key in data) {
//     var val = data[key],
//       str = "",
//       match = null,
//       reg = new RegExp("[?&#]((" + key + "=)[^&#]*)[&#]?", "i");
//     //ignoreEmpty为true时， 若val为空则跳过
//     if (ignoreEmpty && !val) {
//       continue;
//     }
//     str = key + "=" + val;
//     match = url.match(reg);
//     if (match) {
//       url = url.replace(match[1], str);
//     } else {
//       if (hasSearch) {
//         url += "&" + str;
//       } else {
//         url += "?" + str;
//         hasSearch = true;
//       }
//     }
//   }
//   return url;
// };
// /*
// * @param {Object} opt
// * @param {Array} opt.data 待删除的query参数
// * @param {String} opt.url 默认为location.href
// * @example
// * Util.deleteQueryStr({
// *     url: 'https://mo.m.etao.com/test?id=111&spm=1002.10.11.1&a=222&c=12',
// *     data: ['spm', 'a']
// * })
// * => https://mo.m.etao.com/test?id=111&c=12
// */
// Util.deleteQueryStr = function(opt) {
//   opt = opt || {};
//   var data = opt.data || [],
//     url = opt.url || location.href;
//   data.forEach(function(key, index) {
//     if (!key) {
//       return;
//     }
//     var match = null,
//       reg = new RegExp("[?&#](" + key + "=[^&#]*[&]?)", "i");
//     match = url.match(reg);
//     if (match) {
//       url = url.replace(match[1], "");
//     }
//   });
//   return url;
// };

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

/***/ }),

/***/ "./web/widgets.js":
/*!************************!*
  !*** ./web/widgets.js ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _pageComponent_daily__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pageComponent/daily */ "./web/pageComponent/daily.js");
/* harmony import */ var _pageComponent_dev__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pageComponent/dev */ "./web/pageComponent/dev.js");
/* harmony import */ var _pageComponent_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pageComponent/models */ "./web/pageComponent/models.js");
/* harmony import */ var _pageComponent_iconfont__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pageComponent/iconfont */ "./web/pageComponent/iconfont.js");
/* harmony import */ var _pageComponent_spmlog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pageComponent/spmlog */ "./web/pageComponent/spmlog.js");
/* harmony import */ var _pageComponent_chartpark__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pageComponent/chartpark */ "./web/pageComponent/chartpark.jsx");
/* harmony import */ var _pageComponent_gallery__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pageComponent/gallery */ "./web/pageComponent/gallery.js");
/* harmony import */ var _pageComponent_publish__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pageComponent/publish */ "./web/pageComponent/publish.js");
/* harmony import */ var _pageComponent_cliConfig__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pageComponent/cliConfig */ "./web/pageComponent/cliConfig.jsx");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../mm-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../mm-scripts/node_modules/react-refresh/runtime.js */ "../mm-scripts/node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);



 // import WebTestCommand from './pageComponent/test'
// import Iconfont from './pageComponent/iconfont'
// import Spmlog from './pageComponent/spmlog'
// import Chartpark from './pageComponent/chartpark'
// import Gallery from './pageComponent/gallery'
// import Publish from './pageComponent/publish'







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([{
  type: 'app.nav',
  name: 'cliconfig',
  component: _pageComponent_cliConfig__WEBPACK_IMPORTED_MODULE_8__.default,
  title: '应用配置'
}, {
  type: 'app.task',
  name: 'dev',
  component: _pageComponent_dev__WEBPACK_IMPORTED_MODULE_1__.default,
  title: '本地开发'
}, {
  type: 'app.task',
  name: 'models',
  component: _pageComponent_models__WEBPACK_IMPORTED_MODULE_2__.default,
  title: '同步 RAP'
}, {
  type: 'app.task',
  name: 'iconfont',
  component: _pageComponent_iconfont__WEBPACK_IMPORTED_MODULE_3__.default,
  title: '同步 Iconfont'
}, {
  type: 'app.task',
  name: 'chartpark',
  component: _pageComponent_chartpark__WEBPACK_IMPORTED_MODULE_5__.default,
  title: '同步 Charkpark'
}, {
  type: 'app.task',
  name: 'gallery',
  component: _pageComponent_gallery__WEBPACK_IMPORTED_MODULE_6__.default,
  title: '同步 Gallery 组件'
}, {
  type: 'app.task',
  name: 'spmlog',
  component: _pageComponent_spmlog__WEBPACK_IMPORTED_MODULE_4__.default,
  title: '打点 spmlog'
}, {
  type: 'app.task',
  name: 'daily',
  component: _pageComponent_daily__WEBPACK_IMPORTED_MODULE_0__.default,
  title: '日常部署'
}, {
  type: 'app.task',
  name: 'publish',
  component: _pageComponent_publish__WEBPACK_IMPORTED_MODULE_7__.default,
  title: '正式部署'
}]); // webui.register({
//   path:'app.task',
//   component : WebTestCommand,
//   name: 'test',
//   title: 'test Socket'
// })

/**
 * MO 注册动作不应该放到套件、插件中。
 * 这里应该返回 UI 插件配置。
 */

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

/***/ }),

/***/ "../mm-scripts/node_modules/css-loader/dist/cjs.js!./web/component/toast/toast.css":
/*!*****************************************************************************************!*
  !*** ../mm-scripts/node_modules/css-loader/dist/cjs.js!./web/component/toast/toast.css ***!
  \*****************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _mm_scripts_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../mm-scripts/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../mm-scripts/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _mm_scripts_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_mm_scripts_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mm_scripts_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../mm-scripts/node_modules/css-loader/dist/runtime/api.js */ "../mm-scripts/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _mm_scripts_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_mm_scripts_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _mm_scripts_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_mm_scripts_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".global-toast {\n  margin: 5px 0;\n}\n.global-toast .next-notice.next-notice-warning.next-notice-standalone {\n  border-width: 1px;\n  padding: 8px;\n}\n.global-toast .message-body {\n  max-width: 400px;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  margin: 0;\n}", "",{"version":3,"sources":["webpack://./web/component/toast/toast.css"],"names":[],"mappings":"AAAA;EACE,aAAa;AACf;AACA;EACE,iBAAiB;EACjB,YAAY;AACd;AACA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,gBAAgB;EAChB,SAAS;AACX","sourcesContent":[".global-toast {\n  margin: 5px 0;\n}\n.global-toast .next-notice.next-notice-warning.next-notice-standalone {\n  border-width: 1px;\n  padding: 8px;\n}\n.global-toast .message-body {\n  max-width: 400px;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  margin: 0;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./web/component/toast/toast.css":
/*!***************************************!*
  !*** ./web/component/toast/toast.css ***!
  \***************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _mm_scripts_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../mm-scripts/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../mm-scripts/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _mm_scripts_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_mm_scripts_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mm_scripts_node_modules_css_loader_dist_cjs_js_toast_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../mm-scripts/node_modules/css-loader/dist/cjs.js!./toast.css */ "../mm-scripts/node_modules/css-loader/dist/cjs.js!./web/component/toast/toast.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _mm_scripts_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_mm_scripts_node_modules_css_loader_dist_cjs_js_toast_css__WEBPACK_IMPORTED_MODULE_1__.default, options);


if (true) {
  if (!_mm_scripts_node_modules_css_loader_dist_cjs_js_toast_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }

  var p;

  for (p in a) {
    if (isNamedExport && p === 'default') {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (a[p] !== b[p]) {
      return false;
    }
  }

  for (p in b) {
    if (isNamedExport && p === 'default') {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (!a[p]) {
      return false;
    }
  }

  return true;
};
    var oldLocals = _mm_scripts_node_modules_css_loader_dist_cjs_js_toast_css__WEBPACK_IMPORTED_MODULE_1__.default.locals;

    module.hot.accept(
      /*! !!../../../../mm-scripts/node_modules/css-loader/dist/cjs.js!./toast.css */ "../mm-scripts/node_modules/css-loader/dist/cjs.js!./web/component/toast/toast.css",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _mm_scripts_node_modules_css_loader_dist_cjs_js_toast_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../mm-scripts/node_modules/css-loader/dist/cjs.js!./toast.css */ "../mm-scripts/node_modules/css-loader/dist/cjs.js!./web/component/toast/toast.css");
(function () {
        if (!isEqualLocals(oldLocals, _mm_scripts_node_modules_css_loader_dist_cjs_js_toast_css__WEBPACK_IMPORTED_MODULE_1__.default.locals, undefined)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = _mm_scripts_node_modules_css_loader_dist_cjs_js_toast_css__WEBPACK_IMPORTED_MODULE_1__.default.locals;

              update(_mm_scripts_node_modules_css_loader_dist_cjs_js_toast_css__WEBPACK_IMPORTED_MODULE_1__.default);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_mm_scripts_node_modules_css_loader_dist_cjs_js_toast_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ })

}]);
//# sourceMappingURL=web_index_js.js.map