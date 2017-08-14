
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var preact = require('preact');

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

function connectToStores(Spec) {
  

  // Check for required static methods.
  if (!Spec.getStores) {
    throw new Error('connectToStores() expects the wrapped component to have a static getStores() method');
  }
  if (!Spec.getPropsFromStores) {
    throw new Error('connectToStores() expects the wrapped component to have a static getPropsFromStores() method');
  }
  var StoreConnection = (function(superClass) {
    extend(StoreConnection, superClass);
    function StoreConnection() {
      this.render = bind(this.render, this);
      this.getInitialState = bind(this.getInitialState, this);
      // this.componentWillMount = bind(this.componentDidMount, this);
      this.componentWillUnmount = bind(this.componentWillUnmount, this);
      this.componentWillReceiveProps = bind(this.componentWillReceiveProps , this);
      this.onChange = bind(this.onChange , this);
      this.state = Spec.getPropsFromStores(this.props, this.context);
      return StoreConnection.__super__.constructor.apply(this, arguments);
    }
    StoreConnection.displayName = 'Stateful' + (Spec.displayName || Spec.name || 'Container')
    StoreConnection.prototype.componentWillReceiveProps = function(nextProps) {
      return this.setState(Spec.getPropsFromStores(nextProps, this.context));
    };

    // StoreConnection.prototype.componentWillMount = function(props, state) {
    //   console.log('store will mount')
    // }

    StoreConnection.prototype.componentWillMount = function(props, state) {
      // console.log('store mounted')
      var _this = this;

      var stores = Spec.getStores(this.props, this.context);
      this.storeListeners = stores.map(function (store) {
        return store.listen(_this.onChange);
      });
      if (Spec.componentDidConnect) {
        Spec.componentDidConnect(this.props, this.context);
      }
    };


    StoreConnection.prototype.componentWillUnmount = function(props, state) {
      this.storeListeners.forEach(function (unlisten) {
        return unlisten();
      });
    };

    StoreConnection.prototype.onChange = function(props, state) {
      this.setState(Spec.getPropsFromStores(this.props, this.context));
    };

    StoreConnection.prototype.render = function(props, state) {
      // console.log('render store',this.state)
      return preact.h(Spec,Object.assign({}, this.props, this.state));
    };


    return StoreConnection
  })(preact.Component)
  return StoreConnection
}



exports['default'] = connectToStores;
module.exports = exports['default'];