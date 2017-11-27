'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hls = require('hls.js');

var _hls2 = _interopRequireDefault(_hls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CACHE = {};

var Snapshot = function (_Component) {
  _inherits(Snapshot, _Component);

  function Snapshot() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Snapshot);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Snapshot.__proto__ || Object.getPrototypeOf(Snapshot)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      src: ''
    }, _this.canvas = document.createElement('canvas'), _this.video = document.createElement('video'), _this.setThumbnailDataURL = function () {
      var _this2 = _this,
          canvas = _this2.canvas,
          ctx = _this2.ctx,
          key = _this2.key,
          props = _this2.props,
          video = _this2.video;
      var videoWidth = video.videoWidth,
          videoHeight = video.videoHeight;
      var crop = props.crop,
          width = props.width,
          height = props.height;

      if (!CACHE[key]) {
        var w = Number(width);
        var h = Number(height);
        var wScale = w / videoWidth;
        var hScale = h / videoHeight;
        var scale = Math[crop ? 'max' : 'min'](wScale, hScale);
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight, (w - videoWidth * scale) / 2, (h - videoHeight * scale) / 2, videoWidth * scale, videoHeight * scale);
        CACHE[key] = canvas.toDataURL();
      }
      _this.setState({ src: CACHE[key] }, function () {
        _this.props.onSnapshotReady(_this.state.src);
      });
      _this.video.removeEventListener('canplay', _this.setThumbnailDataURL);
      _this.hls.destroy();
    }, _this.updateThumbnail = function () {
      if (!_this.props.url) return;
      if (CACHE[_this.key]) {
        return _this.setState({ src: CACHE[_this.key] }, function () {
          _this.props.onSnapshotReady(_this.state.src);
        });
      }
      var _this3 = _this,
          canvas = _this3.canvas,
          video = _this3.video,
          props = _this3.props;

      var parent = document.createElement('div');
      parent.appendChild(canvas);
      parent.appendChild(video);
      _this.hls = new _hls2.default();
      _this.ctx = canvas.getContext('2d');
      _this.hls.loadSource(props.url);
      _this.hls.attachMedia(video);
      video.currentTime = props.at;
      _this.video.addEventListener('canplay', _this.setThumbnailDataURL);
    }, _this.getKey = function (props) {
      return JSON.stringify({
        at: props.at,
        width: props.width,
        height: props.height,
        crop: props.crop,
        url: props.url
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Snapshot, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.key = this.getKey(this.props);
      this.updateThumbnail();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.video.removeEventListener('canplay', this.setThumbnailDataURL);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var nextKey = this.getKey(nextProps);
      if (this.key === nextKey) return;
      this.key = nextKey;
      this.setState({ src: nextProps.defaultSrc }, this.updateThumbnail);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          as = _props.as,
          at = _props.at,
          crop = _props.crop,
          defaultSrc = _props.defaultSrc,
          onSnapshotReady = _props.onSnapshotReady,
          props = _objectWithoutProperties(_props, ['as', 'at', 'crop', 'defaultSrc', 'onSnapshotReady']);

      var src = this.state.src;

      return _react2.default.createElement(as, Object.assign({}, props, { src: src || defaultSrc }));
    }
  }]);

  return Snapshot;
}(_react.Component);

Snapshot.defaultProps = {
  as: 'img',
  at: 0,
  defaultSrc: '',
  crop: true,
  width: 100,
  height: 100,
  onSnapshotReady: function onSnapshotReady() {}
};
exports.default = Snapshot;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TbmFwc2hvdC9pbmRleC5qcyJdLCJuYW1lcyI6WyJDQUNIRSIsIlNuYXBzaG90Iiwic3RhdGUiLCJzcmMiLCJjYW52YXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ2aWRlbyIsInNldFRodW1ibmFpbERhdGFVUkwiLCJjdHgiLCJrZXkiLCJwcm9wcyIsInZpZGVvV2lkdGgiLCJ2aWRlb0hlaWdodCIsImNyb3AiLCJ3aWR0aCIsImhlaWdodCIsInciLCJOdW1iZXIiLCJoIiwid1NjYWxlIiwiaFNjYWxlIiwic2NhbGUiLCJNYXRoIiwiZHJhd0ltYWdlIiwidG9EYXRhVVJMIiwic2V0U3RhdGUiLCJvblNuYXBzaG90UmVhZHkiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaGxzIiwiZGVzdHJveSIsInVwZGF0ZVRodW1ibmFpbCIsInVybCIsInBhcmVudCIsImFwcGVuZENoaWxkIiwiZ2V0Q29udGV4dCIsImxvYWRTb3VyY2UiLCJhdHRhY2hNZWRpYSIsImN1cnJlbnRUaW1lIiwiYXQiLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0S2V5IiwiSlNPTiIsInN0cmluZ2lmeSIsIm5leHRQcm9wcyIsIm5leHRLZXkiLCJkZWZhdWx0U3JjIiwiYXMiLCJkZWZhdWx0UHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxRQUFRLEVBQWQ7O0lBRXFCQyxROzs7Ozs7Ozs7Ozs7OzswTEFVbkJDLEssR0FBUTtBQUNOQyxXQUFLO0FBREMsSyxRQUdSQyxNLEdBQVNDLFNBQVNDLGFBQVQsQ0FBdUIsUUFBdkIsQyxRQUNUQyxLLEdBQVFGLFNBQVNDLGFBQVQsQ0FBdUIsT0FBdkIsQyxRQUNSRSxtQixHQUFzQixZQUFNO0FBQUE7QUFBQSxVQUNsQkosTUFEa0IsVUFDbEJBLE1BRGtCO0FBQUEsVUFDVkssR0FEVSxVQUNWQSxHQURVO0FBQUEsVUFDTEMsR0FESyxVQUNMQSxHQURLO0FBQUEs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cEJSLE1BQUksQ0FGZ0I7QUFHcEJPLGNBQVksRUFIUTtBQUlwQmhDLFFBQU0sSUFKYztBQUtwQkMsU0FBTyxHQUxhO0FBTXBCQyxVQUFRLEdBTlk7QUFPcEJXLG1CQUFpQiwyQkFBTSxDQUFFO0FBUEwsQztrQkFESDFCLFEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgSGxzIGZyb20gJ2hscy5qcydcblxuY29uc3QgQ0FDSEUgPSB7fVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTbmFwc2hvdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgYXM6ICdpbWcnLFxuICAgIGF0OiAwLFxuICAgIGRlZmF1bHRTcmM6ICcnLFxuICAgIGNyb3A6IHRydWUsXG4gICAgd2lkdGg6IDEwMCxcbiAgICBoZWlnaHQ6IDEwMCxcbiAgICBvblNuYXBzaG90UmVhZHk6ICgpID0+IHt9LFxuICB9XG4gIHN0YXRlID0ge1xuICAgIHNyYzogJycsXG4gIH1cbiAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgdmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpXG4gIHNldFRodW1ibmFpbERhdGFVUkwgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBjYW52YXMsIGN0eCwga2V5LCBwcm9wcywgdmlkZW8gfSA9IHRoaXNcbiAgICBjb25zdCB7IHZpZGVvV2lkdGgsIHZpZGVvSGVpZ2h0IH0gPSB2aWRlb1xuICAgIGNvbnN0IHsgY3JvcCwgd2lkdGgsIGhlaWdodCB9ID0gcHJvcHNcbiAgICBpZiAoIUNBQ0hFW2tleV0pIHtcbiAgICAgIGNvbnN0IHcgPSBOdW1iZXIod2lkdGgpXG4gICAgICBjb25zdCBoID0gTnVtYmVyKGhlaWdodClcbiAgICAgIGNvbnN0IHdTY2FsZSA9IHcgLyB2aWRlb1dpZHRoXG4gICAgICBjb25zdCBoU2NhbGUgPSBoIC8gdmlkZW9IZWlnaHRcbiAgICAgIGNvbnN0IHNjYWxlID0gTWF0aFtjcm9wID8gJ21heCcgOiAnbWluJ10od1NjYWxlLCBoU2NhbGUpXG4gICAgICBjYW52YXMud2lkdGggPSB3XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gaFxuICAgICAgY3R4LmRyYXdJbWFnZShcbiAgICAgICAgdmlkZW8sXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHZpZGVvV2lkdGgsXG4gICAgICAgIHZpZGVvSGVpZ2h0LFxuICAgICAgICAodyAtIHZpZGVvV2lkdGggKiBzY2FsZSkgLyAyLFxuICAgICAgICAoaCAtIHZpZGVvSGVpZ2h0ICogc2NhbGUpIC8gMixcbiAgICAgICAgdmlkZW9XaWR0aCAqIHNjYWxlLFxuICAgICAgICB2aWRlb0hlaWdodCAqIHNjYWxlLFxuICAgICAgKVxuICAgICAgQ0FDSEVba2V5XSA9IGNhbnZhcy50b0RhdGFVUkwoKVxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgc3JjOiBDQUNIRVtrZXldIH0sICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMub25TbmFwc2hvdFJlYWR5KHRoaXMuc3RhdGUuc3JjKVxuICAgIH0pXG4gICAgdGhpcy52aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgdGhpcy5zZXRUaHVtYm5haWxEYXRhVVJMKVxuICAgIHRoaXMuaGxzLmRlc3Ryb3koKVxuICB9XG4gIHVwZGF0ZVRodW1ibmFpbCA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMucHJvcHMudXJsKSByZXR1cm5cbiAgICBpZiAoQ0FDSEVbdGhpcy5rZXldKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHNyYzogQ0FDSEVbdGhpcy5rZXldIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9wcy5vblNuYXBzaG90UmVhZHkodGhpcy5zdGF0ZS5zcmMpXG4gICAgICB9KVxuICAgIH1cbiAgICBjb25zdCB7IGNhbnZhcywgdmlkZW8sIHByb3BzIH0gPSB0aGlzXG4gICAgY29uc3QgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2FudmFzKVxuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh2aWRlbylcbiAgICB0aGlzLmhscyA9IG5ldyBIbHMoKVxuICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICB0aGlzLmhscy5sb2FkU291cmNlKHByb3BzLnVybClcbiAgICB0aGlzLmhscy5hdHRhY2hNZWRpYSh2aWRlbylcbiAgICB2aWRlby5jdXJyZW50VGltZSA9IHByb3BzLmF0XG4gICAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgdGhpcy5zZXRUaHVtYm5haWxEYXRhVVJMKVxuICB9XG4gIGdldEtleSA9IHByb3BzID0+IHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYXQ6IHByb3BzLmF0LFxuICAgICAgd2lkdGg6IHByb3BzLndpZHRoLFxuICAgICAgaGVpZ2h0OiBwcm9wcy5oZWlnaHQsXG4gICAgICBjcm9wOiBwcm9wcy5jcm9wLFxuICAgICAgdXJsOiBwcm9wcy51cmwsXG4gICAgfSlcbiAgfVxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmtleSA9IHRoaXMuZ2V0S2V5KHRoaXMucHJvcHMpXG4gICAgdGhpcy51cGRhdGVUaHVtYm5haWwoKVxuICB9XG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMudmlkZW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2FucGxheScsIHRoaXMuc2V0VGh1bWJuYWlsRGF0YVVSTClcbiAgfVxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGNvbnN0IG5leHRLZXkgPSB0aGlzLmdldEtleShuZXh0UHJvcHMpXG4gICAgaWYgKHRoaXMua2V5ID09PSBuZXh0S2V5KSByZXR1cm5cbiAgICB0aGlzLmtleSA9IG5leHRLZXlcbiAgICB0aGlzLnNldFN0YXRlKHsgc3JjOiBuZXh0UHJvcHMuZGVmYXVsdFNyYyB9LCB0aGlzLnVwZGF0ZVRodW1ibmFpbClcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBhcywgYXQsIGNyb3AsIGRlZmF1bHRTcmMsIG9uU25hcHNob3RSZWFkeSwgLi4ucHJvcHMgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCB7IHNyYyB9ID0gdGhpcy5zdGF0ZVxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KGFzLCB7IC4uLnByb3BzLCBzcmM6IHNyYyB8fCBkZWZhdWx0U3JjIH0pXG4gIH1cbn1cbiJdfQ==