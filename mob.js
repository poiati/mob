(function() {
  var _routes = {};

  var Dispatcher = function() {
    return {
      dispatch: function(action, context) {
        var view = _routes[action];
        if (!view) {
          throw 'Mob.RouteNotFoundError: ' + action;
        }
        if (view.fetch) {
          view.fetch.done(function(data) { 
            context.data = data;
            view.show(context) 
          });
          return;
        }
        view.show(context);
      }
    };
  };


  var View = (function() {
    var _extend = function(definition) {
      var _super = this;

      definition['extend'] = _extend;
      definition['_super'] = _super;

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

