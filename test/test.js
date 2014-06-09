var assert = require('assert'),
    sinon = require('sinon'),
    Mob = require('../mob.js');


var viewExecuted,
    viewExecutedWitchContext,
    barViewExecuted,
    subclassProperty;

var FooView = Mob.View.extend({
  show: function(context) {
    viewExecuted = true;
    viewExecutedWitchContext = context;
  }
});

Mob.Router.route('#foo', FooView)


describe('View', function() {
  it('supports inheritance', function() {
    var BarView = FooView.extend({
      show: function(context) {
        this._super.show(context);
        barViewExecuted = true;
      }
    });

    BarView.show()

    assert(viewExecuted);
    assert(barViewExecuted);
  });
});


describe('Dispatcher', function() {
  var dispatcher = Mob.Dispatcher(),
      context = { page: 'index.html' };

  it('dispatch a request to the view', function() {

    dispatcher.dispatch('#foo', context);

    assert(viewExecuted);
    assert(viewExecutedWitchContext === context);
  });

  it('throws an error when no route is found', function() {
    try {
      dispatcher.dispatch('#bar', context);
    } catch(err) {
      assert(err === 'Mob.RouteNotFoundError: #bar')
    }
  });

  describe('loading async data before view show', function() {
    it('calls only after promise is done', function() {
      var promise = { done: sinon.spy() };

      var AjaxView = Mob.View.extend({
        fetch: promise,

        show: function(context) {
        }
      });
      Mob.Router.route('#ajax', AjaxView);

      dispatcher.dispatch('#ajax', context);

      assert(promise.done.called);
    });
  });
});
