/* global before, beforeEach, chai, describe, it, sinon */
'use strict';


var CatalogEvent = require('pdl/CatalogEvent'),
    Model = require('mvc/Model'),
    ShakeMapModule = require('shakemap/ShakeMapModule'),
    Xhr = require('util/Xhr');


var expect = chai.expect;


describe('shakemap/ShakeMapModule', function () {
  var eventModel;

  before(function (done) {
    Xhr.ajax({
      url: '/events/us10004u1y.json',
      success: function (details) {
        eventModel = Model({
          'event': CatalogEvent(details),
          'config': {}
        });
        done();
      },
      error: function () {
        done();
      }
    });
  });


  describe('constructor', function () {
    it('should be defined', function () {
      expect(typeof ShakeMapModule).to.equal('function');
    });
  });

  describe('render', function () {
    var module;

    beforeEach(function () {
      module = ShakeMapModule({
        el: document.createElement('div'),
        model: eventModel
      });
    });

    it('adds the header title', function () {
      var header;
      module.render();

      header = module.header.querySelector('h3');
      /* jshint -W030 */
      expect(header).to.not.be.null;
      /* jshint +W030 */
      expect(header.innerHTML).to.equal('ShakeMap');
    });

    it('includes the default module header', function () {
      var spy;

      spy = sinon.spy(module, 'getProductHeader');
      module.render();

      expect(spy.callCount).to.equal(1);
      spy.restore();
    });

    it('includes a more info link', function () {
      var link;

      module.render();

      link = module.footer.querySelector('a');
      /* jshint -W030 */
      expect(link).to.not.be.null;
      /* jshint +W030 */
      expect(link.getAttribute('href')).to.equal(
          'http://usgs.github.io/shakemap');
      expect(link.innerHTML).to.equal('ShakeMap Manual');
    });
  });
});
