/*
Dependecies : React, React-DOM


Handler: (default_state, root_react_component, wrapper div)
  set: (new_state_object) -> new state

*/

if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}


var preact = require('preact');

render = preact.render
h = preact.h



function StateHandle(component,wrapper){
  this.state = {};
  this.component = component;
  this.wrapper = wrapper
  this.root;
  this.watch_keys = []
  this.watch_calls = []
  this.empty = {}
  this.set = function(new_state,opt){
    opt = opt || this.empty


    if(new_state){
      for(var key in new_state){

        if( (!opt.overwrite) && typeof new_state[key] == 'object' && new_state[key] != null){
          // console.log('obj' new_state[key])
          // console.log(this.state[key])
          this.state[key] = Object.assign({},this.state[key],new_state[key]);
          // this.state = Object.assign({},this.state,new_state);
        }else{
          this.state[key] = new_state[key];
          log(new_state[key]);
        }
      }

      // this.state = Object.assign({},this.state,new_state);
      for (var i in this.watch_keys){
        if( new_state[this.watch_keys[i]] !== undefined ){
          this.watch_calls[i](new_state[this.watch_keys[i]])
        }
      }
    }
    
    this.root = render(
      h(this.component,this.state),
      this.wrapper,
      this.root
    )     
  

    return this
  }

  this.on = function(key,cb){
    this.watch_keys.push(key)
    this.watch_calls.push(cb)
  }
  return this;
}

module.exports = StateHandle