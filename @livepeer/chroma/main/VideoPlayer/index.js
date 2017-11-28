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
        src && _react2.default.createElement(Source, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9WaWRlb1BsYXllci9pbmRleC5qcyJdLCJuYW1lcyI6WyJnZXRTb3VyY2VUeXBlIiwidHlwZXMiLCJlbmQiLCJ0eXBlIiwic3JjIiwiZW5kc1dpdGgiLCJjb25zb2xlIiwid2FybiIsImlzSExTIiwieCIsIlZpZGVvUGxheWVyIiwiY29tcG9uZW50RGlkTW91bnQiLCJwcm9wcyIsImF1dG9QbGF5IiwiU291cmNlIiwidXBkYXRlU291cmNlIiwidmlkZW8iLCJobHMiLCJvZmYiLCJFdmVudHMiLCJNQU5JRkVTVF9QQVJTRUQiLCJvbk1hbmlmZXN0UGFyc2VkIiwiaXNTdXBwb3J0ZWQiLCJsb2FkU291cmNlIiwiYXR0YWNoTWVkaWEiLCJvbiIsInBsYXkiLCJuZXh0UHJvcHMiLCJhIiwiYiIsInByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJvYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBOztBQUVBLElBQU1BLGdCQUFnQixTQUFoQkEsYUFBZ0IsTUFBTztBQUMzQixNQUFNQyxRQUFRLENBQ1osQ0FBQyxPQUFELEVBQVUsdUJBQVYsQ0FEWSxFQUVaLENBQUMsTUFBRCxFQUFTLGlCQUFULENBRlksRUFHWixDQUFDLE1BQUQsRUFBUyxXQUFULENBSFksRUFJWixDQUFDLE1BQUQsRUFBUyxXQUFULENBSlksRUFLWixDQUFDLE1BQUQsRUFBUyxXQUFULENBTFksRUFNWixDQUFDLE1BQUQsRUFBUyxXQUFULENBTlksRUFPWixDQUFDLE9BQUQsRUFBVSxZQUFWLENBUFksQ0FBZDtBQUQyQjtBQUFBO0FBQUE7O0FBQUE7QUFVM0IseUJBQTBCQSxLQUExQiw4SEFBaUM7QUFBQTs7QUFBQTs7QUFBQSxVQUFyQkMsR0FBcUI7QUFBQSxVQUFoQkMsSUFBZ0I7O0FBQy9CLFVBQUlDLE9BQU9BLElBQUlDLFFBQUosQ0FBYUgsR0FBYixDQUFYLEVBQThCLE9BQU9DLElBQVA7QUFDL0I7QUFaMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFhM0JHLFVBQVFDLElBQVIsd0NBQWtESCxHQUFsRDtBQUNBLFNBQU8sRUFBUDtBQUNELENBZkQ7O0FBaUJBLElBQU1JLFFBQVEsU0FBUkEsS0FBUTtBQUFBLFNBQUtDLE1BQU0sdUJBQVg7QUFBQSxDQUFkOztJQUVxQkMsVzs7Ozs7Ozs7Ozs7Ozs7a01BQ25CQyxpQjs7Ozs7NkJBQ1M7QUFBQSxtQkFDbUIsS0FBS0MsS0FEeEI7QUFBQSxVQUNDUixHQURELFVBQ0NBLEdBREQ7QUFBQSxVQUNTUSxLQURUOztBQUVQLGFBQ0U7QUFBQTtBQUFBLHdCQUFRLGlCQUFSLElBQXdCQSxLQUF4QjtBQUNFLG1FQUFlLFVBQVMsUUFBeEIsR0FERjtBQUVHUixlQUNDLDhCQUFDLE1BQUQ7QUFDRSw0QkFERjtBQUVFLG9CQUFVUSxNQUFNQyxRQUZsQjtBQUdFLGVBQUtULEdBSFA7QUFJRSxnQkFBTUosY0FBY0ksR0FBZDtBQUpSO0FBSEosT0FERjtBQWFEOzs7Ozs7a0JBakJrQk0sVzs7SUFvQlJJLE0sV0FBQUEsTTs7Ozs7Ozs7Ozs7Ozs7NkxBTVhDLFksR0FBZSxZQUFNO0FBQUEseUJBQ29CLE9BQUtILEtBRHpCO0FBQUEsVUFDWFIsR0FEVyxnQkFDWEEsR0FEVztBQUFBLFVBQ05ELElBRE0sZ0JBQ05BLElBRE07QUFBQSxVQUNBYSxLQURBLGdCQUNBQSxLQURBO0FBQUEsVUFDT0gsUUFEUCxnQkFDT0EsUUFEUDtBQUVuQjs7QUFDQSxVQUFJLE9BQUtJLEdBQVQsRUFBYztBQUNaLGVBQUtBLEdBQUwsQ0FBU0MsR0FBVCxDQUFhLGNBQUlDLE1BQUosQ0FBV0MsZUFBeEIsRUFBeUMsT0FBS0MsZ0JBQTlDO0FBQ0Q7QUFDRCxhQUFLSixHQUFMLEdBQVcsbUJBQVg7QUFDQTtBQUNBLFVBQUlULE1BQU1MLElBQU4sS0FBZSxjQUFJbUIsV0FBSixFQUFuQixFQUFzQztBQUNwQyxlQUFLTCxHQUFMLENBQVNNLFVBQVQsQ0FBb0JuQixHQUFwQjtBQUNBLGVBQUthLEdBQUwsQ0FBU08sV0FBVCxDQUFxQlIsS0FBckI7QUFDQSxlQUFLQyxHQUFMLENBQVNRLEVBQVQsQ0FBWSxjQUFJTixNQUFKLENBQVdDLGVBQXZCLEVBQXdDLE9BQUtDLGdCQUE3QztBQUNEO0FBQ0YsSyxTQUNEQSxnQixHQUFtQixZQUFNO0FBQ3ZCLGFBQUtKLEdBQUwsQ0FBU0MsR0FBVCxDQUFhLGNBQUlDLE1BQUosQ0FBV0MsZUFBeEIsRUFBeUMsT0FBS0MsZ0JBQTlDO0FBQ0EsYUFBTyxPQUFLSixHQUFaO0FBQ0EsVUFBSSxDQUFDLE9BQUtMLEtBQUwsQ0FBV0MsUUFBaEIsRUFBMEI7QUFDMUIsYUFBS0QsS0FBTCxDQUFXSSxLQUFYLENBQWlCVSxJQUFqQjtBQUNELEs7Ozs7O3dDQUNtQjtBQUNsQixXQUFLWCxZQUFMO0FBQ0Q7Ozs4Q0FDeUJZLFMsRUFBVztBQUNuQyxVQUFNQyxJQUFJLEtBQUtoQixLQUFMLENBQVdSLEdBQXJCO0FBQ0EsVUFBTXlCLElBQUlGLFVBQVV2QixHQUFwQjtBQUNBLFVBQUl3QixNQUFNQyxDQUFWLEVBQWE7QUFDYjtBQUNBLFdBQUtkLFlBQUw7QUFDRDs7OzZCQUNRO0FBQ1AsYUFDRTtBQUNFLGFBQUssS0FBS0gsS0FBTCxDQUFXUixHQURsQjtBQUVFLGNBQU0sS0FBS1EsS0FBTCxDQUFXVCxJQUFYLElBQW1CO0FBRjNCLFFBREY7QUFNRDs7Ozs7O0FBM0NVVyxNLENBQ0pnQixTLEdBQVk7QUFDakIxQixPQUFLLG9CQUFVMkIsTUFBVixDQUFpQkMsVUFETDtBQUVqQjdCLFFBQU0sb0JBQVU0QixNQUZDO0FBR2pCZixTQUFPLG9CQUFVaUI7QUFIQSxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuaW1wb3J0IHsgUGxheWVyLCBCaWdQbGF5QnV0dG9uIH0gZnJvbSAndmlkZW8tcmVhY3QnXG5pbXBvcnQgaW5qZWN0U3R5bGVzIGZyb20gJy4vc3R5bGVzJ1xuaW1wb3J0IEhscyBmcm9tICdobHMuanMnXG5cbi8vIEBUT0RPOlxuLy8gICAxLiBCcmFuZCB2aWRlbyBwbGF5ZXIgd2l0aCA8TG9nbz5cbi8vICAgMi4gQWRkIG5pY2UgZW1wdHkgc3RhdGUgOilcblxuY29uc3QgZ2V0U291cmNlVHlwZSA9IHNyYyA9PiB7XG4gIGNvbnN0IHR5cGVzID0gW1xuICAgIFsnLm0zdTgnLCAnYXBwbGljYXRpb24veC1tcGVnVVJMJ10sXG4gICAgWycubW92JywgJ3ZpZGVvL3F1aWNrdGltZSddLFxuICAgIFsnLm1wNCcsICd2aWRlby9tcDQnXSxcbiAgICBbJy5vZ20nLCAndmlkZW8vb2dnJ10sXG4gICAgWycub2d2JywgJ3ZpZGVvL29nZyddLFxuICAgIFsnLm9nZycsICd2aWRlby9vZ2cnXSxcbiAgICBbJy53ZWJtJywgJ3ZpZGVvL3dlYm0nXSxcbiAgXVxuICBmb3IgKGNvbnN0IFtlbmQsIHR5cGVdIG9mIHR5cGVzKSB7XG4gICAgaWYgKHNyYyAmJiBzcmMuZW5kc1dpdGgoZW5kKSkgcmV0dXJuIHR5cGVcbiAgfVxuICBjb25zb2xlLndhcm4oYENvdWxkIG5vdCBkZXRlcm1pbmUgdHlwZSBmb3Igc3JjIFwiJHtzcmN9XCJgKVxuICByZXR1cm4gJydcbn1cblxuY29uc3QgaXNITFMgPSB4ID0+IHggPT09ICdhcHBsaWNhdGlvbi94LW1wZWdVUkwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZGVvUGxheWVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQgPSBpbmplY3RTdHlsZXNcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgc3JjLCAuLi5wcm9wcyB9ID0gdGhpcy5wcm9wc1xuICAgIHJldHVybiAoXG4gICAgICA8UGxheWVyIHBsYXlzSW5saW5lIHsuLi5wcm9wc30+XG4gICAgICAgIDxCaWdQbGF5QnV0dG9uIHBvc2l0aW9uPVwiY2VudGVyXCIgLz5cbiAgICAgICAge3NyYyAmJiAoXG4gICAgICAgICAgPFNvdXJjZVxuICAgICAgICAgICAgaXNWaWRlb0NoaWxkXG4gICAgICAgICAgICBhdXRvUGxheT17cHJvcHMuYXV0b1BsYXl9XG4gICAgICAgICAgICBzcmM9e3NyY31cbiAgICAgICAgICAgIHR5cGU9e2dldFNvdXJjZVR5cGUoc3JjKX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9QbGF5ZXI+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTb3VyY2UgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHNyYzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdmlkZW86IFByb3BUeXBlcy5vYmplY3QsXG4gIH1cbiAgdXBkYXRlU291cmNlID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgc3JjLCB0eXBlLCB2aWRlbywgYXV0b1BsYXkgfSA9IHRoaXMucHJvcHNcbiAgICAvLyByZW1vdmUgb2xkIGxpc3RlbmVyc1xuICAgIGlmICh0aGlzLmhscykge1xuICAgICAgdGhpcy5obHMub2ZmKEhscy5FdmVudHMuTUFOSUZFU1RfUEFSU0VELCB0aGlzLm9uTWFuaWZlc3RQYXJzZWQpXG4gICAgfVxuICAgIHRoaXMuaGxzID0gbmV3IEhscygpXG4gICAgLy8gbG9hZCBobHMgdmlkZW8gc291cmNlIGJhc2Ugb24gaGxzLmpzXG4gICAgaWYgKGlzSExTKHR5cGUpICYmIEhscy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICB0aGlzLmhscy5sb2FkU291cmNlKHNyYylcbiAgICAgIHRoaXMuaGxzLmF0dGFjaE1lZGlhKHZpZGVvKVxuICAgICAgdGhpcy5obHMub24oSGxzLkV2ZW50cy5NQU5JRkVTVF9QQVJTRUQsIHRoaXMub25NYW5pZmVzdFBhcnNlZClcbiAgICB9XG4gIH1cbiAgb25NYW5pZmVzdFBhcnNlZCA9ICgpID0+IHtcbiAgICB0aGlzLmhscy5vZmYoSGxzLkV2ZW50cy5NQU5JRkVTVF9QQVJTRUQsIHRoaXMub25NYW5pZmVzdFBhcnNlZClcbiAgICBkZWxldGUgdGhpcy5obHNcbiAgICBpZiAoIXRoaXMucHJvcHMuYXV0b1BsYXkpIHJldHVyblxuICAgIHRoaXMucHJvcHMudmlkZW8ucGxheSgpXG4gIH1cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy51cGRhdGVTb3VyY2UoKVxuICB9XG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgY29uc3QgYSA9IHRoaXMucHJvcHMuc3JjXG4gICAgY29uc3QgYiA9IG5leHRQcm9wcy5zcmNcbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuXG4gICAgLy8gaWYgdGhlIHNyYyBjaGFuZ2VkLCB1cGRhdGUgdGhlIHZpZGVvIHBsYXllclxuICAgIHRoaXMudXBkYXRlU291cmNlKClcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzb3VyY2VcbiAgICAgICAgc3JjPXt0aGlzLnByb3BzLnNyY31cbiAgICAgICAgdHlwZT17dGhpcy5wcm9wcy50eXBlIHx8ICdhcHBsaWNhdGlvbi94LW1wZWdVUkwnfVxuICAgICAgLz5cbiAgICApXG4gIH1cbn1cbiJdfQ==