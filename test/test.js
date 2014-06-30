var assert = require('assert'),
    sinon = require('sinon'),
    Mob = require('../mob.js');


var viewExecuted,
    viewExecutedWitchContext,
    afterShowExecute,
    barViewExecuted,
    subclassProperty;

var FooView = Mob.View.extend({
  show: function(context) {
    viewExecuted = true;
    viewExecutedWitchContext = context;
  },

  afterShow: function() {
    afterShowExecute = true;
  }
});

Mob.Router.route('#foo', FooView)


describe('View', function() {
  beforeEach(function() {
    viewExecuted = false;
    barViewExecuted = false;
  });

  it('supports basic inheritance', function() {
    var BarView = FooView.extend({
    });

    BarView.show()

    assert(viewExecuted);
  });

  it('supports inheritance override', function() {
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

  it('inherits methods', function() {
    var superFoo = sinon.spy();

    var SuperView = Mob.View.extend({
      foo: superFoo
    });

    var SubView = SuperView.extend({
    });

    SubView.foo();

    assert(superFoo.called);
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

  it('execute the after show callback if it exists', function() {
    dispatcher.dispatch('#foo', context);

    assert(afterShowExecute);
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
      var promise = { done: sinon.spy(), fail: sinon.spy() },
          onFetchError = function() {};

      var AjaxView = Mob.View.extend({
        fetch: function() {
          return promise;
        },

        show: function(context) {
        },

        onFetchError: onFetchError
      });
      Mob.Router.route('#ajax', AjaxView);

      dispatcher.dispatch('#ajax', context);

      assert(promise.done.called);
      assert(promise.fail.calledWith(onFetchError));
    });
  });
});
