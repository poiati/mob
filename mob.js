(function() {
  var _routes = {};

  var Dispatcher = function() {
    return {
      dispatch: function(action, context) {
        var view = _routes[action];
        if (!view) {
          throw 'Mob.RouteNotFoundError: ' + action;
        }
        if (typeof view.fetch === 'function') {
          var deferred = view.fetch();

          deferred.done(function(data) { 
            context.data = data;
            view.show(context) 
          });

          if (typeof view.onFetchError === 'function') {
            deferred.fail(view.onFetchError);
          }

          return;
        }
        view.show(context);
      }
    };
  };


  var View = (function() {
    var _copySuperProperties = function(superclass, subclass) {
      for (property in superclass) {
        if (!subclass[property]) {
          subclass[property] = superclass[property];
        }
      }
    }

    var _extend = function(definition) {
      var _super = this;

      definition['extend'] = _extend;
      definition['_super'] = _super;

      _copySuperProperties(_super, definition);

      return definition;
    };
    return { extend: _extend }
  })();


  var Router = (function() {
    return {
      route: function(action, view) {
        _routes[action] = view;
      }
    }
  })();


  module.exports.Dispatcher = Dispatcher;
  module.exports.View = View;
  module.exports.Router = Router;
})();

