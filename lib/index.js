"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _has = require("lodash/has");

var _has2 = _interopRequireDefault(_has);

var _isEmpty = require("lodash/isEmpty");

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var pending = function pending(type, meta) {
  return {
    type: type,
    payload: null,
    meta: _extends({ isPending: true }, meta)
  };
};

var AxiosFlow = function AxiosFlow(dispatch) {
  var getTokenHeader = function getTokenHeader() {
    var token = localStorage.getItem(AxiosFlow.TOKEN_LABEL) ? localStorage.getItem(AxiosFlow.TOKEN_LABEL) : sessionStorage.getItem(AxiosFlow.TOKEN_LABEL);

    if (token) {
      return { Authorization: "Bearer " + token };
    }
    return null;
  };

  var onSuccess = function onSuccess(type, response, onSuccessCallback, meta, params) {
    var data = response.data,
        headers = response.headers;

    if (typeof AxiosFlow.onSuccessHandler === "function") {
      AxiosFlow.onSuccessHandler(dispatch, response);
    }
    if (type) {
      dispatch({
        type: type,
        payload: data,
        meta: _extends({ headers: headers, isPending: false, params: params }, meta)
      });
    }

    if (typeof onSuccessCallback === "function") {
      onSuccessCallback(response);
    }
  };

  var onError = function onError(type, error, onErrorCallback) {
    if ((0, _has2.default)(error, "response.status") && error.response.status === 401) {
      sessionStorage.removeItem(AxiosFlow.TOKEN_LABEL);
      localStorage.removeItem(AxiosFlow.TOKEN_LABEL);
    }
    if (typeof AxiosFlow.onErrorHandler === "function") {
      AxiosFlow.onErrorHandler(dispatch, error);
    }
    if (type) {
      dispatch({ type: type, error: true });
    }
    if (typeof onErrorCallback === "function") {
      onErrorCallback(error);
    }
  };

  // here
  function Api() {
    var _this = this;

    if (typeof dispatch !== "function") {
      throw Error("Please provide a valid dispatch.");
    }

    var that = this;
    that.config = {};

    // that.instance = _dispatch => new Api(_dispatch);

    Api.prototype.url = function (url) {
      that.config.url = url;
      return that;
    };

    Api.prototype.meta = function (meta) {
      that.config.meta = meta;
      return that;
    };

    Api.prototype.action = function (type) {
      that.config.actionType = type;
      return that;
    };

    Api.prototype.params = function (_params) {
      if (!(0, _isEmpty2.default)(_params)) {
        that.config.params = _params;
      }
      return that;
    };

    Api.prototype.data = function (data) {
      that.config.data = data;
      return that;
    };

    Api.prototype.headers = function (headers) {
      that.config.headers = headers;
      return that;
    };

    Api.prototype.onSuccess = function (onSuccessCallback) {
      that.config.onSuccessCallback = onSuccessCallback;
      return that;
    };

    Api.prototype.onError = function (onErrorCallback) {
      that.config.onErrorCallback = onErrorCallback;
      return that;
    };

    Api.prototype.post = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dispatch(pending(that.config.actionType));
              _context.prev = 1;
              _context.next = 4;
              return _axios2.default.post(that.config.url, that.config.data, {
                headers: _extends({}, getTokenHeader(), that.config.headers),
                params: that.config.params
              });

            case 4:
              response = _context.sent;

              onSuccess(that.config.actionType, response, that.config.onSuccessCallback, that.config.meta, that.config.params);
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);

              onError(that.config.actionType, _context.t0, that.config.onErrorCallback);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this, [[1, 8]]);
    }));

    Api.prototype.get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var response;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (that.config.actionType) {
                dispatch(pending(that.config.actionType, that.config.meta));
              }
              _context2.prev = 1;
              _context2.next = 4;
              return _axios2.default.get(that.config.url, {
                headers: _extends({}, getTokenHeader(), that.config.headers),
                params: that.config.params || null
              });

            case 4:
              response = _context2.sent;

              onSuccess(that.config.actionType, response, that.config.onSuccessCallback, that.config.meta, that.config.params);
              _context2.next = 11;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);

              onError(that.config.actionType, _context2.t0, that.config.onErrorCallback);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, _this, [[1, 8]]);
    }));

    Api.prototype.update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var response;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              dispatch(pending(that.config.actionType));
              _context3.prev = 1;
              _context3.next = 4;
              return _axios2.default.put(that.config.url, that.config.data, {
                headers: _extends({}, getTokenHeader(), that.config.headers),
                params: that.config.params
              });

            case 4:
              response = _context3.sent;

              onSuccess(that.config.actionType, response, that.config.onSuccessCallback, that.config.meta, that.config.params);
              _context3.next = 11;
              break;

            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3["catch"](1);

              onError(that.config.actionType, _context3.t0, that.config.onErrorCallback);

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, _this, [[1, 8]]);
    }));

    Api.prototype.delete = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var response;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              dispatch(pending(that.config.actionType));
              _context4.prev = 1;
              _context4.next = 4;
              return _axios2.default.delete(that.config.url, {
                headers: _extends({}, getTokenHeader(), that.config.headers),
                params: that.config.params || null
              });

            case 4:
              response = _context4.sent;

              onSuccess(that.config.actionType, response, that.config.onSuccessCallback, that.config.meta, that.config.params);
              _context4.next = 11;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](1);

              onError(that.config.actionType, _context4.t0, that.config.onErrorCallback);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, _this, [[1, 8]]);
    }));
  }

  return new Api();
};

AxiosFlow.setTokenLabel = function (token) {
  AxiosFlow.TOKEN_LABEL = token;
  return AxiosFlow;
};

AxiosFlow.setSuccessHandler = function (handler) {
  if (typeof handler === "function") {
    AxiosFlow.successHandler = handler;
  } else {
    throw new Error("successHandler must be a function");
  }
  return AxiosFlow;
};

AxiosFlow.setFailureHandler = function (handler) {
  if (typeof handler === "function") {
    AxiosFlow.failureHandler = handler;
  } else {
    throw new Error("failureHandler must be a function");
  }
  return AxiosFlow;
};

exports.default = AxiosFlow;
//# sourceMappingURL=index.js.map