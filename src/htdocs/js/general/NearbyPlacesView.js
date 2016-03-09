'use strict';

var ProductView = require('core/ProductView'),
    Formatter = require('core/Formatter'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');

var _DEFAULTS;

_DEFAULTS = {
  errorMessage: 'Error loading nearby places.'
};


/**
 * View for a nearby-cities Product.
 *
 * @param options {Object}
 *    all options are passed to ProductView.
 */
var NearbyPlacesView = function (options) {
  var _this,
      _initialize,

      _errorMessage,
      _formatter;

  _this = ProductView(options);

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
    _errorMessage = options.errorMessage;
    _formatter = options.formatter || Formatter();
  };

  /**
   * Destroy all the things.
   */
  _this.destroy = Util.compose(function () {
    _errorMessage = null;
    _formatter = null;
    _this = null;
    _initialize = null;
  }, _this.destroy);

  /**
   * Gets the data
   */
  _this.fetchData = function () {
    var content;

    content = _this.model.getContent('nearby-cities.json');

    if (!content) {
      _this.onError();
      return;
    }

    Xhr.ajax({
      url: content.get('url'),
      success: _this.onSuccess,
      error: _this.onError
    });
  };

  /**
   * This method is called when there is a problem.
   *
   * @param errorMessage {String}
   *      A description of the error that occurred.
   */
  _this.onError = function () {
    _this.el.innerHTML = _errorMessage;
  };

  /**
   * This method is called to render nearby-cities.
   *
   * @param data {Object}
   *    The data for nearby-cities JSON.
   */
  _this.onSuccess = function (data) {
    var i,
        len,
        markup;

    len = data.length;
    markup = [];

    _this.el.className = 'nearby-places';
    // Formats nearby places
    for (i = 0; i < len; i++) {
      markup.push('<li>' +
          data[i].distance + ' km ' +
          '(' + Math.round(_formatter.kmToMi(data[i].distance)) + ' mi) ' +
          data[i].direction +
          ' of ' + data[i].name +
          '</li>');
    }

    _this.el.innerHTML = '<ul class="no-style">' + markup.join('') + '</ul>';
  };

  /**
   * Called when the model changes. Initially sets a loading message then starts
   * the data fetch process to render the actual content. Relies on browser
   * caches to avoid duplicate HTTP overhead.
   */
   _this.render = function () {
     _this.el.innerHTML = 'Loading content&hellip;';
     _this.fetchData();
   };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = NearbyPlacesView;