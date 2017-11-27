'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Source = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _videoReact = require('video-react');

var _styles = require('./styles');

var _styles2 = _interopRequireDefault(_styles);

var _hls = require('hls.js');

var _hls2 = _interopRequireDefault(_hls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// @TODO:
//   1. Brand video player with <Logo>
//   2. Add nice empty state :)

var getSourceType = function getSourceType(src) {
  var types = [['.m3u8', 'application/x-mpegURL'], ['.mov', 'video/quicktime'], ['.mp4', 'video/mp4'], ['.ogm', 'video/ogg'], ['.ogv', 'video/ogg'], ['.ogg', 'video/ogg'], ['.webm', 'video/webm']];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = _slicedToArray(_ref, 2);

      var end = _ref2[0];
      var type = _ref2[1];

      if (src && src.endsWith(end)) return type;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  console.warn('Could not determine type for src "' + src + '"');
  return '';
};

var isHLS = function isHLS(x) {
  return x === 'application/x-mpegURL';
};

var VideoPlayer = function (_Component) {
  _inherits(VideoPlayer, _Component);

  function VideoPlayer() {
    var _ref3;

    var _temp, _this, _ret;

    _classCallCheck(this, VideoPlayer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref3 = VideoPlayer.__proto__ || Object.getPrototypeOf(VideoPlayer)).call.apply(_ref3, [this].concat(args))), _this), _this.componentDidMount = _styles2.default, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(VideoPlayer, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          src = _props.src,
          props = _objectWithoutProperties(_props, ['src']);

      return _react2.default.createElement(
        _videoReact.Player,
        Object.assign({ playsInline: true }, props),
        _react2.default.createElement(_videoReact.BigPlayButton, { position: 'center' }),
        _react2.default.createElement(Source, {
          isVideoChild: true,
          autoPlay: props.autoPlay,
          src: src,
          type: getSourceType(src)
        })
      );
    }
  }]);

  return VideoPlayer;
}(_react.Component);

exports.default = VideoPlayer;

var Source = exports.Source = function (_Component2) {
  _inherits(Source, _Component2);

  function Source() {
    var _ref4;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, Source);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref4 = Source.__proto__ || Object.getPrototypeOf(Source)).call.apply(_ref4, [this].concat(args))), _this2), _this2.updateSource = function () {
      var _this2$props = _this2.props,
          src = _this2$props.src,
          type = _this2$props.type,
          video = _this2$props.video,
          autoPlay = _this2$props.autoPlay;
      // remove old listeners

      if (_this2.hls) {
        _this2.hls.off(_hls2.default.Events.MANIFEST_PARSED, _this2.onManifestParsed);
      }
      _this2.hls = new _hls2.default();
      // load hls video source base on hls.js
      if (isHLS(type) && _hls2.default.isSupported()) {
        _this2.hls.loadSource(src);
        _this2.hls.attachMedia(video);
        _this2.hls.on(_hls2.default.Events.MANIFEST_PARSED, _this2.onManifestParsed);
      }
    }, _this2.onManifestParsed = function () {
      _this2.hls.off(_hls2.default.Events.MANIFEST_PARSED, _this2.onManifestParsed);
      delete _this2.hls;
      if (!_this2.props.autoPlay) return;
      _this2.props.video.play();
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(Source, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateSource();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var a = this.props.src;
      var b = nextProps.src;
      if (a === b) return;
      // if the src changed, update the video player
      this.updateSource();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('source', {
        src: this.props.src,
        type: this.props.type || 'application/x-mpegURL'
      });
    }
  }]);

  return Source;
}(_react.Component);

Source.propTypes = {
  src: _propTypes2.default.string.isRequired,
  type: _propTypes2.default.string,
  video: _propTypes2.default.object
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9WaWRlb1BsYXllci9pbmRleC5qcyJdLCJuYW1lcyI6WyJnZXRTb3VyY2VUeXBlIiwidHlwZXMiLCJlbmQiLCJ0eXBlIiwic3JjIiwiZW5kc1dpdGgiLCJjb25zb2xlIiwid2FybiIsImlzSExTIiwieCIsIlZpZGVvUGxheWVyIiwiY29tcG9uZW50RGlkTW91bnQiLCJwcm9wcyIsImF1dG9QbGF5IiwiU291cmNlIiwidXBkYXRlU291cmNlIiwidmlkZW8iLCJobHMiLCJvZmYiLCJFdmVudHMiLCJNQU5JRkVTVF9QQVJTRUQiLCJvbk1hbmlmZXN0UGFyc2VkIiwiaXNTdXBwb3J0ZWQiLCJsb2FkU291cmNlIiwiYXR0YWNoTWVkaWEiLCJvbiIsInBsYXkiLCJuZXh0UHJvcHMiLCJhIiwiYiIsInByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJvYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBOztBQUVBLElBQU1BLGdCQUFnQixTQUFoQkEsYUFBZ0IsTUFBTztBQUMzQixNQUFNQyxRQUFRLENBQ1osQ0FBQyxPQUFELEVBQVUsdUJBQVYsQ0FEWSxFQUVaLENBQUMsTUFBRCxFQUFTLGlCQUFULENBRlksRUFHWixDQUFDLE1BQUQsRUFBUyxXQUFULENBSFksRUFJWixDQUFDLE1BQUQsRUFBUyxXQUFULENBSlksRUFLWixDQUFDLE1BQUQsRUFBUyxXQUFULENBTFksRUFNWixDQUFDLE1BQUQsRUFBUyxXQUFULENBTlksRUFPWixDQUFDLE9BQUQsRUFBVSxZQUFWLENBUFksQ0FBZDtBQUQyQjtBQUFBO0FBQUE7O0FBQUE7QUFVM0IseUJBQTBCQSxLQUExQiw4SEFBaUM7QUFBQTs7QUFBQTs7QUFBQSxVQUFyQkMsR0FBcUI7QUFBQSxVQUFoQkMsSUFBZ0I7O0FBQy9CLFVBQUlDLE9BQU9BLElBQUlDLFFBQUosQ0FBYUgsR0FBYixDQUFYLEVBQThCLE9BQU9DLElBQVA7QUFDL0I7QUFaMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFhM0JHLFVBQVFDLElBQVIsd0NBQWtESCxHQUFsRDtBQUNBLFNBQU8sRUFBUDtBQUNELENBZkQ7O0FBaUJBLElBQU1JLFFBQVEsU0FBUkEsS0FBUTtBQUFBLFNBQUtDLE1BQU0sdUJBQVg7QUFBQSxDQUFkOztJQUVxQkMsVzs7Ozs7Ozs7Ozs7Ozs7a01BQ25CQyxpQjs7Ozs7NkJBQ1M7QUFBQSxtQkFDbUIsS0FBS0MsS0FEeEI7QUFBQSxVQUNDUixHQURELFVBQ0NBLEdBREQ7QUFBQSxVQUNTUSxLQURUOztBQUVQLGFBQ0U7QUFBQTtBQUFBLHdCQUFRLGlCQUFSLElBQXdCQSxLQUF4QjtBQUNFLG1FQUFlLFVBQVMsUUFBeEIsR0FERjtBQUVFLHNDQUFDLE1BQUQ7QUFDRSw0QkFERjtBQUVFLG9CQUFVQSxNQUFNQyxRQUZsQjtBQUdFLGVBQUtULEdBSFA7QUFJRSxnQkFBTUosY0FBY0ksR0FBZDtBQUpSO0FBRkYsT0FERjtBQVdEOzs7Ozs7a0JBZmtCTSxXOztJQWtCUkksTSxXQUFBQSxNOzs7Ozs7Ozs7Ozs7Ozs2TEFNWEMsWSxHQUFlLFlBQU07QUFBQSx5QkFDb0IsT0FBS0gsS0FEekI7QUFBQSxVQUNYUixHQURXLGdCQUNYQSxHQURXO0FBQUEsVUFDTkQsSUFETSxnQkFDTkEsSUFETTtBQUFBLFVBQ0FhLEtBREEsZ0JBQ0FBLEtBREE7QUFBQSxVQUNPSCxRQURQLGdCQUNPQSxRQURQO0FBRW5COztBQUNBLFVBQUksT0FBS0ksR0FBVCxFQUFjO0FBQ1osZUFBS0EsR0FBTCxDQUFTQyxHQUFULENBQWEsY0FBSUMsTUFBSixDQUFXQyxlQUF4QixFQUF5QyxPQUFLQyxnQkFBOUM7QUFDRDtBQUNELGFBQUtKLEdBQUwsR0FBVyxtQkFBWDtBQUNBO0FBQ0EsVUFBSVQsTUFBTUwsSUFBTixLQUFlLGNBQUltQixXQUFKLEVBQW5CLEVBQXNDO0FBQ3BDLGVBQUtMLEdBQUwsQ0FBU00sVUFBVCxDQUFvQm5CLEdBQXBCO0FBQ0EsZUFBS2EsR0FBTCxDQUFTTyxXQUFULENBQXFCUixLQUFyQjtBQUNBLGVBQUtDLEdBQUwsQ0FBU1EsRUFBVCxDQUFZLGNBQUlOLE1BQUosQ0FBV0MsZUFBdkIsRUFBd0MsT0FBS0MsZ0JBQTdDO0FBQ0Q7QUFDRixLLFNBQ0RBLGdCLEdBQW1CLFlBQU07QUFDdkIsYUFBS0osR0FBTCxDQUFTQyxHQUFULENBQWEsY0FBSUMsTUFBSixDQUFXQyxlQUF4QixFQUF5QyxPQUFLQyxnQkFBOUM7QUFDQSxhQUFPLE9BQUtKLEdBQVo7QUFDQSxVQUFJLENBQUMsT0FBS0wsS0FBTCxDQUFXQyxRQUFoQixFQUEwQjtBQUMxQixhQUFLRCxLQUFMLENBQVdJLEtBQVgsQ0FBaUJVLElBQWpCO0FBQ0QsSzs7Ozs7d0NBQ21CO0FBQ2xCLFdBQUtYLFlBQUw7QUFDRDs7OzhDQUN5QlksUyxFQUFXO0FBQ25DLFVBQU1DLElBQUksS0FBS2hCLEtBQUwsQ0FBV1IsR0FBckI7QUFDQSxVQUFNeUIsSUFBSUYsVUFBVXZCLEdBQXBCO0FBQ0EsVUFBSXdCLE1BQU1DLENBQVYsRUFBYTtBQUNiO0FBQ0EsV0FBS2QsWUFBTDtBQUNEOzs7NkJBQ1E7QUFDUCxhQUNFO0FBQ0UsYUFBSyxLQUFLSCxLQUFMLENBQVdSLEdBRGxCO0FBRUUsY0FBTSxLQUFLUSxLQUFMLENBQVdULElBQVgsSUFBbUI7QUFGM0IsUUFERjtBQU1EOzs7Ozs7QUEzQ1VXLE0sQ0FDSmdCLFMsR0FBWTtBQUNqQjFCLE9BQUssb0JBQVUyQixNQUFWLENBQWlCQyxVQURMO0FBRWpCN0IsUUFBTSxvQkFBVTRCLE1BRkM7QUFHakJmLFNBQU8sb0JBQVVpQjtBQUhBLEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXG5pbXBvcnQgeyBQbGF5ZXIsIEJpZ1BsYXlCdXR0b24gfSBmcm9tICd2aWRlby1yZWFjdCdcbmltcG9ydCBpbmplY3RTdHlsZXMgZnJvbSAnLi9zdHlsZXMnXG5pbXBvcnQgSGxzIGZyb20gJ2hscy5qcydcblxuLy8gQFRPRE86XG4vLyAgIDEuIEJyYW5kIHZpZGVvIHBsYXllciB3aXRoIDxMb2dvPlxuLy8gICAyLiBBZGQgbmljZSBlbXB0eSBzdGF0ZSA6KVxuXG5jb25zdCBnZXRTb3VyY2VUeXBlID0gc3JjID0+IHtcbiAgY29uc3QgdHlwZXMgPSBbXG4gICAgWycubTN1OCcsICdhcHBsaWNhdGlvbi94LW1wZWdVUkwnXSxcbiAgICBbJy5tb3YnLCAndmlkZW8vcXVpY2t0aW1lJ10sXG4gICAgWycubXA0JywgJ3ZpZGVvL21wNCddLFxuICAgIFsnLm9nbScsICd2aWRlby9vZ2cnXSxcbiAgICBbJy5vZ3YnLCAndmlkZW8vb2dnJ10sXG4gICAgWycub2dnJywgJ3ZpZGVvL29nZyddLFxuICAgIFsnLndlYm0nLCAndmlkZW8vd2VibSddLFxuICBdXG4gIGZvciAoY29uc3QgW2VuZCwgdHlwZV0gb2YgdHlwZXMpIHtcbiAgICBpZiAoc3JjICYmIHNyYy5lbmRzV2l0aChlbmQpKSByZXR1cm4gdHlwZVxuICB9XG4gIGNvbnNvbGUud2FybihgQ291bGQgbm90IGRldGVybWluZSB0eXBlIGZvciBzcmMgXCIke3NyY31cImApXG4gIHJldHVybiAnJ1xufVxuXG5jb25zdCBpc0hMUyA9IHggPT4geCA9PT0gJ2FwcGxpY2F0aW9uL3gtbXBlZ1VSTCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlkZW9QbGF5ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCA9IGluamVjdFN0eWxlc1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBzcmMsIC4uLnByb3BzIH0gPSB0aGlzLnByb3BzXG4gICAgcmV0dXJuIChcbiAgICAgIDxQbGF5ZXIgcGxheXNJbmxpbmUgey4uLnByb3BzfT5cbiAgICAgICAgPEJpZ1BsYXlCdXR0b24gcG9zaXRpb249XCJjZW50ZXJcIiAvPlxuICAgICAgICA8U291cmNlXG4gICAgICAgICAgaXNWaWRlb0NoaWxkXG4gICAgICAgICAgYXV0b1BsYXk9e3Byb3BzLmF1dG9QbGF5fVxuICAgICAgICAgIHNyYz17c3JjfVxuICAgICAgICAgIHR5cGU9e2dldFNvdXJjZVR5cGUoc3JjKX1cbiAgICAgICAgLz5cbiAgICAgIDwvUGxheWVyPlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU291cmNlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBzcmM6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHZpZGVvOiBQcm9wVHlwZXMub2JqZWN0LFxuICB9XG4gIHVwZGF0ZVNvdXJjZSA9ICgpID0+IHtcbiAgICBjb25zdCB7IHNyYywgdHlwZSwgdmlkZW8sIGF1dG9QbGF5IH0gPSB0aGlzLnByb3BzXG4gICAgLy8gcmVtb3ZlIG9sZCBsaXN0ZW5lcnNcbiAgICBpZiAodGhpcy5obHMpIHtcbiAgICAgIHRoaXMuaGxzLm9mZihIbHMuRXZlbnRzLk1BTklGRVNUX1BBUlNFRCwgdGhpcy5vbk1hbmlmZXN0UGFyc2VkKVxuICAgIH1cbiAgICB0aGlzLmhscyA9IG5ldyBIbHMoKVxuICAgIC8vIGxvYWQgaGxzIHZpZGVvIHNvdXJjZSBiYXNlIG9uIGhscy5qc1xuICAgIGlmIChpc0hMUyh0eXBlKSAmJiBIbHMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgdGhpcy5obHMubG9hZFNvdXJjZShzcmMpXG4gICAgICB0aGlzLmhscy5hdHRhY2hNZWRpYSh2aWRlbylcbiAgICAgIHRoaXMuaGxzLm9uKEhscy5FdmVudHMuTUFOSUZFU1RfUEFSU0VELCB0aGlzLm9uTWFuaWZlc3RQYXJzZWQpXG4gICAgfVxuICB9XG4gIG9uTWFuaWZlc3RQYXJzZWQgPSAoKSA9PiB7XG4gICAgdGhpcy5obHMub2ZmKEhscy5FdmVudHMuTUFOSUZFU1RfUEFSU0VELCB0aGlzLm9uTWFuaWZlc3RQYXJzZWQpXG4gICAgZGVsZXRlIHRoaXMuaGxzXG4gICAgaWYgKCF0aGlzLnByb3BzLmF1dG9QbGF5KSByZXR1cm5cbiAgICB0aGlzLnByb3BzLnZpZGVvLnBsYXkoKVxuICB9XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMudXBkYXRlU291cmNlKClcbiAgfVxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGNvbnN0IGEgPSB0aGlzLnByb3BzLnNyY1xuICAgIGNvbnN0IGIgPSBuZXh0UHJvcHMuc3JjXG4gICAgaWYgKGEgPT09IGIpIHJldHVyblxuICAgIC8vIGlmIHRoZSBzcmMgY2hhbmdlZCwgdXBkYXRlIHRoZSB2aWRlbyBwbGF5ZXJcbiAgICB0aGlzLnVwZGF0ZVNvdXJjZSgpXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c291cmNlXG4gICAgICAgIHNyYz17dGhpcy5wcm9wcy5zcmN9XG4gICAgICAgIHR5cGU9e3RoaXMucHJvcHMudHlwZSB8fCAnYXBwbGljYXRpb24veC1tcGVnVVJMJ31cbiAgICAgIC8+XG4gICAgKVxuICB9XG59XG4iXX0=