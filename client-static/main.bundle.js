/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/arxii/Projects/checklist/client-static";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

!function(global, factory) {
     true ? factory(exports) : 'function' == typeof define && define.amd ? define([ 'exports' ], factory) : factory(global.preact = global.preact || {});
}(this, function(exports) {
    function VNode(nodeName, attributes, children) {
        this.nodeName = nodeName;
        this.attributes = attributes;
        this.children = children;
        this.key = attributes && attributes.key;
    }
    function h(nodeName, attributes) {
        var children, lastSimple, child, simple, i;
        for (i = arguments.length; i-- > 2; ) stack.push(arguments[i]);
        if (attributes && attributes.children) {
            if (!stack.length) stack.push(attributes.children);
            delete attributes.children;
        }
        while (stack.length) if ((child = stack.pop()) instanceof Array) for (i = child.length; i--; ) stack.push(child[i]); else if (null != child && child !== !0 && child !== !1) {
            if ('number' == typeof child) child = String(child);
            simple = 'string' == typeof child;
            if (simple && lastSimple) children[children.length - 1] += child; else {
                (children || (children = [])).push(child);
                lastSimple = simple;
            }
        }
        var p = new VNode(nodeName, attributes || void 0, children || EMPTY_CHILDREN);
        if (options.vnode) options.vnode(p);
        return p;
    }
    function extend(obj, props) {
        if (props) for (var i in props) obj[i] = props[i];
        return obj;
    }
    function clone(obj) {
        return extend({}, obj);
    }
    function delve(obj, key) {
        for (var p = key.split('.'), i = 0; i < p.length && obj; i++) obj = obj[p[i]];
        return obj;
    }
    function isFunction(obj) {
        return 'function' == typeof obj;
    }
    function isString(obj) {
        return 'string' == typeof obj;
    }
    function hashToClassName(c) {
        var str = '';
        for (var prop in c) if (c[prop]) {
            if (str) str += ' ';
            str += prop;
        }
        return str;
    }
    function cloneElement(vnode, props) {
        return h(vnode.nodeName, extend(clone(vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
    }
    function createLinkedState(component, key, eventPath) {
        var path = key.split('.');
        return function(e) {
            var t = e && e.target || this, state = {}, obj = state, v = isString(eventPath) ? delve(e, eventPath) : t.nodeName ? t.type.match(/^che|rad/) ? t.checked : t.value : e, i = 0;
            for (;i < path.length - 1; i++) obj = obj[path[i]] || (obj[path[i]] = !i && component.state[path[i]] || {});
            obj[path[i]] = v;
            component.setState(state);
        };
    }
    function enqueueRender(component) {
        if (!component._dirty && (component._dirty = !0) && 1 == items.push(component)) (options.debounceRendering || defer)(rerender);
    }
    function rerender() {
        var p, list = items;
        items = [];
        while (p = list.pop()) if (p._dirty) renderComponent(p);
    }
    function isFunctionalComponent(vnode) {
        var nodeName = vnode && vnode.nodeName;
        return nodeName && isFunction(nodeName) && !(nodeName.prototype && nodeName.prototype.render);
    }
    function buildFunctionalComponent(vnode, context) {
        return vnode.nodeName(getNodeProps(vnode), context || EMPTY);
    }
    function isSameNodeType(node, vnode) {
        if (isString(vnode)) return node instanceof Text;
        if (isString(vnode.nodeName)) return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
        if (isFunction(vnode.nodeName)) return (node._componentConstructor ? node._componentConstructor === vnode.nodeName : !0) || isFunctionalComponent(vnode); else return;
    }
    function isNamedNode(node, nodeName) {
        return node.normalizedNodeName === nodeName || toLowerCase(node.nodeName) === toLowerCase(nodeName);
    }
    function getNodeProps(vnode) {
        var props = clone(vnode.attributes);
        props.children = vnode.children;
        var defaultProps = vnode.nodeName.defaultProps;
        if (defaultProps) for (var i in defaultProps) if (void 0 === props[i]) props[i] = defaultProps[i];
        return props;
    }
    function removeNode(node) {
        var p = node.parentNode;
        if (p) p.removeChild(node);
    }
    function setAccessor(node, name, old, value, isSvg) {
        if ('className' === name) name = 'class';
        if ('class' === name && value && 'object' == typeof value) value = hashToClassName(value);
        if ('key' === name) ; else if ('class' === name && !isSvg) node.className = value || ''; else if ('style' === name) {
            if (!value || isString(value) || isString(old)) node.style.cssText = value || '';
            if (value && 'object' == typeof value) {
                if (!isString(old)) for (var i in old) if (!(i in value)) node.style[i] = '';
                for (var i in value) node.style[i] = 'number' == typeof value[i] && !NON_DIMENSION_PROPS[i] ? value[i] + 'px' : value[i];
            }
        } else if ('dangerouslySetInnerHTML' === name) {
            if (value) node.innerHTML = value.__html || '';
        } else if ('o' == name[0] && 'n' == name[1]) {
            var l = node._listeners || (node._listeners = {});
            name = toLowerCase(name.substring(2));
            if (value) {
                if (!l[name]) node.addEventListener(name, eventProxy, !!NON_BUBBLING_EVENTS[name]);
            } else if (l[name]) node.removeEventListener(name, eventProxy, !!NON_BUBBLING_EVENTS[name]);
            l[name] = value;
        } else if ('list' !== name && 'type' !== name && !isSvg && name in node) {
            setProperty(node, name, null == value ? '' : value);
            if (null == value || value === !1) node.removeAttribute(name);
        } else {
            var ns = isSvg && name.match(/^xlink\:?(.+)/);
            if (null == value || value === !1) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(ns[1])); else node.removeAttribute(name); else if ('object' != typeof value && !isFunction(value)) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(ns[1]), value); else node.setAttribute(name, value);
        }
    }
    function setProperty(node, name, value) {
        try {
            node[name] = value;
        } catch (e) {}
    }
    function eventProxy(e) {
        return this._listeners[e.type](options.event && options.event(e) || e);
    }
    function collectNode(node) {
        removeNode(node);
        if (node instanceof Element) {
            node._component = node._componentConstructor = null;
            var _name = node.normalizedNodeName || toLowerCase(node.nodeName);
            (nodes[_name] || (nodes[_name] = [])).push(node);
        }
    }
    function createNode(nodeName, isSvg) {
        var name = toLowerCase(nodeName), node = nodes[name] && nodes[name].pop() || (isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName));
        node.normalizedNodeName = name;
        return node;
    }
    function flushMounts() {
        var c;
        while (c = mounts.pop()) {
            if (options.afterMount) options.afterMount(c);
            if (c.componentDidMount) c.componentDidMount();
        }
    }
    function diff(dom, vnode, context, mountAll, parent, componentRoot) {
        if (!diffLevel++) {
            isSvgMode = parent && void 0 !== parent.ownerSVGElement;
            hydrating = dom && !(ATTR_KEY in dom);
        }
        var ret = idiff(dom, vnode, context, mountAll);
        if (parent && ret.parentNode !== parent) parent.appendChild(ret);
        if (!--diffLevel) {
            hydrating = !1;
            if (!componentRoot) flushMounts();
        }
        return ret;
    }
    function idiff(dom, vnode, context, mountAll) {
        var ref = vnode && vnode.attributes && vnode.attributes.ref;
        while (isFunctionalComponent(vnode)) vnode = buildFunctionalComponent(vnode, context);
        if (null == vnode) vnode = '';
        if (isString(vnode)) {
            if (dom && dom instanceof Text && dom.parentNode) {
                if (dom.nodeValue != vnode) dom.nodeValue = vnode;
            } else {
                if (dom) recollectNodeTree(dom);
                dom = document.createTextNode(vnode);
            }
            return dom;
        }
        if (isFunction(vnode.nodeName)) return buildComponentFromVNode(dom, vnode, context, mountAll);
        var out = dom, nodeName = String(vnode.nodeName), prevSvgMode = isSvgMode, vchildren = vnode.children;
        isSvgMode = 'svg' === nodeName ? !0 : 'foreignObject' === nodeName ? !1 : isSvgMode;
        if (!dom) out = createNode(nodeName, isSvgMode); else if (!isNamedNode(dom, nodeName)) {
            out = createNode(nodeName, isSvgMode);
            while (dom.firstChild) out.appendChild(dom.firstChild);
            if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
            recollectNodeTree(dom);
        }
        var fc = out.firstChild, props = out[ATTR_KEY];
        if (!props) {
            out[ATTR_KEY] = props = {};
            for (var a = out.attributes, i = a.length; i--; ) props[a[i].name] = a[i].value;
        }
        if (!hydrating && vchildren && 1 === vchildren.length && 'string' == typeof vchildren[0] && fc && fc instanceof Text && !fc.nextSibling) {
            if (fc.nodeValue != vchildren[0]) fc.nodeValue = vchildren[0];
        } else if (vchildren && vchildren.length || fc) innerDiffNode(out, vchildren, context, mountAll, !!props.dangerouslySetInnerHTML);
        diffAttributes(out, vnode.attributes, props);
        if (ref) (props.ref = ref)(out);
        isSvgMode = prevSvgMode;
        return out;
    }
    function innerDiffNode(dom, vchildren, context, mountAll, absorb) {
        var j, c, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren && vchildren.length;
        if (len) for (var i = 0; i < len; i++) {
            var _child = originalChildren[i], props = _child[ATTR_KEY], key = vlen ? (c = _child._component) ? c.__key : props ? props.key : null : null;
            if (null != key) {
                keyedLen++;
                keyed[key] = _child;
            } else if (hydrating || absorb || props || _child instanceof Text) children[childrenLen++] = _child;
        }
        if (vlen) for (var i = 0; i < vlen; i++) {
            vchild = vchildren[i];
            child = null;
            var key = vchild.key;
            if (null != key) {
                if (keyedLen && key in keyed) {
                    child = keyed[key];
                    keyed[key] = void 0;
                    keyedLen--;
                }
            } else if (!child && min < childrenLen) for (j = min; j < childrenLen; j++) {
                c = children[j];
                if (c && isSameNodeType(c, vchild)) {
                    child = c;
                    children[j] = void 0;
                    if (j === childrenLen - 1) childrenLen--;
                    if (j === min) min++;
                    break;
                }
            }
            child = idiff(child, vchild, context, mountAll);
            if (child && child !== dom) if (i >= len) dom.appendChild(child); else if (child !== originalChildren[i]) {
                if (child === originalChildren[i + 1]) removeNode(originalChildren[i]);
                dom.insertBefore(child, originalChildren[i] || null);
            }
        }
        if (keyedLen) for (var i in keyed) if (keyed[i]) recollectNodeTree(keyed[i]);
        while (min <= childrenLen) {
            child = children[childrenLen--];
            if (child) recollectNodeTree(child);
        }
    }
    function recollectNodeTree(node, unmountOnly) {
        var component = node._component;
        if (component) unmountComponent(component, !unmountOnly); else {
            if (node[ATTR_KEY] && node[ATTR_KEY].ref) node[ATTR_KEY].ref(null);
            if (!unmountOnly) collectNode(node);
            var c;
            while (c = node.lastChild) recollectNodeTree(c, unmountOnly);
        }
    }
    function diffAttributes(dom, attrs, old) {
        var name;
        for (name in old) if (!(attrs && name in attrs) && null != old[name]) setAccessor(dom, name, old[name], old[name] = void 0, isSvgMode);
        if (attrs) for (name in attrs) if (!('children' === name || 'innerHTML' === name || name in old && attrs[name] === ('value' === name || 'checked' === name ? dom[name] : old[name]))) setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
    function collectComponent(component) {
        var name = component.constructor.name, list = components[name];
        if (list) list.push(component); else components[name] = [ component ];
    }
    function createComponent(Ctor, props, context) {
        var inst = new Ctor(props, context), list = components[Ctor.name];
        Component.call(inst, props, context);
        if (list) for (var i = list.length; i--; ) if (list[i].constructor === Ctor) {
            inst.nextBase = list[i].nextBase;
            list.splice(i, 1);
            break;
        }
        return inst;
    }
    function setComponentProps(component, props, opts, context, mountAll) {
        if (!component._disable) {
            component._disable = !0;
            if (component.__ref = props.ref) delete props.ref;
            if (component.__key = props.key) delete props.key;
            if (!component.base || mountAll) {
                if (component.componentWillMount) component.componentWillMount();
            } else if (component.componentWillReceiveProps) component.componentWillReceiveProps(props, context);
            if (context && context !== component.context) {
                if (!component.prevContext) component.prevContext = component.context;
                component.context = context;
            }
            if (!component.prevProps) component.prevProps = component.props;
            component.props = props;
            component._disable = !1;
            if (0 !== opts) if (1 === opts || options.syncComponentUpdates !== !1 || !component.base) renderComponent(component, 1, mountAll); else enqueueRender(component);
            if (component.__ref) component.__ref(component);
        }
    }
    function renderComponent(component, opts, mountAll, isChild) {
        if (!component._disable) {
            var skip, rendered, inst, cbase, props = component.props, state = component.state, context = component.context, previousProps = component.prevProps || props, previousState = component.prevState || state, previousContext = component.prevContext || context, isUpdate = component.base, nextBase = component.nextBase, initialBase = isUpdate || nextBase, initialChildComponent = component._component;
            if (isUpdate) {
                component.props = previousProps;
                component.state = previousState;
                component.context = previousContext;
                if (2 !== opts && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === !1) skip = !0; else if (component.componentWillUpdate) component.componentWillUpdate(props, state, context);
                component.props = props;
                component.state = state;
                component.context = context;
            }
            component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
            component._dirty = !1;
            if (!skip) {
                if (component.render) rendered = component.render(props, state, context);
                if (component.getChildContext) context = extend(clone(context), component.getChildContext());
                while (isFunctionalComponent(rendered)) rendered = buildFunctionalComponent(rendered, context);
                var toUnmount, base, childComponent = rendered && rendered.nodeName;
                if (isFunction(childComponent)) {
                    var childProps = getNodeProps(rendered);
                    inst = initialChildComponent;
                    if (inst && inst.constructor === childComponent && childProps.key == inst.__key) setComponentProps(inst, childProps, 1, context); else {
                        toUnmount = inst;
                        inst = createComponent(childComponent, childProps, context);
                        inst.nextBase = inst.nextBase || nextBase;
                        inst._parentComponent = component;
                        component._component = inst;
                        setComponentProps(inst, childProps, 0, context);
                        renderComponent(inst, 1, mountAll, !0);
                    }
                    base = inst.base;
                } else {
                    cbase = initialBase;
                    toUnmount = initialChildComponent;
                    if (toUnmount) cbase = component._component = null;
                    if (initialBase || 1 === opts) {
                        if (cbase) cbase._component = null;
                        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, !0);
                    }
                }
                if (initialBase && base !== initialBase && inst !== initialChildComponent) {
                    var baseParent = initialBase.parentNode;
                    if (baseParent && base !== baseParent) {
                        baseParent.replaceChild(base, initialBase);
                        if (!toUnmount) {
                            initialBase._component = null;
                            recollectNodeTree(initialBase);
                        }
                    }
                }
                if (toUnmount) unmountComponent(toUnmount, base !== initialBase);
                component.base = base;
                if (base && !isChild) {
                    var componentRef = component, t = component;
                    while (t = t._parentComponent) (componentRef = t).base = base;
                    base._component = componentRef;
                    base._componentConstructor = componentRef.constructor;
                }
            }
            if (!isUpdate || mountAll) mounts.unshift(component); else if (!skip) {
                if (component.componentDidUpdate) component.componentDidUpdate(previousProps, previousState, previousContext);
                if (options.afterUpdate) options.afterUpdate(component);
            }
            var fn, cb = component._renderCallbacks;
            if (cb) while (fn = cb.pop()) fn.call(component);
            if (!diffLevel && !isChild) flushMounts();
        }
    }
    function buildComponentFromVNode(dom, vnode, context, mountAll) {
        var c = dom && dom._component, originalComponent = c, oldDom = dom, isDirectOwner = c && dom._componentConstructor === vnode.nodeName, isOwner = isDirectOwner, props = getNodeProps(vnode);
        while (c && !isOwner && (c = c._parentComponent)) isOwner = c.constructor === vnode.nodeName;
        if (c && isOwner && (!mountAll || c._component)) {
            setComponentProps(c, props, 3, context, mountAll);
            dom = c.base;
        } else {
            if (originalComponent && !isDirectOwner) {
                unmountComponent(originalComponent, !0);
                dom = oldDom = null;
            }
            c = createComponent(vnode.nodeName, props, context);
            if (dom && !c.nextBase) {
                c.nextBase = dom;
                oldDom = null;
            }
            setComponentProps(c, props, 1, context, mountAll);
            dom = c.base;
            if (oldDom && dom !== oldDom) {
                oldDom._component = null;
                recollectNodeTree(oldDom);
            }
        }
        return dom;
    }
    function unmountComponent(component, remove) {
        if (options.beforeUnmount) options.beforeUnmount(component);
        var base = component.base;
        component._disable = !0;
        if (component.componentWillUnmount) component.componentWillUnmount();
        component.base = null;
        var inner = component._component;
        if (inner) unmountComponent(inner, remove); else if (base) {
            if (base[ATTR_KEY] && base[ATTR_KEY].ref) base[ATTR_KEY].ref(null);
            component.nextBase = base;
            if (remove) {
                removeNode(base);
                collectComponent(component);
            }
            var c;
            while (c = base.lastChild) recollectNodeTree(c, !remove);
        }
        if (component.__ref) component.__ref(null);
        if (component.componentDidUnmount) component.componentDidUnmount();
    }
    function Component(props, context) {
        this._dirty = !0;
        this.context = context;
        this.props = props;
        if (!this.state) this.state = {};
    }
    function render(vnode, parent, merge) {
        return diff(merge, vnode, {}, !1, parent);
    }
    var options = {};
    var stack = [];
    var EMPTY_CHILDREN = [];
    var lcCache = {};
    var toLowerCase = function(s) {
        return lcCache[s] || (lcCache[s] = s.toLowerCase());
    };
    var resolved = 'undefined' != typeof Promise && Promise.resolve();
    var defer = resolved ? function(f) {
        resolved.then(f);
    } : setTimeout;
    var EMPTY = {};
    var ATTR_KEY = 'undefined' != typeof Symbol ? Symbol.for('preactattr') : '__preactattr_';
    var NON_DIMENSION_PROPS = {
        boxFlex: 1,
        boxFlexGroup: 1,
        columnCount: 1,
        fillOpacity: 1,
        flex: 1,
        flexGrow: 1,
        flexPositive: 1,
        flexShrink: 1,
        flexNegative: 1,
        fontWeight: 1,
        lineClamp: 1,
        lineHeight: 1,
        opacity: 1,
        order: 1,
        orphans: 1,
        strokeOpacity: 1,
        widows: 1,
        zIndex: 1,
        zoom: 1
    };
    var NON_BUBBLING_EVENTS = {
        blur: 1,
        error: 1,
        focus: 1,
        load: 1,
        resize: 1,
        scroll: 1
    };
    var items = [];
    var nodes = {};
    var mounts = [];
    var diffLevel = 0;
    var isSvgMode = !1;
    var hydrating = !1;
    var components = {};
    extend(Component.prototype, {
        linkState: function(key, eventPath) {
            var c = this._linkedStates || (this._linkedStates = {});
            return c[key + eventPath] || (c[key + eventPath] = createLinkedState(this, key, eventPath));
        },
        setState: function(state, callback) {
            var s = this.state;
            if (!this.prevState) this.prevState = clone(s);
            extend(s, isFunction(state) ? state(s, this.props) : state);
            if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
            enqueueRender(this);
        },
        forceUpdate: function() {
            renderComponent(this, 2);
        },
        render: function() {}
    });
    exports.h = h;
    exports.cloneElement = cloneElement;
    exports.Component = Component;
    exports.render = render;
    exports.rerender = rerender;
    exports.options = options;
});
//# sourceMappingURL=preact.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return classNames;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMutableObject = isMutableObject;
exports.eachObject = eachObject;
exports.assign = assign;
var isFunction = exports.isFunction = function isFunction(x) {
  return typeof x === 'function';
};

function isMutableObject(target) {
  var Ctor = target.constructor;

  return !!target && Object.prototype.toString.call(target) === '[object Object]' && isFunction(Ctor) && !Object.isFrozen(target) && (Ctor instanceof Ctor || target.type === 'AltStore');
}

function eachObject(f, o) {
  o.forEach(function (from) {
    Object.keys(Object(from)).forEach(function (key) {
      f(key, from[key]);
    });
  });
}

function assign(target) {
  for (var _len = arguments.length, source = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    source[_key - 1] = arguments[_key];
  }

  eachObject(function (key, value) {
    return target[key] = value;
  }, source);
  return target;
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(47);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var Component, EVENT_REGEX, Slide, cn, h, isset, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

cn = __webpack_require__(1);

if (!Object.assign) {
  throw 'Object.assign not found, use polyfill';
}

if (!cn) {
  throw 'module "classnames" not installed';
}

isset = function(val) {
  return val !== null && val !== void 0;
};

EVENT_REGEX = new RegExp('^on[A-Z]');

Slide = (function(superClass) {
  extend(Slide, superClass);

  function Slide(props) {
    this.render = bind(this.render, this);
    this.onKeyDown = bind(this.onKeyDown, this);
    this.getOuterHW = bind(this.getOuterHW, this);
    this.getBeta = bind(this.getBeta, this);
    this.componentDidMount = bind(this.componentDidMount, this);
    this.getChildContext = bind(this.getChildContext, this);
    Slide.__super__.constructor.call(this, props);
    this.state = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }

  Slide.prototype.getChildContext = function() {
    return {
      vert: this.props.vert || this.props.vertical || false,
      dim: this.props.vert ? this.state.width : this.state.height
    };
  };

  Slide.prototype.setStateDim = function() {
    this.state.width = this._outer.clientWidth;
    return this.state.height = this._outer.clientHeight;
  };

  Slide.prototype.legacyProps = function(props) {
    if (isset(props.vertical)) {
      props.vert = props.vertical;
    }
    if (props.width) {
      props.w = props.width;
    }
    if (props.height) {
      props.h = props.height;
    }
    if (isset(props.innerClassName)) {
      props.iclass = props.innerClassName;
    }
    if (isset(props.outerClassName)) {
      props["class"] = props.outerClassName;
    }
    if (isset(props.className)) {
      return props["class"] = props.className;
    }
  };

  Slide.prototype.componentWillReceiveProps = function(props) {
    return this.legacyProps(props);
  };

  Slide.prototype.componentDidUpdate = function(p_props) {
    return this.updateSlidePos(this.checkSlideUpdate(p_props));
  };

  Slide.prototype.checkSlideUpdate = function(p_props) {
    var rect_height, rect_width;
    if (!this.props.slide) {
      return 0;
    }
    if (this.props.pos !== p_props.pos || this.props.index_offset !== p_props.index_offset || this.props.index_offset_beta !== p_props.index_offset_beta) {
      return 2;
    }
    rect_width = this.state.width;
    rect_height = this.state.height;
    this.setStateDim();
    if (this.props.vert && rect_height !== this.state.height) {
      return 1;
    }
    if (!this.props.vert && rect_width !== this.state.width) {
      return 1;
    }
    return 0;
  };

  Slide.prototype.getTransision = function() {
    return 'transform ' + this.props.ease_dur + 's ' + this.props.ease;
  };

  Slide.prototype.toXY = function(pos) {
    this.setState({
      transition: this.getTransision(),
      transform: 'matrix(1, 0, 0, 1, ' + String(-pos.x) + ', ' + String(-pos.y) + ')'
    });
    this.state.x = pos.x;
    return this.state.y = pos.y;
  };

  Slide.prototype.setXY = function(pos) {
    this.setState({
      transition: '',
      transform: 'matrix(1, 0, 0, 1, ' + String(-pos.x) + ', ' + String(-pos.y) + ')'
    });
    this.state.x = pos.x;
    return this.state.y = pos.y;
  };

  Slide.prototype.updateSlidePos = function(update_type) {
    if (!update_type) {
      return false;
    }
    this.setStateDim();
    if (update_type === 2) {
      this.toXY(this.getIndexXY(this.props.pos));
    }
    if (update_type === 1) {
      return this.setXY(this.getIndexXY(this.props.pos));
    }
  };

  Slide.prototype.passProps = function(props) {
    var prop, prop_name, results;
    this.pass_props = {};
    results = [];
    for (prop_name in props) {
      prop = props[prop_name];
      if (EVENT_REGEX.test(prop_name)) {
        results.push(this.pass_props[prop_name] = prop);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Slide.prototype.componentWillMount = function(props) {
    this.passProps(this.props);
    return this.legacyProps(this.props);
  };

  Slide.prototype.componentWillUnUnmount = function() {};

  Slide.prototype.getIndexXY = function(index) {
    var cc, last_child, max_x, max_y, x, y;
    if (!isset(index)) {
      throw new Error('index position is undefined');
    }
    if (index >= this.props.children.length) {
      throw new Error('index position out of bounds');
    }
    x = 0;
    y = 0;
    cc = this._inner.children[index];
    if (this.props.vert) {
      y = cc.offsetTop;
    } else {
      x = cc.offsetLeft;
    }
    if (isset(this.props.index_offset)) {
      if (this.props.vert) {
        y += this.props.index_offset;
      } else {
        x += this.props.index_offset;
      }
    }
    if (isset(this.props.index_offset_beta)) {
      if (this.props.vert) {
        y += this.state.height / 100 * this.props.index_offset_beta;
      } else {
        x += this.state.width / 100 * this.props.index_offset_beta;
      }
    }
    last_child = this._inner.children[this._inner.children.length - 1];
    max_y = Math.abs((last_child.offsetTop + last_child.clientHeight) - this.state.height);
    max_x = Math.abs((last_child.offsetLeft + last_child.clientWidth) - this.state.width);
    if (x > max_x) {
      x = max_x;
    }
    if (y > max_y) {
      y = max_y;
    }
    return {
      x: x,
      y: y
    };
  };

  Slide.prototype.componentDidMount = function() {
    if (this.props.slide && this.props.pos > 0) {
      this.setStateDim();
      return this.setXY(this.getIndexXY(this.props.pos));
    }
  };

  Slide.prototype.getBeta = function() {
    var beta, offs, sign;
    beta = this.props.beta + '%';
    if (this.props.offset) {
      sign = this.props.offset < 0 && '-' || '+';
      offs = Math.abs(this.props.offset) + 'px';
    } else if (this.props.offset_beta) {
      sign = this.props.offset_beta < 0 && '-' || '+';
      offs = Math.abs(this.props.offset_beta) + '%';
    }
    if (offs) {
      return 'calc(#{beta} #{sign} #{offs})';
    } else {
      return beta;
    }
  };

  Slide.prototype.getOuterHW = function() {
    var dim, height, ph, pw, width;
    if (this.props.square) {
      dim = {};
      if (this.props.vert) {
        dim.height = this.context.dim;
        dim.width = '100%';
      } else {
        dim.height = '100%';
        dim.width = this.context.dim;
      }
      return dim;
    }
    if (this.context.vert) {
      width = this.props.w || null;
      height = this.props.dim || this.props.h || null;
    } else {
      width = this.props.dim || this.props.w || null;
      height = this.props.h || null;
    }
    if (this.props.vert && this.props.auto) {
      ph = 'auto';
    } else if (typeof height === 'number') {
      ph = height + 'px';
    } else {
      ph = height;
    }
    if (!this.props.vert && this.props.auto) {
      pw = 'auto';
    } else if (typeof width === 'number') {
      pw = width + 'px';
    } else {
      pw = width;
    }
    if (this.context.vert) {
      pw = pw || '100%';
      ph = ph || this.getBeta();
    } else {
      pw = pw || this.getBeta();
      ph = ph || '100%';
    }
    return {
      height: ph,
      width: pw
    };
  };

  Slide.prototype.onKeyDown = function(e) {
    if (e.which === 13 && this.props.onEnter) {
      return this.props.onEnter();
    }
  };

  Slide.prototype.render = function() {
    var class_center, class_fixed, class_reverse, class_scroll, class_vert, inner, inner_props, outer, outer_class, slide;
    class_center = this.props.center && '-i-s-center' || null;
    class_vert = this.props.vert && '-i-s-vertical' || null;
    class_fixed = ((this.props.dim || this.props.w || this.props.h) && '-i-s-fixed') || null;
    class_reverse = this.props.reverse && '-i-s-reverse' || null;
    class_scroll = this.props.scroll && '-i-s-scroll' || null;
    if (this.props.slide) {
      outer_class = cn('-i-s-outer', this.props["class"], class_fixed);
      inner = this.props.children;
      outer = this.props.outer;
      inner_props = {
        ref: (function(_this) {
          return function(e) {
            return _this._inner = e;
          };
        })(this),
        style: {
          transition: this.state.transition,
          transform: this.state.transform
        },
        className: cn('-i-s-inner', class_vert, this.props.iclass, class_center)
      };
      slide = h('div', Object.assign({
        ref: (function(_this) {
          return function(e) {
            return _this._outer = e;
          };
        })(this),
        className: outer_class,
        onKeyDown: this.onKeyDown,
        style: this.getOuterHW()
      }, this.pass_props), [h('div', inner_props, inner), this.props.outer_children]);
    } else {
      outer_class = cn('-i-s-static', this.props["class"], class_fixed, class_vert, class_center, class_reverse, class_scroll);
      slide = h('div', Object.assign({
        ref: (function(_this) {
          return function(e) {
            return _this._outer = e;
          };
        })(this),
        onKeyDown: this.onKeyDown,
        style: this.getOuterHW(),
        className: outer_class
      }, this.pass_props), this.props.children, this.props.outer_children);
    }
    return slide;
  };

  return Slide;

})(Component);

Slide.defaultProps = {
  pos: 0,
  animate: false,
  offset: 0,
  slide: false,
  beta: 100,
  width: null,
  square: false,
  height: null,
  center: false,
  vert: false,
  inverse: false,
  dim: 0,
  scroll: false,
  w: 0,
  h: 0,
  ease: 'cubic-bezier(0.25, 0.34, 0, 1)',
  ease_dur: 0.4
};

module.exports = Slide;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getInternalMethods = getInternalMethods;
exports.getPrototypeChain = getPrototypeChain;
exports.warn = warn;
exports.uid = uid;
exports.formatAsConstant = formatAsConstant;
exports.dispatchIdentity = dispatchIdentity;
exports.fsa = fsa;
exports.dispatch = dispatch;

var _functions = __webpack_require__(2);

var fn = _interopRequireWildcard(_functions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/*eslint-disable*/
var builtIns = Object.getOwnPropertyNames(NoopClass);
var builtInProto = Object.getOwnPropertyNames(NoopClass.prototype);
/*eslint-enable*/

function getInternalMethods(Obj, isProto) {
  var excluded = isProto ? builtInProto : builtIns;
  var obj = isProto ? Obj.prototype : Obj;
  return Object.getOwnPropertyNames(obj).reduce(function (value, m) {
    if (excluded.indexOf(m) !== -1) {
      return value;
    }

    value[m] = obj[m];
    return value;
  }, {});
}

function getPrototypeChain(Obj) {
  var methods = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return Obj === Function.prototype ? methods : getPrototypeChain(Object.getPrototypeOf(Obj), fn.assign(getInternalMethods(Obj, true), methods));
}

function warn(msg) {
  /* istanbul ignore else */
  /*eslint-disable*/
  if (typeof console !== 'undefined') {
    console.warn(new ReferenceError(msg));
  }
  /*eslint-enable*/
}

function uid(container, name) {
  var count = 0;
  var key = name;
  while (Object.hasOwnProperty.call(container, key)) {
    key = name + String(++count);
  }
  return key;
}

function formatAsConstant(name) {
  return name.replace(/[a-z]([A-Z])/g, function (i) {
    return String(i[0]) + '_' + String(i[1].toLowerCase());
  }).toUpperCase();
}

function dispatchIdentity(x) {
  if (x === undefined) return null;

  for (var _len = arguments.length, a = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    a[_key - 1] = arguments[_key];
  }

  return a.length ? [x].concat(a) : x;
}

function fsa(id, type, payload, details) {
  return {
    type: type,
    payload: payload,
    meta: _extends({
      dispatchId: id
    }, details),

    id: id,
    action: type,
    data: payload,
    details: details
  };
}

function dispatch(id, actionObj, payload, alt) {
  var data = actionObj.dispatch(payload);
  if (data === undefined) return null;

  var type = actionObj.id;
  var namespace = type;
  var name = type;
  var details = { id: type, namespace: namespace, name: name };

  var dispatchLater = function dispatchLater(x) {
    return alt.dispatch(type, x, details);
  };

  if (fn.isFunction(data)) return data(dispatchLater, alt);

  // XXX standardize this
  return alt.dispatcher.dispatch(fsa(id, type, data, details));
}

/* istanbul ignore next */
function NoopClass() {}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var Actions, getPinWH, parseUrl, sendState, uploadImage, uuid;

uuid = __webpack_require__(13);

parseUrl = __webpack_require__(53);

uploadImage = function(form, res, rej, use_get) {
  return $.ajax({
    type: 'post',
    url: 'api/user/upload',
    data: form,
    contentType: false,
    processData: false,
    success: function(img) {
      return res(img);
    },
    error: function(xhr, type) {
      return actions.mergeState({
        error: xhr.response || 'error'
      });
    }
  });
};

sendState = function(opt) {
  return $.ajax({
    type: opt.type,
    url: opt.route,
    data: opt.type === 'post' && JSON.stringify(opt.state) || opt.state,
    dataType: 'json',
    contentType: 'application/json',
    timeout: 1000,
    success: actions.mergeState,
    error: function(xhr, type) {
      actions.mergeState({
        error: xhr.response
      });
      if (opt.rej) {
        return opt.rej(new Error('error'));
      }
    }
  });
};

getPinWH = function(width, height) {
  var h, w;
  w = 1;
  h = 1;
  if (width > height * 1.4) {
    w = 2;
  } else if (height > width * 1.4) {
    h = 2;
  }
  return {
    w: w,
    h: h
  };
};

Actions = (function() {
  function Actions() {}

  Actions.prototype.signup = function(state) {
    if (state.pass !== state.pass_confirm) {
      return this.showError('passwords dont match');
    }
    return sendState({
      type: 'post',
      route: 'api/auth/signup',
      state: {
        email: state.email,
        pass: state.pass
      }
    });
  };

  Actions.prototype.setView = function(state) {
    return state;
  };

  Actions.prototype.login = function(state) {
    return sendState({
      type: 'get',
      route: 'api/auth/local',
      state: {
        email: state.email,
        pass: state.pass
      }
    });
  };

  Actions.prototype.logout = function(state) {
    sendState({
      type: 'get',
      route: 'api/user/logout'
    });
    return this.hideModal();
  };

  Actions.prototype.goUserHome = function(state) {
    this.setView({
      show_todo: null
    });
    sendState({
      type: 'get',
      route: 'api/user'
    });
    return this.hideModal();
  };

  Actions.prototype.addTodo = function(state) {
    var route, todo;
    todo = {
      name: state.text,
      created_at: Date.now(),
      completed_at: null
    };
    if (state.parent_todo_id) {
      route = 'api/user/group/' + state.group_id + '/todo/' + state.parent_todo_id + '/addtodo';
    } else {
      route = 'api/user/group/' + state.group_id + '/addtodo';
    }
    sendState({
      type: 'post',
      route: route,
      state: todo
    });
    return this.hideModal();
  };

  Actions.prototype.editTodo = function(group_id, todo, state) {
    var route;
    if (todo.sub) {
      route = 'api/user/group/' + group_id + '/todo/' + todo.parent_id + '/subtodo/' + todo._id + '/set';
    } else {
      route = 'api/user/group/' + group_id + '/todo/' + todo._id + '/set';
    }
    sendState({
      type: 'post',
      route: route,
      state: state
    });
    return this.hideModal();
  };

  Actions.prototype.findFriend = function(name) {
    return sendState({
      type: 'get',
      route: 'api/user/find/user',
      state: {
        name: name
      }
    });
  };

  Actions.prototype.generateGroupLink = function(group_id) {
    return sendState({
      type: 'get',
      route: 'api/user/group/' + group_id + '/invite_link'
    });
  };

  Actions.prototype.setTodoState = function(index, state, sub_index) {
    return {
      index: index,
      sub_index: sub_index,
      state: state
    };
  };

  Actions.prototype.showAddPinModal = function(todo, sub_todo) {
    return {
      edit_todo: todo
    };
  };

  Actions.prototype.addPin = function(group_id, todo, form, state) {
    var img, link, route, url;
    state = Object.assign({}, state);
    delete state.files;
    if (todo.sub) {
      route = '/api/user/group/' + group_id + '/todo/' + todo.parent_id + '/subtodo/' + todo._id + '/addpin';
    } else {
      route = '/api/user/group/' + group_id + '/todo/' + todo._id + '/addpin';
    }
    if (state.type === 'link') {
      link = parseUrl(state.link);
      state.link_icon_img = 'http://www.google.com/s2/favicons?domain=' + link.host;
    }
    if (form.get('file')) {
      uploadImage(form, function(img) {
        state.img = img.img;
        state.thumb = img.thumb;
        return sendState({
          type: 'post',
          route: route,
          state: state
        });
      });
      url = URL.createObjectURL(form.get('file'));
      img = new Image();
      img.src = url;
      img.onload = function() {
        var dim;
        dim = getPinWH(img.width, img.height);
        return Object.assign(state, dim);
      };
    } else {
      sendState({
        type: 'post',
        route: route,
        state: state
      });
    }
    return this.hideModal();
  };

  Actions.prototype.setState = function(state) {
    return state;
  };

  Actions.prototype.mergeState = function(state) {
    return state;
  };

  Actions.prototype.showTodoEditModal = function(todo, sub_todo) {
    return {
      edit_todo: todo,
      edit_todo_sub: sub_todo
    };
  };

  Actions.prototype.removeTodo = function(group_id, todo_id, sub_todo_id) {
    var route;
    if (sub_todo_id) {
      route = 'api/user/group/' + group_id + '/todo/' + todo_id + '/subtodo/' + sub_todo_id + '/remove';
    } else {
      route = 'api/user/group/' + group_id + '/todo/' + todo_id + '/remove';
    }
    sendState({
      type: 'post',
      route: route
    });
    return this.hideModal();
  };

  Actions.prototype.showAddSubTodo = function(todo) {
    return {
      parent_todo: todo
    };
  };

  Actions.prototype.searchUsers = function(name) {
    return sendState({
      type: 'get',
      route: '/api/user/find/user',
      state: {
        name: name
      }
    });
  };

  Actions.prototype.setUser = function(state) {
    var form, user;
    if (state.file) {
      form = new FormData();
      form.append('file', state.file);
      return uploadImage(form, function(img) {
        var user;
        user = {
          name: state.name,
          img: img.img,
          thumb: img.thumb
        };
        return sendState({
          type: 'post',
          route: '/api/user/set',
          state: user
        });
      });
    } else {
      user = {
        name: state.name
      };
      return sendState({
        type: 'post',
        route: '/api/user/set',
        state: user
      });
    }
  };

  Actions.prototype.showGroup = function(id) {
    return sendState({
      type: 'get',
      route: 'api/user/group/' + id
    });
  };

  Actions.prototype.createGroup = function(state) {
    sendState({
      type: 'post',
      route: 'api/user/group/new',
      state: state
    });
    return this.hideModal();
  };

  Actions.prototype.editGroup = function(state, id) {
    sendState({
      type: 'post',
      route: 'api/user/group/' + id + '/set',
      state: state
    });
    return this.hideModal();
  };

  Actions.prototype.leaveGroup = function(id) {
    sendState({
      type: 'post',
      route: 'api/user/group/' + id + '/leave'
    });
    return this.hideModal();
  };

  Actions.prototype.sendState = function(state) {
    return function(dispatch) {
      return sendState(state, function(state) {
        return dispatch(state);
      }, function(error) {
        return dispatch({
          error: error.message
        });
      });
    };
  };

  Actions.prototype.setModal = function(content) {
    return content;
  };

  Actions.prototype.newPin = function(form) {
    var dim, img, link, pin, type;
    type = form.get('type');
    pin = {
      id: uuid(),
      type: type
    };
    if (type === 'photo') {
      pin.img = URL.createObjectURL(form.get('file'));
      img = new Image();
      img.src = pin.img;
      dim = getPinWH(img.naturalWidth, img.naturalHeight);
      Object.assign(pin, dim);
      pin.width = img.naturalWidth;
      pin.height = img.naturalHeight;
      pin.caption = form.get('caption');
    } else if (type === 'link') {
      link = form.get('link');
      link = parseUrl(link);
      pin.link = link;
      pin.link_icon_img = 'http://www.google.com/s2/favicons?domain=' + link.host;
    } else if (type === 'textsms') {
      pin.text = form.get('text');
    }
    return pin;
  };

  Actions.prototype.newGroupUser = function(form) {
    var user;
    user = {
      name: form.get('name')
    };
    form.append('id', user.id);
    return function(dispatch) {
      return uploadImage(form, function(got_user) {
        return dispatch(Object.assign(got_user, user));
      });
    };
  };

  Actions.prototype.showPins = function(id) {
    return {
      show_todo: id
    };
  };

  Actions.prototype.setRooomPass = function(pass) {
    return send({
      pass: pass
    }).then(function(ok) {
      return {
        ok: true
      };
    })["catch"](function(err) {
      return {
        error: err,
        ok: false
      };
    });
  };

  Actions.prototype.showSlides = function(opt) {
    return opt;
  };

  Actions.prototype.hideSide = function() {
    return true;
  };

  Actions.prototype.hideModal = function() {
    return true;
  };

  Actions.prototype.showTodoForm = function() {
    return true;
  };

  Actions.prototype.showError = function(message) {
    return message;
  };

  return Actions;

})();

module.exports = alt.createActions(Actions);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var Component, Input, cn, h, ref,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

__webpack_require__(11);

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

cn = __webpack_require__(1);

Input = (function(superClass) {
  extend(Input, superClass);

  function Input() {
    return Input.__super__.constructor.apply(this, arguments);
  }

  Input.prototype.render = function() {
    var children, icon, label;
    if (this.props.label) {
      label = h('span', {
        className: 'label'
      }, this.props.label);
    }
    if (this.props.icon) {
      icon = h('i', {
        className: 'material-icons'
      }, this.props.icon);
    }
    children = [icon, label].concat(this.props.children);
    return h('div', {
      ref: this.props.ref,
      onClick: this.props.onClick || this.props.onFocus,
      className: cn('-i-input', this.props.className, this.props.disabled && 'disabled')
    }, children);
  };

  return Input;

})(Component);

module.exports = Input;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var Component, Overlay, cn, h, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

__webpack_require__(52);

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

cn = __webpack_require__(1);

Overlay = (function(superClass) {
  extend(Overlay, superClass);

  function Overlay(props) {
    this.render = bind(this.render, this);
    Overlay.__super__.constructor.call(this, props);
  }

  Overlay.prototype.componentDidMount = function() {
    if (!(this._angle != null)) {
      return;
    }
    this.ctx = this._angle.getContext('2d');
    this._angle.height = 50;
    this._angle.width = 50;
    this.stage = {
      alpha: 1,
      alpha2: 1
    };
    this._overlay.addEventListener('mouseenter', (function(_this) {
      return function() {
        return _this.hover(true);
      };
    })(this));
    this._overlay.addEventListener('mouseleave', (function(_this) {
      return function() {
        return _this.hover(false);
      };
    })(this));
    this.ctx.translate(this._angle.width / 2 + 0.5, this._angle.height / 2 + 0.5);
    if (this.props.dir === 'right') {
      this.ctx.rotate(-Math.PI / 2);
    } else if (this.props.dir === 'left') {
      this.ctx.rotate(Math.PI / 2);
    } else if (this.props.dir === 'top') {
      this.ctx.rotate(-Math.PI);
    }
    this.ctx.translate(-this._angle.width / 2, -this._angle.height / 2);
    return this.renderAngle(this.stage.alpha, this.stage.alpha2);
  };

  Overlay.prototype.hover = function(enter) {
    if (this.ctx == null) {
      return;
    }
    return TweenLite.to(this.stage, 0.3, {
      ease: Power4.easeOut,
      alpha: enter && 0.8 || 1,
      alpha2: enter && 0.8 || 1,
      onUpdate: (function(_this) {
        return function() {
          return _this.renderAngle(_this.stage.alpha, _this.stage.alpha2);
        };
      })(this)
    });
  };

  Overlay.prototype.renderAngle = function(a, a2) {
    var angle, d, offset;
    this.ctx.clearRect(0, 0, 50, 50);
    this.ctx.lineWidth = 1.5;
    this.ctx.lineCap = 'square';
    this.ctx.lineJoin = 'square';
    this.ctx.strokeStyle = this.props.strokeStyle || 'rgba(255,255,255,0.7)';
    this.ctx.beginPath();
    angle = Math.PI / 2 * a;
    offset = -Math.PI / 2;
    d = 6;
    this.ctx.moveTo(25 + Math.cos(offset + angle) * 10, 25 + Math.sin(offset + angle) * 10);
    this.ctx.lineTo(25, 25);
    this.ctx.lineTo(25 + Math.cos(offset + -angle) * 10, 25 + Math.sin(offset + -angle) * 10);
    this.ctx.moveTo(25 + Math.cos(offset + angle) * 10, 25 + d + Math.sin(offset + angle) * 10);
    this.ctx.lineTo(25, 25 + d);
    this.ctx.lineTo(25 + Math.cos(offset + -angle) * 10, 25 + d + Math.sin(offset + -angle) * 10);
    return this.ctx.stroke();
  };

  Overlay.prototype.render = function() {
    var angle, pass_props;
    if ((this.props.dir != null) && !this.props.dir.match('top|bottom|left|right')) {
      throw new Error('Overlay bad direction property');
    }
    if (this.props.dir !== null && !this.props.disabled) {
      angle = h('canvas', {
        ref: (function(_this) {
          return function(e) {
            return _this._angle = e;
          };
        })(this),
        className: '-i-angle -i-angle-' + this.props.dir
      });
    }
    pass_props = Object.assign(this.props, {
      onKeyDown: (function(_this) {
        return function(e) {
          if (e.keyCode === 27) {
            return _this.props.onClick && _this.props.onClick();
          }
        };
      })(this),
      ref: (function(_this) {
        return function(e) {
          return _this._overlay = e;
        };
      })(this),
      style: {
        pointerEvents: this.props.show && 'all' || 'none',
        opacity: this.props.show && 1 || 0
      },
      className: '-i-overlay ' + (this.props.className || '')
    });
    return h('div', pass_props, angle, this.props.children);
  };

  return Overlay;

})(Component);

Overlay.defaultProps = {
  dir: 'bottom'
};

module.exports = Overlay;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var Button, Component, Slide, cn, h, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

__webpack_require__(48);

Slide = __webpack_require__(5);

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

cn = __webpack_require__(1);

Button = (function(superClass) {
  extend(Button, superClass);

  function Button() {
    this.getChildContext = bind(this.getChildContext, this);
    return Button.__super__.constructor.apply(this, arguments);
  }

  Button.prototype.getChildContext = function() {
    return {
      vert: this.context.vert,
      dim: this.context.dim
    };
  };

  Button.prototype.render = function() {
    var i, label, style;
    if (this.props.label) {
      label = h('span', {
        className: 'label'
      }, this.props.label);
    }
    if (this.props.i) {
      i = h('i', {
        className: 'material-icons'
      }, this.props.i);
    }
    if (this.props.dim || this.props.width || this.props.height) {
      style = {
        width: (this.props.width || this.props.dim) + 'px',
        height: (this.props.height || this.props.dim) + 'px'
      };
    }
    return h(Slide, Object.assign({}, this.props, {
      center: true,
      "class": cn('-i-btn', this.props.big && 'big', this.props.square && 'square', this.props["class"], this.props.disabled && 'disabled')
    }), this.props.pre, i, label);
  };

  return Button;

})(Component);

module.exports = Button;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./Input.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./Input.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function transmitter() {
  var subscriptions = [];
  var nowDispatching = false;
  var toUnsubscribe = {};

  var unsubscribe = function unsubscribe(onChange) {
    var id = subscriptions.indexOf(onChange);
    if (id < 0) return;
    if (nowDispatching) {
      toUnsubscribe[id] = onChange;
      return;
    }
    subscriptions.splice(id, 1);
  };

  var subscribe = function subscribe(onChange) {
    var id = subscriptions.push(onChange);
    var dispose = function dispose() {
      return unsubscribe(onChange);
    };
    return { dispose: dispose };
  };

  var publish = function publish() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    nowDispatching = true;
    try {
      subscriptions.forEach(function (subscription, id) {
        return toUnsubscribe[id] || subscription.apply(undefined, args);
      });
    } finally {
      nowDispatching = false;
      Object.keys(toUnsubscribe).forEach(function (id) {
        return unsubscribe(toUnsubscribe[id]);
      });
      toUnsubscribe = {};
    }
  };

  return {
    publish: publish,
    subscribe: subscribe,
    $subscriptions: subscriptions
  };
}

module.exports = transmitter;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(55);
var bytesToUuid = __webpack_require__(54);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

ONE_SECOND = 1000
ONE_MINUTE = ONE_SECOND*60
ONE_HOUR = ONE_MINUTE*60
ONE_DAY = ONE_HOUR*24
window.log = console.log

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

window.copyToClipboard = function(text) {
  // IE specific
  if (window.clipboardData && window.clipboardData.setData) {
    return clipboardData.setData("Text", text);
  }

  // all other modern
  target = document.createElement("textarea");
  target.style.position = "absolute";
  target.style.left = "-9999px";
  target.style.top = "0";
  target.textContent = text;
  document.body.appendChild(target);
  target.focus();
  target.setSelectionRange(0, target.value.length);

  // copy the selection of fall back to prompt
  try {
    document.execCommand("copy");
    target.remove();
    console.log('Copied to clipboard: "'+text+'"');
  } catch(e) {
    console.log("Can't copy string on this browser. Try to use Chrome, Firefox or Opera.")
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
  }
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flux = __webpack_require__(42);

var _StateFunctions = __webpack_require__(25);

var StateFunctions = _interopRequireWildcard(_StateFunctions);

var _functions = __webpack_require__(2);

var fn = _interopRequireWildcard(_functions);

var _store = __webpack_require__(24);

var store = _interopRequireWildcard(_store);

var _AltUtils = __webpack_require__(6);

var utils = _interopRequireWildcard(_AltUtils);

var _actions = __webpack_require__(21);

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* global window */


var Alt = function () {
  function Alt() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Alt);

    this.config = config;
    this.serialize = config.serialize || JSON.stringify;
    this.deserialize = config.deserialize || JSON.parse;
    this.dispatcher = config.dispatcher || new _flux.Dispatcher();
    this.batchingFunction = config.batchingFunction || function (callback) {
      return callback();
    };
    this.actions = { global: {} };
    this.stores = {};
    this.storeTransforms = config.storeTransforms || [];
    this.trapAsync = false;
    this._actionsRegistry = {};
    this._initSnapshot = {};
    this._lastSnapshot = {};
  }

  Alt.prototype.dispatch = function () {
    function dispatch(action, data, details) {
      var _this = this;

      this.batchingFunction(function () {
        var id = Math.random().toString(18).substr(2, 16);

        // support straight dispatching of FSA-style actions
        if (action.hasOwnProperty('type') && action.hasOwnProperty('payload')) {
          var fsaDetails = {
            id: action.type,
            namespace: action.type,
            name: action.type
          };
          return _this.dispatcher.dispatch(utils.fsa(id, action.type, action.payload, fsaDetails));
        }

        if (action.id && action.dispatch) {
          return utils.dispatch(id, action, data, _this);
        }

        return _this.dispatcher.dispatch(utils.fsa(id, action, data, details));
      });
    }

    return dispatch;
  }();

  Alt.prototype.createUnsavedStore = function () {
    function createUnsavedStore(StoreModel) {
      var key = StoreModel.displayName || '';
      store.createStoreConfig(this.config, StoreModel);
      var Store = store.transformStore(this.storeTransforms, StoreModel);

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return fn.isFunction(Store) ? store.createStoreFromClass.apply(store, [this, Store, key].concat(args)) : store.createStoreFromObject(this, Store, key);
    }

    return createUnsavedStore;
  }();

  Alt.prototype.createStore = function () {
    function createStore(StoreModel, iden) {
      var key = iden || StoreModel.displayName || StoreModel.name || '';
      store.createStoreConfig(this.config, StoreModel);
      var Store = store.transformStore(this.storeTransforms, StoreModel);

      /* istanbul ignore next */
      if (false) delete this.stores[key];

      if (this.stores[key] || !key) {
        if (this.stores[key]) {
          utils.warn('A store named ' + String(key) + ' already exists, double check your store ' + 'names or pass in your own custom identifier for each store');
        } else {
          utils.warn('Store name was not specified');
        }

        key = utils.uid(this.stores, key);
      }

      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      var storeInstance = fn.isFunction(Store) ? store.createStoreFromClass.apply(store, [this, Store, key].concat(args)) : store.createStoreFromObject(this, Store, key);

      this.stores[key] = storeInstance;
      StateFunctions.saveInitialSnapshot(this, key);

      return storeInstance;
    }

    return createStore;
  }();

  Alt.prototype.generateActions = function () {
    function generateActions() {
      var actions = { name: 'global' };

      for (var _len3 = arguments.length, actionNames = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        actionNames[_key3] = arguments[_key3];
      }

      return this.createActions(actionNames.reduce(function (obj, action) {
        obj[action] = utils.dispatchIdentity;
        return obj;
      }, actions));
    }

    return generateActions;
  }();

  Alt.prototype.createAction = function () {
    function createAction(name, implementation, obj) {
      return (0, _actions2['default'])(this, 'global', name, implementation, obj);
    }

    return createAction;
  }();

  Alt.prototype.createActions = function () {
    function createActions(ActionsClass) {
      var _this3 = this;

      var exportObj = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var actions = {};
      var key = utils.uid(this._actionsRegistry, ActionsClass.displayName || ActionsClass.name || 'Unknown');

      if (fn.isFunction(ActionsClass)) {
        fn.assign(actions, utils.getPrototypeChain(ActionsClass));

        var ActionsGenerator = function (_ActionsClass) {
          _inherits(ActionsGenerator, _ActionsClass);

          function ActionsGenerator() {
            _classCallCheck(this, ActionsGenerator);

            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
              args[_key5] = arguments[_key5];
            }

            return _possibleConstructorReturn(this, _ActionsClass.call.apply(_ActionsClass, [this].concat(args)));
          }

          ActionsGenerator.prototype.generateActions = function () {
            function generateActions() {
              for (var _len6 = arguments.length, actionNames = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                actionNames[_key6] = arguments[_key6];
              }

              actionNames.forEach(function (actionName) {
                actions[actionName] = utils.dispatchIdentity;
              });
            }

            return generateActions;
          }();

          return ActionsGenerator;
        }(ActionsClass);

        for (var _len4 = arguments.length, argsForConstructor = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
          argsForConstructor[_key4 - 2] = arguments[_key4];
        }

        fn.assign(actions, new (Function.prototype.bind.apply(ActionsGenerator, [null].concat(argsForConstructor)))());
      } else {
        fn.assign(actions, ActionsClass);
      }

      this.actions[key] = this.actions[key] || {};

      fn.eachObject(function (actionName, action) {
        if (!fn.isFunction(action)) {
          exportObj[actionName] = action;
          return;
        }

        // create the action
        exportObj[actionName] = (0, _actions2['default'])(_this3, key, actionName, action, exportObj);

        // generate a constant
        var constant = utils.formatAsConstant(actionName);
        exportObj[constant] = exportObj[actionName].id;
      }, [actions]);

      return exportObj;
    }

    return createActions;
  }();

  Alt.prototype.takeSnapshot = function () {
    function takeSnapshot() {
      for (var _len7 = arguments.length, storeNames = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        storeNames[_key7] = arguments[_key7];
      }

      var state = StateFunctions.snapshot(this, storeNames);
      fn.assign(this._lastSnapshot, state);
      return this.serialize(state);
    }

    return takeSnapshot;
  }();

  Alt.prototype.rollback = function () {
    function rollback() {
      StateFunctions.setAppState(this, this.serialize(this._lastSnapshot), function (storeInst) {
        storeInst.lifecycle('rollback');
        storeInst.emitChange();
      });
    }

    return rollback;
  }();

  Alt.prototype.recycle = function () {
    function recycle() {
      for (var _len8 = arguments.length, storeNames = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        storeNames[_key8] = arguments[_key8];
      }

      var initialSnapshot = storeNames.length ? StateFunctions.filterSnapshots(this, this._initSnapshot, storeNames) : this._initSnapshot;

      StateFunctions.setAppState(this, this.serialize(initialSnapshot), function (storeInst) {
        storeInst.lifecycle('init');
        storeInst.emitChange();
      });
    }

    return recycle;
  }();

  Alt.prototype.flush = function () {
    function flush() {
      var state = this.serialize(StateFunctions.snapshot(this));
      this.recycle();
      return state;
    }

    return flush;
  }();

  Alt.prototype.bootstrap = function () {
    function bootstrap(data) {
      StateFunctions.setAppState(this, data, function (storeInst, state) {
        storeInst.lifecycle('bootstrap', state);
        storeInst.emitChange();
      });
    }

    return bootstrap;
  }();

  Alt.prototype.prepare = function () {
    function prepare(storeInst, payload) {
      var data = {};
      if (!storeInst.displayName) {
        throw new ReferenceError('Store provided does not have a name');
      }
      data[storeInst.displayName] = payload;
      return this.serialize(data);
    }

    return prepare;
  }();

  // Instance type methods for injecting alt into your application as context

  Alt.prototype.addActions = function () {
    function addActions(name, ActionsClass) {
      for (var _len9 = arguments.length, args = Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
        args[_key9 - 2] = arguments[_key9];
      }

      this.actions[name] = Array.isArray(ActionsClass) ? this.generateActions.apply(this, ActionsClass) : this.createActions.apply(this, [ActionsClass].concat(args));
    }

    return addActions;
  }();

  Alt.prototype.addStore = function () {
    function addStore(name, StoreModel) {
      for (var _len10 = arguments.length, args = Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) {
        args[_key10 - 2] = arguments[_key10];
      }

      this.createStore.apply(this, [StoreModel, name].concat(args));
    }

    return addStore;
  }();

  Alt.prototype.getActions = function () {
    function getActions(name) {
      return this.actions[name];
    }

    return getActions;
  }();

  Alt.prototype.getStore = function () {
    function getStore(name) {
      return this.stores[name];
    }

    return getStore;
  }();

  Alt.debug = function () {
    function debug(name, alt, win) {
      var key = 'alt.js.org';
      var context = win;
      if (!context && typeof window !== 'undefined') {
        context = window;
      }
      if (typeof context !== 'undefined') {
        context[key] = context[key] || [];
        context[key].push({ name: name, alt: alt });
      }
      return alt;
    }

    return debug;
  }();

  return Alt;
}();

exports['default'] = Alt;
module.exports = exports['default'];

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var AppStore, actions, fillData, isset, key, ref, syncFromLocal, syncToLocal, sync_local, updateCount, updateDates, updateIndices, uuid, val;

actions = __webpack_require__(7);

uuid = __webpack_require__(13);

window.initial_state = {
  error: null,
  group: null,
  user: null,
  view: {
    main_view: 'home',
    side_view: 'pins',
    show_todo: null,
    slideshow_pin: null,
    show_more_right: false,
    search_users: []
  }
};

sync_local = {
  group_name: String,
  group_id: String,
  group_pass: String,
  side_view: String
};

syncFromLocal = function(state) {
  var k, key, len, results, val;
  results = [];
  for (val = k = 0, len = sync_local.length; k < len; val = ++k) {
    key = sync_local[val];
    if (isset(localStorage.state[key])) {
      results.push(state.view[key] = val(localStorage.state[key]));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

syncToLocal = function(state) {
  var k, key, len, results, val;
  results = [];
  for (val = k = 0, len = sync_local.length; k < len; val = ++k) {
    key = sync_local[val];
    if (isset(state[key])) {
      results.push(localStorage[key] = state[key]);
    } else {
      results.push(void 0);
    }
  }
  return results;
};

isset = function(val) {
  if (val === null || val === void 0 || val === (0/0)) {
    return false;
  }
  return true;
};

updateDates = function(list) {
  var k, len, ref, results, sub, todo;
  ref = list.state.todos;
  results = [];
  for (k = 0, len = ref.length; k < len; k++) {
    todo = ref[k];
    if (!(todo.completed_at instanceof Date) && (todo.completed_at != null)) {
      todo.completed_at = new Date(todo.completed_at);
    }
    if (!(todo.created_at instanceof Date) && (todo.created_at != null)) {
      todo.created_at = new Date(todo.created_at);
    } else {
      todo.created_at = new Date(0);
    }
    results.push((function() {
      var l, len1, ref1, results1;
      ref1 = todo.todos;
      results1 = [];
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        sub = ref1[l];
        sub.sub = true;
        sub.parent_id = todo._id;
        sub.parent_name = todo.name;
        if (!(sub.completed_at instanceof Date) && (sub.completed_at != null)) {
          sub.completed_at = new Date(sub.completed_at);
        }
        if (!(sub.created_at instanceof Date) && (sub.created_at != null)) {
          results1.push(sub.created_at = new Date(sub.created_at));
        } else {
          results1.push(sub.created_at = new Date(0));
        }
      }
      return results1;
    })());
  }
  return results;
};

updateIndices = function(group) {
  var i, j, k, len, ref, results, sub_todo, todo;
  ref = group.state.todos;
  results = [];
  for (i = k = 0, len = ref.length; k < len; i = ++k) {
    todo = ref[i];
    todo.index = i;
    results.push((function() {
      var l, len1, ref1, results1;
      ref1 = todo.todos;
      results1 = [];
      for (j = l = 0, len1 = ref1.length; l < len1; j = ++l) {
        sub_todo = ref1[j];
        results1.push(sub_todo.index = j);
      }
      return results1;
    })());
  }
  return results;
};

updateCount = function(list) {
  var k, len, ref, todo;
  list.total_count = list.state.todos.length;
  list.done_count = 0;
  ref = list.state.todos;
  for (k = 0, len = ref.length; k < len; k++) {
    todo = ref[k];
    if (!!todo.completed_at) {
      list.done_count += 1;
    }
  }
  return list;
};

window.state = window.server_state || {};

ref = window.server_state;
for (key in ref) {
  val = ref[key];
  if (!val) {
    continue;
  }
  window.initial_state[key] = Object.assign({}, window.initial_state[key], val);
}

fillData = function(state) {
  var g, k, l, len, len1, len2, len3, m, n, ref1, ref2, ref3, ref4, results, sub, todo;
  console.log('FILL DATA');
  if (state.group) {
    updateCount(state.group);
    updateDates(state.group);
    updateIndices(state.group);
  }
  if (state.user) {
    ref1 = state.user.groups;
    for (k = 0, len = ref1.length; k < len; k++) {
      g = ref1[k];
      ref2 = g.state.todos;
      for (l = 0, len1 = ref2.length; l < len1; l++) {
        todo = ref2[l];
        if (state.view.show_todo && todo._id === state.view.show_todo._id) {
          state.view.show_todo = todo;
          break;
        }
        ref3 = todo.todos;
        for (m = 0, len2 = ref3.length; m < len2; m++) {
          sub = ref3[m];
          if (state.view.show_todo && sub._id === state.view.show_todo._id) {
            state.view.show_todo = sub;
            break;
          }
        }
      }
      updateDates(g);
      updateCount(g);
      updateIndices(g);
    }
  }
  if (state.group) {
    updateDates(state.group);
    updateCount(state.group);
    updateIndices(state.group);
    ref4 = state.group.state.todos;
    results = [];
    for (n = 0, len3 = ref4.length; n < len3; n++) {
      todo = ref4[n];
      if (state.view.show_todo && todo._id === state.view.show_todo._id) {
        state.view.show_todo = todo;
        break;
      }
      results.push((function() {
        var len4, o, ref5, results1;
        ref5 = todo.todos;
        results1 = [];
        for (o = 0, len4 = ref5.length; o < len4; o++) {
          sub = ref5[o];
          if (state.view.show_todo && sub._id === state.view.show_todo._id) {
            state.view.show_todo = sub;
            break;
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    }
    return results;
  }
};

fillData(window.initial_state);

AppStore = (function() {
  function AppStore() {
    this.bindListeners({
      hideSide: actions.hideSide,
      hideModal: actions.hideModal,
      setModal: actions.setModal,
      setTodoState: actions.setTodoState,
      showPins: actions.showPins,
      showSlides: actions.showSlides,
      setState: actions.setState,
      mergeState: actions.mergeState,
      newPin: actions.newPin,
      showAddSubTodo: actions.showAddSubTodo,
      showError: actions.showError,
      showAddPinModal: actions.showAddPinModal,
      showTodoEditModal: actions.showTodoEditModal,
      setView: actions.setView
    });
    this.state = initial_state;
  }

  AppStore.prototype.setView = function(view) {
    Object.assign(this.state.view, view);
    return this.setState();
  };

  AppStore.prototype.showTodoEditModal = function(view) {
    Object.assign(this.state.view, view);
    this.state.view.modal_content = 'editTodo';
    this.state.view.show_modal = true;
    return this.setState();
  };

  AppStore.prototype.showAddSubTodo = function(view) {
    this.state.view.parent_todo = view.parent_todo;
    this.state.view.show_modal = true;
    this.state.view.modal_content = 'addTodo';
    return this.setState();
  };

  AppStore.prototype.showAddPinModal = function(view) {
    Object.assign(this.state.view, view);
    this.state.view.modal_content = 'addPin';
    this.state.view.show_modal = true;
    return this.setState();
  };

  AppStore.prototype.showPins = function(view) {
    Object.assign(this.state.view, view);
    return this.setState({
      side_view: 'pins'
    });
  };

  AppStore.prototype.showError = function(error) {
    return this.setState({
      error: error
    });
  };

  AppStore.prototype.mergeState = function(new_state) {
    if (new_state.view) {
      this.state.view = Object.assign({}, this.state.view, new_state.view);
    }
    if (new_state.group) {
      this.state.group = Object.assign({}, this.state.group, new_state.group);
    }
    if (new_state.error) {
      this.state.error = new_state.error;
    }
    if (new_state.user) {
      this.state.user = Object.assign({}, this.state.user, new_state.user);
    }
    fillData(this.state);
    return this.setState();
  };

  AppStore.prototype.setMyUser = function(user) {
    localStorage.my_user_index = user.index;
    localStorage.my_user_id = user.id;
    return this.setState({
      my_user_id: user.id,
      my_user_index: user.index
    });
  };

  AppStore.prototype.hideSide = function(index) {
    return this.setState({
      side_view: null
    });
  };

  AppStore.prototype.editListItem = function(props) {
    return this.setState({
      edit_list: props,
      modal_content: 'listSettings',
      show_modal: true
    });
  };

  AppStore.prototype.sendState = function(opt) {
    return this.setState(opt);
  };

  AppStore.prototype.newPin = function(opt) {
    if (opt.sub_index) {
      this.state.group_state.lists[this.state.show_list].todos[opt.index].todos[opt.sub_index].pins.push(opt.pin);
    } else {
      this.state.group_state.lists[this.state.show_list].todos[opt.index].pins.push(opt.pin);
    }
    return this.setState();
  };

  AppStore.prototype.showSlides = function(opt) {
    Object.assign(this.state.view, {
      slideshow_pins: opt.pins,
      slideshow_pin: opt.pin,
      show_modal: true,
      modal_content: 'slideshow'
    });
    return this.setState();
  };

  AppStore.prototype.editTodoSave = function(opt) {
    if (isset(opt.sub_index)) {
      Object.assign(this.state.group_state.lists[this.state.show_list].todos[opt.index].todos[opt.sub_index], opt.state);
    } else {
      Object.assign(this.state.group_state.lists[this.state.show_list].todos[opt.index], opt.state);
    }
    updateCount(this.state.group_state.lists[this.state.show_list]);
    updateDates(this.state.group_state.lists[this.state.show_list]);
    updateIndices(this.state.group_state.lists[this.state.show_list]);
    return this.hideModal();
  };

  AppStore.prototype.setModal = function(content) {
    Object.assign(this.state.view, {
      modal_content: content,
      show_modal: true,
      show_more_right: false
    });
    return this.setState();
  };

  AppStore.prototype.addPin = function(todo) {
    return this.setTodoState(todo);
  };

  AppStore.prototype.newGroupUser = function(user) {
    this.state.group_state.users.push(user);
    this.setState({
      show_modal: false,
      modal_content: null
    });
    return this.setMyUser(user);
  };

  AppStore.prototype.hideModal = function() {
    Object.assign(this.state.view, {
      edit_todo: null,
      parent_todo: null,
      edit_todo_sub: null,
      modal_content: null,
      show_more_right: false,
      show_modal: false
    });
    return this.setState();
  };

  AppStore.prototype.setTodoState = function(opt) {
    var k, len, ok, ref1, todo;
    console.log('setTodoState');
    if (opt.state.todos && opt.state.todos.length) {
      log('TODOS');
      ok = true;
      ref1 = opt.state.todos;
      for (k = 0, len = ref1.length; k < len; k++) {
        todo = ref1[k];
        log(todo.completed_at);
        if (!(todo.completed_at instanceof Date)) {
          ok = false;
          break;
        }
      }
      if (ok === true) {
        opt.state.completed_at = new Date();
      } else {
        opt.state.completed_at = null;
      }
    }
    Object.assign(this.state.group_state.lists[this.state.show_list].todos[opt.index], opt.state);
    updateCount(this.state.group_state.lists[this.state.show_list]);
    updateDates(this.state.group_state.lists[this.state.show_list]);
    updateIndices(this.state.group_state.lists[this.state.show_list]);
    return this.setState();
  };

  return AppStore;

})();

module.exports = alt.createStore(AppStore, 'AppStore');


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var AddFriendView, Button, Check, Component, CreateGroupForm, EditGroupForm, ExpandBtn, Grid, GridItem, GroupView, HomeView, InputFile, InputText, InputTextArea, LinkGroup, ListItemView, MAX_NAME_LENGTH, MainView, Menu, Modal, ModalView, Overlay, Pin, PinsView, Slide, SlideButton, SlideShow, Slideshow, Todo, User, UserAuthView, UserLoginView, UserSettings, UserSignupView, UserView, UserViewGroupItem, Viewer, addPinForm, addTodoForm, cn, connectToStores, doneColor, doneText, editTodoForm, h, monthNames, ref, ref1, sortUsers, stat,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

Slide = __webpack_require__(5);

Overlay = __webpack_require__(9);

Button = __webpack_require__(10);

InputFile = __webpack_require__(29);

InputText = __webpack_require__(30);

InputTextArea = __webpack_require__(31);

Modal = __webpack_require__(32);

ref1 = __webpack_require__(28), Grid = ref1.Grid, GridItem = ref1.GridItem;

SlideButton = __webpack_require__(33);

monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

Viewer = __webpack_require__(27);

cn = __webpack_require__(1);

sortUsers = function(users) {
  return users.sort(function(a, b) {
    if (a.attributes._id === store.state.user._id) {
      return false;
    } else if (b.attributes._id === store.state.user._id) {
      return true;
    }
  });
};

doneColor = function(count, total) {
  var f;
  f = 255 - Math.floor(count / total * 150);
  return 'rgb(' + 255 + ',' + f + ',' + f + ')';
};

doneText = function(count, total) {
  if (!count && !total) {
    return null;
  }
  return h('div', {
    style: {}
  }, h('span', {
    style: {
      color: doneColor(count, total)
    }
  }, count), h('span', {
    style: {
      opacity: 0.5
    }
  }, '/'), h('span', {
    style: {
      color: doneColor(total, total)
    }
  }, total));
};

connectToStores = __webpack_require__(20);

editTodoForm = (function(superClass) {
  extend(editTodoForm, superClass);

  function editTodoForm(props) {
    this.render = bind(this.render, this);
    this.save = bind(this.save, this);
    var val;
    editTodoForm.__super__.constructor.call(this, props);
    val = props.view.edit_todo.name;
    if (props.view.edit_todo_sub) {
      val = props.view.edit_todo_sub.name;
    }
    this.state = {
      todo_id: props.view.edit_todo._id,
      sub_todo_id: props.view.edit_todo_sub && props.view.edit_todo_sub._id,
      initial_name: val,
      name: val
    };
  }

  editTodoForm.prototype.componentDidMount = function() {
    return this._input.focus();
  };

  editTodoForm.prototype.save = function(e) {
    actions.editTodo(store.state.group._id, this.props.view.edit_todo, this.state);
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  editTodoForm.prototype.render = function(props) {
    var edit_todo;
    edit_todo = props.view.edit_todo_sub && props.view.edit_todo_sub || props.view.edit_todo;
    return h('form', {
      onSubmit: this.save,
      className: 'form'
    }, h('div', {
      className: 'title'
    }, 'edit todo'), h(InputText, {
      onInput: (function(_this) {
        return function(e) {
          return _this.setState({
            name: e.target.value
          });
        };
      })(this),
      ref: (function(_this) {
        return function(e) {
          return _this._input = e;
        };
      })(this),
      type: 'text',
      label: 'name',
      value: this.state.name
    }), h(SlideButton, {
      outerClassName: 'input-amount-submit full-w',
      reverse: true,
      disabled: this.state.name === this.state.initial_name,
      sClass: this.state.name && 'input-amount-submit-s' || 'input-amount-submit-false',
      pClass: 'input-amount-submit-p',
      height: g.dim,
      vertical: true,
      onClick: this.save,
      label: 'save'
    }), h(Button, {
      height: g.dim,
      width: g.dim,
      className: 'error btn',
      onClick: (function(_this) {
        return function() {
          return actions.removeTodo(store.state.group._id, props.view.edit_todo && props.view.edit_todo._id, props.view.edit_todo_sub && props.view.edit_todo_sub._id);
        };
      })(this),
      name: this.state.name,
      i: 'remove_circle_outline'
    }));
  };

  return editTodoForm;

})(Component);

addTodoForm = (function(superClass) {
  extend(addTodoForm, superClass);

  function addTodoForm(props) {
    this.render = bind(this.render, this);
    addTodoForm.__super__.constructor.call(this, props);
    this.state = {
      text: null,
      group_id: props.group._id,
      parent_todo_id: props.view.parent_todo && props.view.parent_todo._id
    };
  }

  addTodoForm.prototype.componentDidMount = function() {
    return this._input.focus();
  };

  addTodoForm.prototype.render = function() {
    var parent_label;
    if (this.props.view.parent_todo) {
      parent_label = h('span', {
        className: 'modal-label'
      }, h('span', {
        className: 'modal-label-pre'
      }, 'parent: '), this.props.view.parent_todo.name);
    }
    return h('form', {
      onSubmit: (function(_this) {
        return function(e) {
          actions.addTodo(_this.state);
          e.preventDefault();
          return false;
        };
      })(this),
      className: 'form'
    }, h('div', {
      className: 'title'
    }, 'add todo to ' + this.props.group.name), parent_label, h(InputText, {
      onInput: (function(_this) {
        return function(e) {
          return _this.setState({
            text: e.target.value
          });
        };
      })(this),
      ref: (function(_this) {
        return function(e) {
          return _this._input = e;
        };
      })(this),
      type: 'text',
      label: 'name',
      value: this.state.text
    }), h(SlideButton, {
      outerClassName: 'input-amount-submit full-w',
      reverse: true,
      disabled: !this.state.text,
      sClass: this.state.text && 'input-amount-submit-s' || 'input-amount-submit-false',
      pClass: 'input-amount-submit-p',
      height: g.dim,
      vertical: true,
      onClick: (function(_this) {
        return function(e) {
          actions.addTodo(_this.state);
          e.preventDefault();
          return false;
        };
      })(this),
      i: 'check'
    }));
  };

  return addTodoForm;

})(Component);

ExpandBtn = (function(superClass) {
  extend(ExpandBtn, superClass);

  function ExpandBtn(props) {
    ExpandBtn.__super__.constructor.call(this, props);
  }

  ExpandBtn.prototype.render = function(props) {
    return h(Button, {
      i: 'keyboard_arrow_down',
      "class": this.props.expanded && 'expand-btn expanded' || 'expand-btn',
      onMouseEnter: this.props.onMouseEnter,
      onMouseLeave: this.props.onMouseLeave,
      vertical: false,
      dim: g.dim,
      onClick: (function(_this) {
        return function(e) {
          props.onClick && props.onClick();
          e.preventDefault();
          e.stopPropagation();
          return false;
        };
      })(this),
      i: 'keyboard_arrow_down'
    });
  };

  return ExpandBtn;

})(Component);

Check = (function(superClass) {
  extend(Check, superClass);

  function Check(props) {
    Check.__super__.constructor.call(this, props);
    this.state = {
      hover: false
    };
  }

  Check.prototype.render = function(props) {
    return h(Button, {
      onMouseEnter: (function(_this) {
        return function(e) {
          _this.setState({
            hover: true
          });
          if (_this.props.onMouseEnter) {
            return _this.props.onMouseEnter(e);
          }
        };
      })(this),
      onMouseLeave: (function(_this) {
        return function(e) {
          _this.setState({
            hover: false
          });
          if (_this.props.onMouseLeave) {
            return _this.props.onMouseLeave(e);
          }
        };
      })(this),
      className: cn('btn', 'check-btn', this.props.done && 'check-btn-done'),
      width: g.dim,
      vertical: false,
      onClick: (function(_this) {
        return function(e) {
          props.onClick();
          e.preventDefault();
          e.stopPropagation();
          return false;
        };
      })(this),
      i: 'check'
    });
  };

  return Check;

})(Component);

User = (function(superClass) {
  extend(User, superClass);

  function User() {
    return User.__super__.constructor.apply(this, arguments);
  }

  User.prototype.render = function(props) {
    var icon, label, selected;
    if (props.selected) {
      selected = h('div', {
        className: 'profile-mini-selected'
      }, h('i', {
        className: 'material-icons'
      }, 'check'));
    }
    if (store.state.user.id === props.id) {
      label = h('div', {
        className: 'profile-self-label'
      });
    }
    if (!this.props.thumb) {
      icon = h('i', {
        className: 'material-icons'
      }, 'person');
    }
    return h('div', {
      onClick: this.props.onClick,
      className: 'profile-mini center'
    }, h('div', {
      style: {
        backgroundImage: 'url(' + this.props.thumb + ')',
        transform: ''
      },
      className: 'avatar center'
    }, selected, icon), !this.props.hide_name && h('div', {
      className: 'profile-name'
    }, this.props.name || 'Anon'));
  };

  return User;

})(Component);

Todo = (function(superClass) {
  extend(Todo, superClass);

  function Todo(props) {
    Todo.__super__.constructor.call(this, props);
    this.state = {
      hover: false,
      hover_sub: [],
      hover_opt: false,
      hover_sub_opt: [],
      hover_sub_opt_left: [],
      expanded: true
    };
  }

  Todo.prototype.subTodos = function() {
    var t_switch_d, t_switch_d2, view;
    if (!this.props.todos) {
      return;
    }
    view = store.state.view;
    t_switch_d = null;
    t_switch_d2 = null;
    return this.props.todos.map((function(_this) {
      return function(todo, i) {
        return h(Todo, todo);
      };
    })(this));
  };

  Todo.prototype.render = function(props) {
    var active, check_btn, date, full_todo, hide_pin, hover_left, name_date, options, options_left, photo_count, show_pins_button, sub_todos;
    date = h('div', {
      className: cn('sub created_at', !this.state.hover && 'opaque')
    }, this.props.completed_at ? 'Completed ' + this.props.completed_at.toDateString() : 'Created ' + this.props.created_at.toDateString());
    if (props.completed_at) {
      photo_count = props.pins.length;
    } else {
      photo_count = props.pins.length;
    }
    hide_pin = true;
    if (this.state.hover || this.state.hover_opt || (!store.state.view.show_todo_sub && store.state.view.show_todo && store.state.view.show_todo._id === props._id)) {
      hide_pin = false;
    }
    active = false;
    if (store.state.view.show_todo && store.state.view.show_todo._id === props._id) {
      active = true;
    }
    hover_left = this.state.hover_opt_left;
    if (store.state.view.edit_todo && store.state.view.edit_todo._id === props._id) {
      hover_left = true;
    }
    show_pins_button = h(Button, {
      width: g.dim,
      className: cn('pin-btn', active && 'active-pin', hide_pin && 'hidden-pin-btn'),
      onMouseEnter: (function(_this) {
        return function(e) {
          return _this.setState({
            hover_opt: true
          });
        };
      })(this),
      onMouseLeave: (function(_this) {
        return function(e) {
          return _this.setState({
            hover_opt: false
          });
        };
      })(this),
      onClick: (function(_this) {
        return function(e) {
          actions.showPins(_this.props);
          e.preventDefault();
          e.stopPropagation();
          return false;
        };
      })(this),
      i: props.completed_at && 'photo_camera' || 'location_on',
      pre: h('div', {
        className: 'photo_count'
      }, photo_count)
    });
    if (props.todos.length && this.state.expanded) {
      sub_todos = this.subTodos();
    }
    options_left = [
      !this.props.sub && h(Slide, {
        width: g.dim,
        className: 'pin-btn center btn b1',
        onMouseEnter: (function(_this) {
          return function() {
            return _this.setState({
              hover_opt_left: true
            });
          };
        })(this),
        onMouseLeave: (function(_this) {
          return function() {
            return _this.setState({
              hover_opt_left: false
            });
          };
        })(this),
        onClick: (function(_this) {
          return function(e) {
            actions.showAddSubTodo(_this.props);
            e.preventDefault();
            return e.stopPropagation();
          };
        })(this)
      }, h('i', {
        className: 'material-icons'
      }, 'add')), h(Slide, {
        width: g.dim,
        className: 'pin-btn center btn b1',
        onMouseEnter: (function(_this) {
          return function() {
            return _this.setState({
              hover_opt_left: true
            });
          };
        })(this),
        onMouseLeave: (function(_this) {
          return function() {
            return _this.setState({
              hover_opt_left: false
            });
          };
        })(this),
        onClick: (function(_this) {
          return function(e) {
            actions.showTodoEditModal(_this.props, null);
            e.preventDefault();
            return e.stopPropagation();
          };
        })(this)
      }, h('i', {
        className: 'material-icons'
      }, 'mode_edit'))
    ];
    options = h(Slide, {
      width: g.dim,
      className: 'pin-btn center btn b1',
      onMouseEnter: (function(_this) {
        return function() {
          return _this.setState({
            hover_opt: true
          });
        };
      })(this),
      onMouseLeave: (function(_this) {
        return function() {
          return _this.setState({
            hover_opt: false
          });
        };
      })(this),
      onClick: (function(_this) {
        return function(e) {
          actions.showAddPinModal(_this.props, null);
          e.preventDefault();
          return e.stopPropagation();
        };
      })(this)
    }, h('i', {
      className: 'material-icons'
    }, 'add'));
    if (!props.todos.length) {
      check_btn = h(Check, {
        _intui_slide: true,
        done: !!this.props.completed_at,
        onMouseEnter: (function(_this) {
          return function(e) {
            return _this.setState({
              hover_opt_left: true
            });
          };
        })(this),
        onMouseLeave: (function(_this) {
          return function(e) {
            return _this.setState({
              hover_opt_left: false
            });
          };
        })(this),
        onClick: (function(_this) {
          return function() {
            return actions.editTodo(store.state.group._id, props, {
              completed_at: _this.props.completed_at instanceof Date ? null : new Date()
            });
          };
        })(this)
      });
    } else {
      check_btn = h(ExpandBtn, {
        onClick: (function(_this) {
          return function() {
            return _this.setState({
              expanded: !_this.state.expanded
            });
          };
        })(this),
        onMouseEnter: (function(_this) {
          return function(e) {
            return _this.setState({
              hover_opt_left: true
            });
          };
        })(this),
        onMouseLeave: (function(_this) {
          return function(e) {
            return _this.setState({
              hover_opt_left: false
            });
          };
        })(this),
        hover: this.state.hover,
        index: this.props.index,
        _intui_slide: true,
        expanded: this.state.expanded
      });
    }
    name_date = h(Slide, {
      key: 'name_date',
      vertical: false,
      beta: 100,
      onClick: (function(_this) {
        return function() {
          if (_this.props.todos.length) {
            return _this.setState({
              expanded: !_this.state.expanded
            });
          } else if (!_this.props.completed_at) {
            return actions.editTodo(store.state.group._id, _this.props, {
              completed_at: _this.props.completed_at instanceof Date ? null : new Date()
            });
          }
        };
      })(this),
      className: 'name'
    }, h('span', null, this.props.name), date);
    if (!this.state.hover) {
      options = null;
      options_left = null;
    }
    full_todo = h(Slide, {
      className: cn('todo', props.completed_at && 'done' || 'undone'),
      vertical: false,
      slide: false,
      height: g.dim
    }, check_btn, h(Slide, {
      key: 'todo-main',
      beta: 100,
      slide: true,
      pos: this.state.hover_opt ? 2 : hover_left ? 0 : 1,
      className: cn('todo todo-main')
    }, h(Slide, {
      width: g.dim * 2
    }, options_left), name_date, options), show_pins_button);
    return h(Slide, {
      onMouseEnter: (function(_this) {
        return function(e) {
          return _this.setState({
            hover: true
          });
        };
      })(this),
      onMouseLeave: (function(_this) {
        return function(e) {
          return _this.setState({
            hover: false
          });
        };
      })(this),
      key: this.props._id,
      vertical: true,
      className: cn('todo-wrap', this.props.i % 2 === 0 && 'list-alt' || '', props.completed_at && 'done' || 'undone', this.props.sub && 'todo-sub-item' || ''),
      auto: true
    }, full_todo, sub_todos);
  };

  return Todo;

})(Component);

Slideshow = (function(superClass) {
  extend(Slideshow, superClass);

  function Slideshow(props) {
    Slideshow.__super__.constructor.call(this, props);
    this.state = {
      slide: 0
    };
  }

  Slideshow.prototype.render = function(props, state) {
    return h(Overlay, {
      strokeStyle: g.light,
      show: props.show,
      onClick: function() {
        return actions.hideSlideshow();
      }
    }, h(Slide, {
      pos: state.pos,
      slide: true
    }));
  };

  return Slideshow;

})(Component);

addPinForm = (function(superClass) {
  extend(addPinForm, superClass);

  function addPinForm(props) {
    this.render = bind(this.render, this);
    this.submit = bind(this.submit, this);
    var is_event;
    addPinForm.__super__.constructor.call(this, props);
    if (props.view.edit_todo_sub) {
      is_event = !!props.view.edit_todo_sub.completed_at;
    } else {
      is_event = !!props.view.edit_todo.completed_at;
    }
    this.state = {
      files: null,
      name: null,
      text: null,
      link: null,
      type: 'photo',
      is_event: is_event
    };
  }

  addPinForm.prototype.btn = function(type, r) {
    return h(SlideButton, {
      className: 'pin-type-button',
      disabled: this.props.is_event,
      sClass: '',
      pClass: 'b0',
      active: this.state.type === type,
      width: g.dim,
      vertical: true,
      reverse: false,
      onClick: (function(_this) {
        return function() {
          return _this.setState({
            type: type
          });
        };
      })(this),
      i: type
    });
  };

  addPinForm.prototype.submit = function() {
    var f;
    f = new FormData();
    if (this.state.type === 'photo') {
      f.append('name', this.state.name);
      f.append('file', this.state.files[0]);
    } else if (this.state.type === 'link') {
      f.append('link', this.state.link);
    } else if (this.state.type === 'text') {
      f.append('text', this.state.text);
    }
    f.append('type', this.state.type);
    return actions.addPin(store.state.group._id, this.props.view.edit_todo, f, this.state);
  };

  addPinForm.prototype.componentWillMount = function() {
    var is_event;
    if (this.props.view.edit_todo_sub) {
      is_event = !!this.props.view.edit_todo_sub.completed_at;
    } else {
      is_event = !!this.props.view.edit_todo.completed_at;
    }
    return this.setState({
      files: null,
      name: null,
      text: null,
      link: null,
      type: 'photo',
      is_event: is_event
    });
  };

  addPinForm.prototype.componentDidMount = function() {
    return this.forceUpdate();
  };

  addPinForm.prototype.render = function(props, state) {
    var check_submit, ctx, title;
    if (this.state.type === 'photo') {
      title = 'pin photo';
      ctx = h('div', {
        className: 'pin-ctx'
      }, h(InputText, {
        onInput: (function(_this) {
          return function(e) {
            return _this.setState({
              name: e.target.value
            });
          };
        })(this),
        ref: (function(_this) {
          return function(e) {
            return _this._caption = e;
          };
        })(this),
        type: 'text',
        label: 'caption',
        value: this.state.name
      }), h(InputFile, {
        onInput: (function(_this) {
          return function(e) {
            return _this.setState({
              files: e.target.files
            });
          };
        })(this),
        ref: (function(_this) {
          return function(e) {
            return _this._file = e;
          };
        })(this),
        label: 'picture',
        value: null
      }));
      check_submit = this.state.files && true || false;
    } else if (this.state.type === 'link') {
      title = 'pin a link';
      ctx = h('div', {
        className: 'pin-ctx'
      }, h(InputText, {
        onInput: (function(_this) {
          return function(e) {
            return _this.setState({
              link: e.target.value
            });
          };
        })(this),
        ref: (function(_this) {
          return function(e) {
            return _this._link = e;
          };
        })(this),
        type: 'text',
        label: 'link',
        value: this.state.link
      }));
      check_submit = this.state.link && true || false;
    } else if (this.state.type === 'textsms') {
      title = 'pin text';
      ctx = h('div', {
        className: 'pin-ctx'
      }, h(InputTextArea, {
        onInput: (function(_this) {
          return function(e) {
            return _this.setState({
              text: e.target.value
            });
          };
        })(this),
        ref: (function(_this) {
          return function(e) {
            return _this._text = e;
          };
        })(this),
        value: this.state.text,
        type: 'text',
        label: 'a short text'
      }));
      check_submit = this.state.text && true || false;
    }
    return h('form', {
      onSubmit: (function(_this) {
        return function(e) {
          actions.addListItem(_this.state);
          e.preventDefault();
          return false;
        };
      })(this),
      className: 'form pin-form'
    }, h(Slide, {
      vertical: false,
      height: g.dim
    }, this.btn('photo', true), this.btn('link', false), this.btn('textsms', true)), ctx, h(SlideButton, {
      outerClassName: 'input-amount-submit full-w',
      reverse: true,
      disabled: !check_submit,
      sClass: 'b0',
      pClass: 'b3',
      height: g.dim,
      vertical: true,
      onClick: this.submit,
      label: 'create'
    }));
  };

  return addPinForm;

})(Component);

SlideShow = (function(superClass) {
  extend(SlideShow, superClass);

  function SlideShow(props) {
    this.render = bind(this.render, this);
    SlideShow.__super__.constructor.call(this, props);
    this.state = {
      pos: 0
    };
  }

  SlideShow.prototype.render = function(props, state) {
    return h(Viewer, {
      img: props.view.slideshow_pin.img,
      onClick: function() {
        return actions.hideModal();
      }
    });
  };

  return SlideShow;

})(Component);

ListItemView = (function(superClass) {
  extend(ListItemView, superClass);

  function ListItemView(props) {
    this.render = bind(this.render, this);
    this.filterTodos = bind(this.filterTodos, this);
    this.filterDates = bind(this.filterDates, this);
    this.sort = bind(this.sort, this);
    ListItemView.__super__.constructor.call(this, props);
    this.state = {
      filter_checked: false,
      filter_dates: false,
      sort: false
    };
  }

  ListItemView.prototype.sort = function() {
    return this.setState({
      sort: !this.state.sort
    });
  };

  ListItemView.prototype.filterDates = function() {
    return this.setState({
      sort: !this.state.filter_dates,
      filter_dates: !this.state.filter_dates
    });
  };

  ListItemView.prototype.filterTodos = function() {
    return this.setState({
      filter_checked: !this.state.filter_checked
    });
  };

  ListItemView.prototype.showGroupPins = function() {
    return actions.showPins(null, null);
  };

  ListItemView.prototype.render = function(props, state) {
    var count, d, date, i, j, k, l, l_m, l_t, l_y, len, len1, m, n, options, pin, ref2, ref3, t, todo, todo_items, y;
    todo_items = props.group.state.todos.map(function(todo, i) {
      todo.index = i;
      todo.key = todo._id;
      todo.hover = store.state.view.hoverTodo_id === todo._id;
      return h(Todo, todo);
    });
    if (this.state.sort) {
      todo_items.sort(function(a, b) {
        a = a.attributes;
        b = b.attributes;
        if (!a.completed_at && b.completed_at) {
          return -1;
        }
        if (!b.completed_at && a.completed_at) {
          return 1;
        }
        if (a.completed_at && b.completed_at) {
          if (a.completed_at < b.completed_at) {
            return 1;
          } else {
            return -1;
          }
        } else {
          return a.created_at - b.created_at;
        }
      });
    }
    if (this.state.filter_checked) {
      todo_items = todo_items.filter(function(todo) {
        return !(todo.attributes.completed_at instanceof Date);
      });
    }
    for (i = j = 0, len = todo_items.length; j < len; i = ++j) {
      todo = todo_items[i];
      todo.attributes.i = i;
    }
    if (this.state.filter_dates) {
      l = todo_items.length;
      l_m = null;
      l_y = null;
      l_t = null;
      for (i = k = 0, ref2 = l; 0 <= ref2 ? k < ref2 : k > ref2; i = 0 <= ref2 ? ++k : --k) {
        todo = todo_items[i].attributes;
        if (todo.completed_at) {
          date = todo.completed_at;
        } else {
          date = todo.created_at;
        }
        m = date.getMonth();
        y = date.getFullYear();
        t = !!todo.completed_at;
        if (l_m !== m || l_y !== y || l_t !== t) {
          l_m = m;
          l_y = y;
          l_t = t;
          d = h(Slide, {
            height: g.dim,
            className: cn('todo-date', todo.completed_at && 'done', todo.i % 2 === 0 && 'list-alt' || '')
          }, h('span', {}, (todo.completed_at && 'completed ' || 'created ') + monthNames[m] + ' ' + y));
          todo_items.splice(i, 0, d);
          i++;
        }
      }
    }
    count = 0;
    ref3 = props.group.state.todos;
    for (n = 0, len1 = ref3.length; n < len1; n++) {
      pin = ref3[n];
      count += pin.pins.length;
    }
    options = [
      h(SlideButton, {
        onClick: actions.addTodo,
        className: 'btn',
        pClass: 'b3',
        width: g.dim,
        vertical: true,
        reverse: false,
        i: 'date_range',
        active: this.state.filter_dates,
        onClick: this.filterDates
      }), h(SlideButton, {
        onClick: this.filterTodos,
        className: 'btn',
        sClass: '',
        pClass: 'b3',
        width: g.dim,
        vertical: true,
        reverse: false,
        i: 'playlist_add_check',
        active: this.state.filter_checked
      }), h(SlideButton, {
        onClick: this.sort,
        active: this.state.sort,
        className: 'btn',
        sClass: '',
        pClass: 'b3',
        width: g.dim,
        vertical: true,
        reverse: false,
        i: 'sort'
      })
    ];
    return h(Slide, {
      className: 'list pad-25-25',
      vertical: true
    }, h(Slide, {
      className: 'participants',
      height: g.dim
    }, options, h(SlideButton, {
      onClick: this.showGroupPins,
      "class": 'show-listitem-pins',
      sClass: '',
      pClass: 'b3',
      width: g.dim,
      vertical: true,
      reverse: false,
      i: 'photo_camera',
      active: props.view.side_view === 'pins' && !props.view.show_todo,
      pre: h('div', {
        className: 'photo_count'
      }, count)
    })), h(Slide, {
      auto: true,
      vertical: true,
      className: 'list-content'
    }, todo_items, h(Button, {
      onClick: function() {
        return actions.setModal('addTodo');
      },
      className: 'add-btn',
      width: g.dim * 2,
      height: g.dim * 2,
      i: 'add'
    })));
  };

  return ListItemView;

})(Component);

Pin = (function(superClass) {
  extend(Pin, superClass);

  function Pin() {
    return Pin.__super__.constructor.apply(this, arguments);
  }

  Pin.prototype.render = function(props) {
    var name, pin, pin_icon;
    if (props.name) {
      name = h('div', {
        className: 'pin-title'
      }, props.name);
    }
    pin_icon = h('i', {
      className: 'material-icons pin_icon'
    }, props.is_event ? 'photo_camera' : 'location_on');
    if (props.type === 'photo') {
      pin = h('div', {
        onClick: (function(_this) {
          return function() {
            return props.onClick();
          };
        })(this),
        className: 'pin pin-img',
        style: {
          backgroundImage: 'url(' + (props.thumb || props.img) + ')'
        }
      }, name, pin_icon);
    } else if (props.type === 'textsms') {
      pin = h('div', {
        className: 'pin pin-textsms'
      }, props.text, pin_icon);
    } else if (props.type === 'link') {
      pin = h('div', {
        onClick: (function(_this) {
          return function(e) {
            return document.location.href = props.link;
          };
        })(this),
        className: 'pin pin-link center'
      }, h('img', {
        src: props.link_icon_img
      }), pin_icon);
    }
    return h('div', {
      className: 'pin-wrap center'
    }, pin);
  };

  return Pin;

})(Component);

PinsView = (function(superClass) {
  extend(PinsView, superClass);

  function PinsView(props) {
    PinsView.__super__.constructor.call(this, props);
    this.state = {
      filter: null
    };
  }

  PinsView.prototype.componentWillUpdate = function(props, state) {
    if (state.filter !== this.state.filter) {
      return state.reset_grid = true;
    }
  };

  PinsView.prototype.render = function(props, state) {
    var j, len, list_key, pins, ref2, todo;
    pins = [];
    if (!props.group) {
      return;
    }
    list_key = this.state.filter || 'all-';
    if (props.view.show_todo_sub) {
      pins = pins.concat(props.view.show_todo_sub.pins);
      list_key += props.view.show_todo_sub._id;
    } else if (props.view.show_todo) {
      pins = pins.concat(props.view.show_todo.pins);
      list_key += props.view.show_todo._id;
    } else {
      ref2 = props.group.state.todos;
      for (j = 0, len = ref2.length; j < len; j++) {
        todo = ref2[j];
        pins = pins.concat(todo.pins);
      }
    }
    if (this.state.filter === 'plan') {
      pins = pins.filter(function(pin) {
        return !pin.is_event;
      });
    } else if (this.state.filter === 'event') {
      pins = pins.filter(function(pin) {
        return pin.is_event;
      });
    }
    pins = pins.map((function(_this) {
      return function(pin, i) {
        if (!pin) {
          return null;
        }
        pin.onClick = function() {
          return actions.showSlides({
            pins: pins,
            pin: pin
          });
        };
        return h(GridItem, {
          w: pin.w,
          h: pin.h,
          key: pin.id,
          i: i
        }, h(Pin, pin));
      };
    })(this));
    return h(Grid, {
      w: 2,
      oclass: 'pins',
      auto: true,
      iclass: 'grid-inner',
      list_key: list_key,
      pre_children: h(Slide, {
        vertical: false,
        height: g.dim,
        "class": 'pins-options'
      }, h(SlideButton, {
        onClick: actions.addTodo,
        className: 'btn pins-option',
        sClass: '',
        pClass: 'b1',
        width: g.dim,
        vertical: false,
        reverse: false,
        i: 'location_on',
        active: this.state.filter === 'plan',
        onClick: (function(_this) {
          return function() {
            return _this.setState({
              filter: _this.state.filter === 'plan' ? null : 'plan'
            });
          };
        })(this)
      }), h(SlideButton, {
        onClick: actions.addTodo,
        className: 'btn pins-option',
        sClass: '',
        pClass: 'b1',
        width: g.dim,
        vertical: false,
        reverse: true,
        i: 'photo_camera',
        active: this.state.filter === 'event',
        onClick: (function(_this) {
          return function() {
            return _this.setState({
              filter: _this.state.filter === 'event' ? null : 'event'
            });
          };
        })(this)
      }))
    }, pins);
  };

  return PinsView;

})(Component);

UserLoginView = (function(superClass) {
  extend(UserLoginView, superClass);

  UserLoginView.prototype.login = function() {
    return actions.login(this.state);
  };

  function UserLoginView(props) {
    this.render = bind(this.render, this);
    this.login = bind(this.login, this);
    UserLoginView.__super__.constructor.call(this, props);
    this.state = {
      email: null,
      pass: null
    };
  }

  UserLoginView.prototype.render = function() {
    return h(Slide, {
      vertical: true,
      auto: true,
      onEnter: this.login
    }, h(InputText, {
      height: g.dim,
      disabled: this.props.disabled,
      onInput: (function(_this) {
        return function(e) {
          return _this.setState({
            email: e.target.value
          });
        };
      })(this),
      type: 'text',
      name: 'email',
      label: 'email',
      value: this.state.email
    }), h(InputText, {
      height: g.dim,
      disabled: this.props.disabled,
      onInput: (function(_this) {
        return function(e) {
          return _this.setState({
            pass: e.target.value
          });
        };
      })(this),
      type: 'password',
      autoComplete: 'new-password',
      name: 'pass',
      label: 'pass',
      value: this.state.pass
    }), h(Slide, {
      height: g.dim
    }), h(SlideButton, {
      onClick: this.login,
      className: 'btn',
      sClass: 'b0',
      pClass: 'b3',
      height: g.dim,
      vertical: false,
      vertical: true,
      reverse: true,
      label: 'login',
      disabled: !this.state.email || !this.state.pass
    }));
  };

  return UserLoginView;

})(Component);

UserSignupView = (function(superClass) {
  extend(UserSignupView, superClass);

  UserSignupView.prototype.signup = function() {
    return actions.signup(this.state);
  };

  function UserSignupView(props) {
    this.render = bind(this.render, this);
    this.signup = bind(this.signup, this);
    UserSignupView.__super__.constructor.call(this, props);
    this.state = {
      email: null,
      pass: null,
      pass_confirm: null
    };
  }

  UserSignupView.prototype.render = function() {
    return h(Slide, {
      vertical: true,
      auto: true
    }, h(InputText, {
      height: g.dim,
      onInput: (function(_this) {
        return function(e) {
          return _this.setState({
            email: e.target.value
          });
        };
      })(this),
      type: 'text',
      name: 'email',
      disabled: this.props.disabled,
      label: 'email',
      value: this.state.email
    }), h(InputText, {
      height: g.dim,
      onInput: (function(_this) {
        return function(e) {
          return _this.setState({
            pass: e.target.value
          });
        };
      })(this),
      type: 'password',
      disabled: this.props.disabled,
      autoComplete: 'new-password',
      name: 'password',
      label: 'password',
      value: this.state.pass
    }), h(InputText, {
      height: g.dim,
      onInput: (function(_this) {
        return function(e) {
          return _this.setState({
            pass_confirm: e.target.value
          });
        };
      })(this),
      type: 'password',
      autoComplete: 'new-password',
      name: 'confirm pass',
      disabled: this.props.disabled,
      label: 'confirm pass',
      value: this.state.pass_confirm
    }), h(SlideButton, {
      onClick: this.signup,
      className: 'btn',
      sClass: 'b0',
      pClass: 'b3',
      height: g.dim,
      vertical: true,
      reverse: true,
      label: 'signup',
      disabled: !this.state.email || !this.state.pass || !this.state.pass_confirm
    }));
  };

  return UserSignupView;

})(Component);

UserAuthView = (function(superClass) {
  extend(UserAuthView, superClass);

  function UserAuthView(props) {
    this.render = bind(this.render, this);
    UserAuthView.__super__.constructor.call(this, props);
    this.state = {
      show_signup: false,
      pass: null
    };
  }

  UserAuthView.prototype.render = function(props, state) {
    var pos;
    if (this.state.show_signup) {
      pos = 1;
    } else {
      pos = 0;
    }
    return h(Slide, {
      vertical: true,
      auto: true
    }, h(Slide, {
      height: g.dim * 4,
      slide: true,
      pos: pos,
      vertical: false
    }, h(UserLoginView, Object.assign({
      disabled: this.state.show_signup,
      _intui_slide: true
    }, props)), h(UserSignupView, Object.assign({
      disabled: !this.state.show_signup,
      _intui_slide: true
    }, props))), h(Slide, {
      height: g.dim,
      slide: true,
      vertical: true,
      onClick: (function(_this) {
        return function() {
          return _this.setState({
            show_signup: !_this.state.show_signup
          });
        };
      })(this),
      pos: this.state.show_signup ? 1 : 0
    }, h(Slide, {
      className: 'btn',
      center: true
    }, 'signup'), h(Slide, {
      className: 'btn',
      center: true
    }, 'login')));
  };

  return UserAuthView;

})(Component);

HomeView = (function(superClass) {
  extend(HomeView, superClass);

  function HomeView(props) {
    this.render = bind(this.render, this);
    HomeView.__super__.constructor.call(this, props);
  }

  HomeView.prototype.render = function(props, state) {
    return h(Slide, {
      center: true,
      beta: 100,
      vertical: true
    }, h(Slide, {
      vertical: true,
      auto: true,
      width: g.dim * 6
    }, h(Slide, {
      height: g.dim * 2,
      center: true,
      className: 'home-title'
    }, 'checki'), h(Slide, {
      height: g.dim,
      center: true,
      className: 'home-desc'
    }, 'login or signup'), h(UserAuthView, props)));
  };

  return HomeView;

})(Component);

LinkGroup = (function(superClass) {
  extend(LinkGroup, superClass);

  function LinkGroup() {
    this.render = bind(this.render, this);
    this.copy = bind(this.copy, this);
    return LinkGroup.__super__.constructor.apply(this, arguments);
  }

  LinkGroup.prototype.componentWillMount = function() {
    return actions.generateGroupLink(this.props.group._id);
  };

  LinkGroup.prototype.copy = function() {
    copyToClipboard(this.props.view.group_invite_link.link);
    return this.setState({
      copied: true
    });
  };

  LinkGroup.prototype.render = function() {
    var ref2;
    return h(Slide, {
      height: g.dim * 2,
      className: 'modal-link',
      center: true,
      vertical: true
    }, h('span', {
      className: 'modal-label'
    }, h('span', {
      className: 'modal-label-pre'
    }, this.props.group.name)), h('div', {
      className: 'title'
    }, !this.props.view.group_invite_link && 'fetching new link...' || 'group invite link'), h(Slide, {
      height: g.dim,
      vertical: false
    }, h(Slide, {
      className: 'b0 invite-link select'
    }, h('span', {
      className: 'select'
    }, (ref2 = this.props.view.group_invite_link) != null ? ref2.link : void 0)), h(SlideButton, {
      slide_duration: 0.1,
      vertical: false,
      reverse: true,
      width: g.dim,
      pClass: 'b3',
      active: this.state.copied,
      i: 'content_paste',
      onClick: this.copy
    })));
  };

  return LinkGroup;

})(Component);

ModalView = (function(superClass) {
  extend(ModalView, superClass);

  function ModalView() {
    this.render = bind(this.render, this);
    return ModalView.__super__.constructor.apply(this, arguments);
  }

  ModalView.prototype.render = function(props, state) {
    var ctn, main_view, modal, modal_color, modal_content, show;
    ctn = props.view.modal_content;
    modal_color = '#232E34';
    if (props.modal_content === 'slideshow') {
      modal_color = '#000';
    }
    modal_content = null;
    if (props.view.show_modal) {
      switch (ctn) {
        case 'addTodo':
          modal_content = h(addTodoForm, props);
          break;
        case 'addPin':
          modal_content = h(addPinForm, props);
          break;
        case 'editTodo':
          modal_content = h(editTodoForm, props);
          break;
        case 'slideshow':
          modal = h(SlideShow, props);
          break;
        case 'newGroup':
          modal_content = h(CreateGroupForm, props);
          break;
        case 'addFriend':
          modal_content = h(AddFriendView, props);
          break;
        case 'editGroup':
          modal_content = h(EditGroupForm, props);
          break;
        case 'userSettings':
          modal_content = h(UserSettings, props);
          break;
        case 'linkGroup':
          modal_content = h(LinkGroup, props);
      }
    }
    show = !!this.props.view.show_modal;
    if (props.user && !props.user.name) {
      show = true;
      modal_content = h(UserSettings, props);
    }
    if (ctn !== 'slideshow') {
      modal = h(Modal, {
        className: 'modal',
        backColor: modal_color,
        show: show,
        mouse: g.mouse,
        onClick: (function(_this) {
          return function() {
            if (_this.props.user && _this.props.user.name) {
              return actions.hideModal();
            }
          };
        })(this)
      }, modal_content);
      main_view = null;
    }
    return modal;
  };

  return ModalView;

})(Component);

GroupView = (function(superClass) {
  extend(GroupView, superClass);

  function GroupView() {
    this.render = bind(this.render, this);
    return GroupView.__super__.constructor.apply(this, arguments);
  }

  GroupView.prototype.render = function(props, state) {
    var main, main_view, side, side_view, users;
    main = h(ListItemView, props);
    users = sortUsers(props.group.users.map(function(user) {
      return h(User, Object.assign({
        dim: g.dim
      }, user));
    }));
    if (props.view.side_view === 'pins') {
      side_view = h(PinsView, props);
    }
    side = h(Slide, {
      beta: g.mobile ? 100 : (props.view.main_view === 'lists' ? 0 : 30),
      width: g.mobile ? void 0 : 400,
      offset: g.mobile ? -80 : 0
    }, side_view);
    main_view = h(Slide, {
      className: props.view.modal_content === 'slideshow' && 'hidden2' || '',
      beta: 100,
      slide: g.mobile ? true : false,
      vertical: false,
      pos: props.view.side_view === 'pins' && 1 || 0
    }, h(Slide, {
      beta: 100,
      scroll: true
    }, main), side);
    return h(Slide, {
      className: 'view-main',
      duration: g.slide_duration,
      vertical: true
    }, main_view);
  };

  return GroupView;

})(Component);

stat = function(label, val) {
  return h(Slide, {
    className: 'stat',
    center: true,
    auto: true
  }, h('span', {
    className: 'stat-label'
  }, label + ': '), h('span', {
    className: 'stat-val'
  }, val));
};

UserViewGroupItem = (function(superClass) {
  extend(UserViewGroupItem, superClass);

  function UserViewGroupItem() {
    return UserViewGroupItem.__super__.constructor.apply(this, arguments);
  }

  UserViewGroupItem.prototype.render = function(props, state) {
    var gstate, participants;
    participants = gstate = store.getState();
    return h(Slide, {
      onClick: function(e) {
        actions.showGroup(props._id);
        e.preventDefault();
        e.stopPropagation();
        return false;
      },
      vertical: true,
      center: true,
      className: 'list-item'
    }, h(Slide, {
      height: g.dim / 2,
      center: true,
      className: 'list-count'
    }, doneText(props.done_count, props.total_count)), h(Slide, {
      height: g.dim / 2,
      center: true,
      className: 'list-name'
    }, h('span', null, props.name)), h(Slide, {
      className: 'list-participants',
      height: g.dim / 2,
      center: true
    }, stat('members', props.users.length)));
  };

  return UserViewGroupItem;

})(Component);

EditGroupForm = (function(superClass) {
  extend(EditGroupForm, superClass);

  function EditGroupForm(props) {
    this.render = bind(this.render, this);
    this.leave = bind(this.leave, this);
    this.save = bind(this.save, this);
    EditGroupForm.__super__.constructor.call(this, props);
    this.state = {
      name: props.group.name,
      remove_users: []
    };
  }

  EditGroupForm.prototype.componentDidMount = function() {
    var ref2;
    return (ref2 = this._input) != null ? ref2.focus() : void 0;
  };

  EditGroupForm.prototype.save = function(e) {
    actions.editGroup(this.state, this.props.group._id);
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  EditGroupForm.prototype.leave = function(e) {
    actions.leaveGroup(this.props.group._id);
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  EditGroupForm.prototype.render = function(props) {
    var users;
    if (this.props.group.owner !== this.props.user._id) {
      return h(Button, {
        width: g.dim * 5,
        height: g.dim,
        "class": 'b0',
        label: 'leave group',
        onClick: this.leave
      });
    }
    users = this.props.group.users.map((function(_this) {
      return function(u, i) {
        return h(GridItem, {
          w: 1,
          h: 1,
          key: u._id,
          "class": 'center',
          i: i
        }, [
          h(User, u), h('div', {
            onClick: (function(i) {
              var r_i;
              r_i = _this.state.remove_users.indexOf(u._id);
              if (r_i < 0) {
                _this.state.remove_users.push(u._id);
              } else {
                _this.state.remove_users.splice(r_i, 1);
              }
              return _this.setState();
            }).bind(_this, i),
            className: cn(_this.state.remove_users.indexOf(u._id) < 0 && 'hidden' || '', 'user-overlay-delete')
          }, h('i', {
            className: 'material-icons user-overlay-delete-icon'
          }, 'remove_circle_outline'))
        ]);
      };
    })(this));
    return h('form', {
      onSubmit: this.save,
      className: 'form'
    }, h('div', {
      className: 'title'
    }, 'edit group'), h(InputText, {
      onInput: (function(_this) {
        return function(e) {
          return _this.setState({
            name: e.target.value
          });
        };
      })(this),
      ref: (function(_this) {
        return function(e) {
          return _this._input = e;
        };
      })(this),
      type: 'text',
      label: 'name',
      value: this.state.name
    }), h(Slide, {
      className: 'title',
      height: 30
    }, 'group users:'), h(Slide, {
      height: g.dim * 6
    }, h(Grid, {
      w: 4
    }, users)), h(SlideButton, {
      outerClassName: 'input-amount-submit full-w',
      reverse: true,
      disabled: !this.state.name,
      sClass: this.state.name && 'input-amount-submit-s' || 'input-amount-submit-false',
      pClass: 'input-amount-submit-p',
      height: g.dim,
      vertical: true,
      onClick: this.save,
      label: 'save'
    }), h(Button, {
      height: g.dim,
      "class": 'b0',
      label: 'leave group',
      onClick: this.leave
    }));
  };

  return EditGroupForm;

})(Component);

CreateGroupForm = (function(superClass) {
  extend(CreateGroupForm, superClass);

  function CreateGroupForm(props) {
    this.render = bind(this.render, this);
    this.save = bind(this.save, this);
    CreateGroupForm.__super__.constructor.call(this, props);
    this.state = {
      name: props.name
    };
  }

  CreateGroupForm.prototype.componentDidMount = function() {
    return this._input.focus();
  };

  CreateGroupForm.prototype.save = function(e) {
    actions.createGroup(this.state);
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  CreateGroupForm.prototype.render = function(props) {
    return h('form', {
      onSubmit: this.save,
      className: 'form'
    }, h('div', {
      className: 'title'
    }, 'create group'), h(InputText, {
      onInput: (function(_this) {
        return function(e) {
          return _this.setState({
            name: e.target.value
          });
        };
      })(this),
      ref: (function(_this) {
        return function(e) {
          return _this._input = e;
        };
      })(this),
      type: 'text',
      label: 'name',
      value: this.state.name
    }), h(SlideButton, {
      outerClassName: 'input-amount-submit full-w',
      reverse: true,
      disabled: !this.state.name,
      sClass: this.state.name && 'input-amount-submit-s' || 'input-amount-submit-false',
      pClass: 'input-amount-submit-p',
      height: g.dim,
      vertical: true,
      onClick: this.save,
      label: 'create'
    }));
  };

  return CreateGroupForm;

})(Component);

Menu = (function(superClass) {
  extend(Menu, superClass);

  function Menu(props) {
    this.render = bind(this.render, this);
    this.goHome = bind(this.goHome, this);
    Menu.__super__.constructor.call(this, props);
  }

  Menu.prototype.goHome = function() {
    return actions.goUserHome();
  };

  Menu.prototype.opt = function(icon, onClick, active, hover, w) {
    return h(SlideButton, {
      sClass: '',
      pClass: 'b3',
      width: g.dim * (w || 1),
      vertical: true,
      hover: hover,
      reverse: false,
      index_offset: 5,
      i: icon,
      active: active,
      onClick: onClick
    });
  };

  Menu.prototype.render = function(props, state) {
    var left_options, more_btn_right, user_icon;
    more_btn_right = h(Button, {
      className: cn('btn btn-rotate', this.props.show_more_right && 'btn-rotate-90'),
      i: 'more_horiz',
      disabled: !props.state.user,
      width: g.dim,
      onClick: (function(_this) {
        return function() {
          return actions.setView({
            show_more_right: true
          });
        };
      })(this)
    });
    if (props.state.user) {
      user_icon = h(Slide, {
        width: g.dim,
        center: true
      }, h('div', {
        onClick: function() {
          return actions.setModal('userSettings');
        },
        className: 'avatar',
        style: {
          cursor: 'pointer',
          width: '60%',
          height: '60%',
          'background-position': 'center',
          'background-size': 'cover',
          borderRadius: '50%',
          backgroundImage: 'url(' + props.state.user.thumb + ')',
          transform: ''
        }
      }));
    }
    left_options = props.left_options.map((function(_this) {
      return function(opt) {
        if (!opt.icon) {
          return opt;
        } else {
          return _this.opt(opt.icon, opt.action, opt.active, opt.hover, opt.w);
        }
      };
    })(this));
    return h(Slide, {
      className: 'main-menu b0',
      height: g.dim,
      beta: 100,
      vertical: false
    }, h(Slide, {
      beta: 100
    }, this.opt('home', this.goHome, props.state.view.main_view === 'user' || props.state.view.main_view === 'home'), left_options, props.left_children), h(Slide, {
      reverse: true
    }, more_btn_right, user_icon));
  };

  return Menu;

})(Component);

AddFriendView = (function(superClass) {
  extend(AddFriendView, superClass);

  function AddFriendView(props) {
    this.render = bind(this.render, this);
    AddFriendView.__super__.constructor.call(this, props);
    this.state = {
      selected: [],
      search: null
    };
  }

  AddFriendView.prototype.search = function() {
    return alert('search');
  };

  AddFriendView.prototype.componentDidMount = function() {
    return this._input.focus();
  };

  AddFriendView.prototype.render = function(props, state) {
    var results;
    results = props.view.search_users.map(function(u) {
      u.key = u._id;
      return h(User, u);
    });
    return h(Slide, {
      vertical: true,
      className: 'add-friend-view'
    }, h('div', {
      className: 'title'
    }, 'add friend'), h(Slide, {
      className: 'pad-5-5',
      center: true,
      vertical: false,
      height: g.dim
    }, h(InputText, {
      ref: (function(_this) {
        return function(e) {
          return _this._input = e;
        };
      })(this),
      onInput: (function(_this) {
        return function(e) {
          _this.setState({
            search: e.target.value
          });
          return actions.searchUsers(_this.state.search);
        };
      })(this),
      placeholder: 'search',
      value: this.state.search
    }), h(SlideButton, {
      vertical: false,
      reverse: true,
      width: g.dim,
      height: g.dim,
      pClass: 'b3',
      i: 'search',
      onClick: this.search
    })), h(Slide, {
      className: 'search-results'
    }, results));
  };

  return AddFriendView;

})(Component);

UserView = (function(superClass) {
  extend(UserView, superClass);

  function UserView(props) {
    this.render = bind(this.render, this);
    this.makeGroups = bind(this.makeGroups, this);
    UserView.__super__.constructor.call(this, props);
    this.state = {
      add_friend: false
    };
  }

  UserView.prototype.title = function(title) {
    return h(Slide, {
      className: 'title pad-0-0',
      height: 30
    }, title);
  };

  UserView.prototype.makeGroups = function(props) {
    var group_items;
    group_items = this.props.user.groups.map(function(g, i) {
      return h(GridItem, {
        i: i,
        w: 2,
        h: 1,
        key: g._id
      }, h(UserViewGroupItem, g));
    });
    group_items.push(h(GridItem, {
      w: 1,
      h: 1,
      key: 'add',
      i: group_items.length
    }, h(Button, {
      onClick: function() {
        return actions.setModal('newGroup');
      },
      className: 'add-btn',
      i: 'playlist_add'
    })));
    return group_items;
  };

  UserView.prototype.render = function(props, state) {
    var friend_items, group_items, user;
    user = props.user;
    group_items = friend_items = props.user.friends.map(function(g, i) {
      return h(GridItem, {
        i: i,
        w: 2,
        h: 1,
        key: g._id
      }, h(Item, g));
    });
    friend_items.push(h(GridItem, {
      i: friend_items.length,
      w: 1,
      h: 1,
      key: 'add'
    }, h(Button, {
      onClick: function() {
        return actions.setModal('addFriend');
      },
      className: 'add-btn',
      i: 'person_add'
    })));
    return h(Slide, {
      vertical: true,
      scroll: true,
      className: 'pad-50-50'
    }, this.title('my groups:'), h(Grid, {
      w: 8,
      fixed: true,
      max_reached: true
    }, this.makeGroups()), this.title('my friends:'), h(Grid, {
      show_loader: false,
      w: 8,
      fixed: true,
      max_reached: true
    }, friend_items));
  };

  return UserView;

})(Component);

MAX_NAME_LENGTH = 12;

UserSettings = (function(superClass) {
  extend(UserSettings, superClass);

  function UserSettings(props) {
    this.render = bind(this.render, this);
    this.save = bind(this.save, this);
    this.setPicture = bind(this.setPicture, this);
    UserSettings.__super__.constructor.call(this, props);
    if (props.user) {
      this.state = {
        ok: false,
        name: props.user.name,
        email: props.user.email,
        img: props.user.img
      };
    } else {
      this.state = {
        name: ''
      };
    }
  }

  UserSettings.prototype.componentDidMount = function() {
    return this._input.focus();
  };

  UserSettings.prototype.setPicture = function(e) {
    var file, url;
    file = e.target.files[0];
    url = URL.createObjectURL(file);
    return this.setState({
      file: file,
      img: url,
      ok: true
    });
  };

  UserSettings.prototype.save = function() {
    if (this.state.name.length > MAX_NAME_LENGTH) {
      actions.showError('name is too long max:' + MAX_NAME_LENGTH);
    }
    return actions.setUser({
      name: this.state.name,
      file: this.state.file
    });
  };

  UserSettings.prototype.render = function() {
    var user;
    user = h(User, {
      thumb: this.state.img,
      name: this.state.name
    });
    return h(Slide, {
      className: 'modal-link',
      auto: true,
      vertical: true,
      onEnter: this.save
    }, h(InputText, {
      onInput: (function(_this) {
        return function(e) {
          return _this.setState({
            ok: e.target.value && true,
            name: e.target.value
          });
        };
      })(this),
      ref: (function(_this) {
        return function(e) {
          return _this._input = e;
        };
      })(this),
      type: 'text',
      label: 'name',
      height: g.dim,
      value: this.state.name
    }), h(InputFile, {
      height: g.dim,
      onInput: this.setPicture,
      label: 'picture',
      value: null
    }), h(Slide, {
      height: g.dim * 3,
      center: true,
      vertical: true
    }, user), h(SlideButton, {
      outerClassName: 'input-amount-submit full-w',
      reverse: false,
      disabled: !this.state.ok,
      sClass: 'b2',
      pClass: 'b3',
      height: g.dim,
      vertical: false,
      onClick: this.save,
      label: 'save'
    }));
  };

  return UserSettings;

})(Component);

MainView = (function(superClass) {
  extend(MainView, superClass);

  MainView.getStores = function() {
    return [store];
  };

  MainView.getPropsFromStores = function() {
    return store.getState();
  };

  function MainView(props) {
    this.render = bind(this.render, this);
    this.logout = bind(this.logout, this);
    this.logout = bind(this.logout, this);
    MainView.__super__.constructor.call(this, props);
  }

  MainView.prototype.logout = function() {
    this.setState({
      show_more: false
    });
    return actions.logout();
  };

  MainView.prototype.componentDidMount = function() {
    return window.addEventListener('resize', (function(_this) {
      return function() {
        return _this.forceUpdate();
      };
    })(this));
  };

  MainView.prototype.opt = function(icon, onClick, label) {
    return h(SlideButton, {
      sClass: 'home-more-btn',
      pClass: 'b3 home-more-btn',
      vertical: false,
      dim: g.dim,
      reverse: true,
      index_offset: 5,
      i: icon,
      onClick: onClick,
      label: label
    });
  };

  MainView.prototype.logout = function() {
    return actions.logout();
  };

  MainView.prototype.goUserSettings = function() {
    return actions.setModal('userSettings');
  };

  MainView.prototype.render = function(props, state) {
    var main_bot, main_pos, main_top, menu;
    if (props.view.main_view === 'home') {
      main_top = h(HomeView, props);
    } else if (props.group) {
      main_top = h(GroupView, props);
    }
    if (props.user && props.view.main_view === 'user') {
      main_bot = h(UserView, props);
    }
    if (props.view.main_view === 'home') {
      main_pos = 0;
    } else if (props.view.main_view === 'user') {
      main_pos = 1;
    } else if (props.view.main_view === 'group') {
      main_pos = 0;
    }
    if (props.view.main_view === 'group' && (props.group != null)) {
      menu = h(Menu, {
        left_options: [
          h(SlideButton, {
            className: 'btn',
            sClass: 'blue',
            pClass: 'blue-inv',
            width: g.dim,
            vertical: true,
            reverse: false,
            i: 'add',
            active: props.view.modal_content === 'addTodo' || false,
            onClick: (function(_this) {
              return function() {
                return actions.setModal('addTodo');
              };
            })(this)
          }), h(SlideButton, {
            onClick: (function(_this) {
              return function() {
                return actions.setModal('linkGroup');
              };
            })(this),
            sClass: '',
            pClass: 'b3',
            width: g.dim,
            vertical: true,
            reverse: false,
            i: 'link',
            active: props.view.modal_content === 'linkGroup'
          }), h(SlideButton, {
            onClick: (function(_this) {
              return function() {
                return actions.setModal('editGroup');
              };
            })(this),
            sClass: '',
            pClass: 'b3',
            width: g.dim,
            vertical: true,
            reverse: false,
            i: 'settings',
            active: props.view.modal_content === 'editGroup'
          })
        ],
        left_children: [
          h('span', {
            className: 'list-title'
          }, props.group.name), h(Slide, {
            auto: true,
            center: true,
            className: 'list-count'
          }, doneText(props.group.done_count, props.group.total_count))
        ],
        show_more_right: this.props.view.show_more_right,
        state: props
      });
    } else if (props.view.main_view === 'user') {
      menu = h(Menu, {
        left_options: [
          h(SlideButton, {
            onClick: (function(_this) {
              return function() {
                return actions.setModal('newGroup');
              };
            })(this),
            sClass: 'blue',
            pClass: 'blue-inv',
            width: g.dim,
            vertical: true,
            i: 'playlist_add',
            active: props.view.modal_content === 'newGroup'
          }), h(SlideButton, {
            i: 'person_add',
            sClass: 'blue',
            pClass: 'blue-inv',
            width: g.dim,
            vertical: true,
            active: props.view.modal_content === 'addFriend',
            w: 1,
            onClick: (function(_this) {
              return function() {
                return actions.setModal('addFriend');
              };
            })(this)
          })
        ],
        show_more_right: this.props.view.show_more_right,
        state: props
      });
    }
    return h(Slide, {
      className: 'root-view',
      vertical: true,
      slide: true,
      pos: props.error ? 1 : 0
    }, h(Slide, {
      slide: true,
      vertical: false,
      pos: this.props.view.show_more_right && 1 || 0,
      outer_children: [
        h(ModalView, props), h(Overlay, {
          strokeStyle: g.light,
          show: props.error,
          dir: 'bottom',
          onClick: function() {
            return actions.setState({
              error: null
            });
          }
        })
      ]
    }, h(Slide, {
      beta: 100,
      vertical: true,
      outer_children: [
        h(Overlay, {
          dir: 'right',
          strokeStyle: g.light,
          show: props.view.show_more_right,
          onClick: function() {
            return actions.setView({
              show_more_right: false
            });
          }
        })
      ]
    }, menu, h(Slide, {
      beta: 100,
      slide: true,
      pos: main_pos,
      ease_dur: 0.3,
      vertical: true
    }, h(Slide, {
      beta: 100
    }, main_top), h(Slide, {
      beta: 100
    }, main_bot))), h(Slide, {
      dim: g.dim * 3,
      "class": 'b0',
      onMouseEnter: (function(_this) {
        return function() {
          return actions.setView({
            show_more_right: true
          });
        };
      })(this),
      vertical: true
    }, this.opt('exit_to_app', this.logout, 'logout'), this.opt('settings', this.goUserSettings, 'settings'))), h(Slide, {
      className: 'error-bg',
      height: g.dim,
      center: true
    }, props.error));
  };

  return MainView;

})(Component);

module.exports = connectToStores(MainView);


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(40);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



Object.defineProperty(exports, '__esModule', {
  value: true
});

var preact = __webpack_require__(0);

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

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = makeAction;

var _functions = __webpack_require__(2);

var fn = _interopRequireWildcard(_functions);

var _AltUtils = __webpack_require__(6);

var utils = _interopRequireWildcard(_AltUtils);

var _isPromise = __webpack_require__(44);

var _isPromise2 = _interopRequireDefault(_isPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function makeAction(alt, namespace, name, implementation, obj) {
  var id = utils.uid(alt._actionsRegistry, String(namespace) + '.' + String(name));
  alt._actionsRegistry[id] = 1;

  var data = { id: id, namespace: namespace, name: name };

  var dispatch = function dispatch(payload) {
    return alt.dispatch(id, payload, data);
  };

  // the action itself
  var action = function action() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var invocationResult = implementation.apply(obj, args);
    var actionResult = invocationResult;

    // async functions that return promises should not be dispatched
    if (invocationResult !== undefined && !(0, _isPromise2['default'])(invocationResult)) {
      if (fn.isFunction(invocationResult)) {
        // inner function result should be returned as an action result
        actionResult = invocationResult(dispatch, alt);
      } else {
        dispatch(invocationResult);
      }
    }

    if (invocationResult === undefined) {
      utils.warn('An action was called but nothing was dispatched');
    }

    return actionResult;
  };
  action.defer = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return setTimeout(function () {
      return action.apply(null, args);
    });
  };
  action.id = id;
  action.data = data;

  // ensure each reference is unique in the namespace
  var container = alt.actions[namespace];
  var namespaceId = utils.uid(container, name);
  container[namespaceId] = action;

  // generate a constant
  var constant = utils.formatAsConstant(namespaceId);
  container[constant] = id;

  return action;
}
module.exports = exports['default'];

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _functions = __webpack_require__(2);

var fn = _interopRequireWildcard(_functions);

var _transmitter = __webpack_require__(12);

var _transmitter2 = _interopRequireDefault(_transmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AltStore = function () {
  function AltStore(alt, model, state, StoreModel) {
    var _this = this;

    _classCallCheck(this, AltStore);

    var lifecycleEvents = model.lifecycleEvents;
    this.transmitter = (0, _transmitter2['default'])();
    this.lifecycle = function (event, x) {
      if (lifecycleEvents[event]) lifecycleEvents[event].publish(x);
    };
    this.state = state;

    this.alt = alt;
    this.preventDefault = false;
    this.displayName = model.displayName;
    this.boundListeners = model.boundListeners;
    this.StoreModel = StoreModel;
    this.reduce = model.reduce || function (x) {
      return x;
    };
    this.subscriptions = [];

    var output = model.output || function (x) {
      return x;
    };

    this.emitChange = function () {
      return _this.transmitter.publish(output(_this.state));
    };

    var handleDispatch = function handleDispatch(f, payload) {
      try {
        return f();
      } catch (e) {
        if (model.handlesOwnErrors) {
          _this.lifecycle('error', {
            error: e,
            payload: payload,
            state: _this.state
          });
          return false;
        }

        throw e;
      }
    };

    fn.assign(this, model.publicMethods);

    // Register dispatcher
    this.dispatchToken = alt.dispatcher.register(function (payload) {
      _this.preventDefault = false;

      _this.lifecycle('beforeEach', {
        payload: payload,
        state: _this.state
      });

      var actionHandlers = model.actionListeners[payload.action];

      if (actionHandlers || model.otherwise) {
        var result = void 0;

        if (actionHandlers) {
          result = handleDispatch(function () {
            return actionHandlers.filter(Boolean).every(function (handler) {
              return handler.call(model, payload.data, payload.action) !== false;
            });
          }, payload);
        } else {
          result = handleDispatch(function () {
            return model.otherwise(payload.data, payload.action);
          }, payload);
        }

        if (result !== false && !_this.preventDefault) _this.emitChange();
      }

      if (model.reduce) {
        handleDispatch(function () {
          var value = model.reduce(_this.state, payload);
          if (value !== undefined) _this.state = value;
        }, payload);
        if (!_this.preventDefault) _this.emitChange();
      }

      _this.lifecycle('afterEach', {
        payload: payload,
        state: _this.state
      });
    });

    this.lifecycle('init');
  }

  AltStore.prototype.listen = function () {
    function listen(cb) {
      var _this2 = this;

      if (!fn.isFunction(cb)) throw new TypeError('listen expects a function');

      var _transmitter$subscrib = this.transmitter.subscribe(cb);

      var dispose = _transmitter$subscrib.dispose;

      this.subscriptions.push({ cb: cb, dispose: dispose });
      return function () {
        _this2.lifecycle('unlisten');
        dispose();
      };
    }

    return listen;
  }();

  AltStore.prototype.unlisten = function () {
    function unlisten(cb) {
      this.lifecycle('unlisten');
      this.subscriptions.filter(function (subscription) {
        return subscription.cb === cb;
      }).forEach(function (subscription) {
        return subscription.dispose();
      });
    }

    return unlisten;
  }();

  AltStore.prototype.getState = function () {
    function getState() {
      return this.StoreModel.config.getState.call(this, this.state);
    }

    return getState;
  }();

  return AltStore;
}();

exports['default'] = AltStore;
module.exports = exports['default'];

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transmitter = __webpack_require__(12);

var _transmitter2 = _interopRequireDefault(_transmitter);

var _functions = __webpack_require__(2);

var fn = _interopRequireWildcard(_functions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var StoreMixin = {
  waitFor: function () {
    function waitFor() {
      for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
        sources[_key] = arguments[_key];
      }

      if (!sources.length) {
        throw new ReferenceError('Dispatch tokens not provided');
      }

      var sourcesArray = sources;
      if (sources.length === 1) {
        sourcesArray = Array.isArray(sources[0]) ? sources[0] : sources;
      }

      var tokens = sourcesArray.map(function (source) {
        return source.dispatchToken || source;
      });

      this.dispatcher.waitFor(tokens);
    }

    return waitFor;
  }(),
  exportAsync: function () {
    function exportAsync(asyncMethods) {
      this.registerAsync(asyncMethods);
    }

    return exportAsync;
  }(),
  registerAsync: function () {
    function registerAsync(asyncDef) {
      var _this = this;

      var loadCounter = 0;

      var asyncMethods = fn.isFunction(asyncDef) ? asyncDef(this.alt) : asyncDef;

      var toExport = Object.keys(asyncMethods).reduce(function (publicMethods, methodName) {
        var desc = asyncMethods[methodName];
        var spec = fn.isFunction(desc) ? desc(_this) : desc;

        var validHandlers = ['success', 'error', 'loading'];
        validHandlers.forEach(function (handler) {
          if (spec[handler] && !spec[handler].id) {
            throw new Error(String(handler) + ' handler must be an action function');
          }
        });

        publicMethods[methodName] = function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          var state = _this.getInstance().getState();
          var value = spec.local && spec.local.apply(spec, [state].concat(args));
          var shouldFetch = spec.shouldFetch ? spec.shouldFetch.apply(spec, [state].concat(args))
          /*eslint-disable*/
          : value == null;
          /*eslint-enable*/
          var intercept = spec.interceptResponse || function (x) {
            return x;
          };

          var makeActionHandler = function () {
            function makeActionHandler(action, isError) {
              return function (x) {
                var fire = function () {
                  function fire() {
                    loadCounter -= 1;
                    action(intercept(x, action, args));
                    if (isError) throw x;
                    return x;
                  }

                  return fire;
                }();
                return _this.alt.trapAsync ? function () {
                  return fire();
                } : fire();
              };
            }

            return makeActionHandler;
          }();

          // if we don't have it in cache then fetch it
          if (shouldFetch) {
            loadCounter += 1;
            /* istanbul ignore else */
            if (spec.loading) spec.loading(intercept(null, spec.loading, args));
            return spec.remote.apply(spec, [state].concat(args)).then(makeActionHandler(spec.success), makeActionHandler(spec.error, 1));
          }

          // otherwise emit the change now
          _this.emitChange();
          return value;
        };

        return publicMethods;
      }, {});

      this.exportPublicMethods(toExport);
      this.exportPublicMethods({
        isLoading: function () {
          function isLoading() {
            return loadCounter > 0;
          }

          return isLoading;
        }()
      });
    }

    return registerAsync;
  }(),
  exportPublicMethods: function () {
    function exportPublicMethods(methods) {
      var _this2 = this;

      fn.eachObject(function (methodName, value) {
        if (!fn.isFunction(value)) {
          throw new TypeError('exportPublicMethods expects a function');
        }

        _this2.publicMethods[methodName] = value;
      }, [methods]);
    }

    return exportPublicMethods;
  }(),
  emitChange: function () {
    function emitChange() {
      this.getInstance().emitChange();
    }

    return emitChange;
  }(),
  on: function () {
    function on(lifecycleEvent, handler) {
      if (lifecycleEvent === 'error') this.handlesOwnErrors = true;
      var bus = this.lifecycleEvents[lifecycleEvent] || (0, _transmitter2['default'])();
      this.lifecycleEvents[lifecycleEvent] = bus;
      return bus.subscribe(handler.bind(this));
    }

    return on;
  }(),
  bindAction: function () {
    function bindAction(symbol, handler) {
      if (!symbol) {
        throw new ReferenceError('Invalid action reference passed in');
      }
      if (!fn.isFunction(handler)) {
        throw new TypeError('bindAction expects a function');
      }

      // You can pass in the constant or the function itself
      var key = symbol.id ? symbol.id : symbol;
      this.actionListeners[key] = this.actionListeners[key] || [];
      this.actionListeners[key].push(handler.bind(this));
      this.boundListeners.push(key);
    }

    return bindAction;
  }(),
  bindActions: function () {
    function bindActions(actions) {
      var _this3 = this;

      fn.eachObject(function (action, symbol) {
        var matchFirstCharacter = /./;
        var assumedEventHandler = action.replace(matchFirstCharacter, function (x) {
          return 'on' + String(x[0].toUpperCase());
        });

        if (_this3[action] && _this3[assumedEventHandler]) {
          // If you have both action and onAction
          throw new ReferenceError('You have multiple action handlers bound to an action: ' + (String(action) + ' and ' + String(assumedEventHandler)));
        }

        var handler = _this3[action] || _this3[assumedEventHandler];
        if (handler) {
          _this3.bindAction(symbol, handler);
        }
      }, [actions]);
    }

    return bindActions;
  }(),
  bindListeners: function () {
    function bindListeners(obj) {
      var _this4 = this;

      fn.eachObject(function (methodName, symbol) {
        var listener = _this4[methodName];

        if (!listener) {
          throw new ReferenceError(String(methodName) + ' defined but does not exist in ' + String(_this4.displayName));
        }

        if (Array.isArray(symbol)) {
          symbol.forEach(function (action) {
            _this4.bindAction(action, listener);
          });
        } else {
          _this4.bindAction(symbol, listener);
        }
      }, [obj]);
    }

    return bindListeners;
  }()
};

exports['default'] = StoreMixin;
module.exports = exports['default'];

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStoreConfig = createStoreConfig;
exports.transformStore = transformStore;
exports.createStoreFromObject = createStoreFromObject;
exports.createStoreFromClass = createStoreFromClass;

var _AltUtils = __webpack_require__(6);

var utils = _interopRequireWildcard(_AltUtils);

var _functions = __webpack_require__(2);

var fn = _interopRequireWildcard(_functions);

var _AltStore = __webpack_require__(22);

var _AltStore2 = _interopRequireDefault(_AltStore);

var _StoreMixin = __webpack_require__(23);

var _StoreMixin2 = _interopRequireDefault(_StoreMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function doSetState(store, storeInstance, state) {
  if (!state) {
    return;
  }

  var config = storeInstance.StoreModel.config;


  var nextState = fn.isFunction(state) ? state(storeInstance.state) : state;

  storeInstance.state = config.setState.call(store, storeInstance.state, nextState);

  if (!store.alt.dispatcher.isDispatching()) {
    store.emitChange();
  }
}

function createPrototype(proto, alt, key, extras) {
  return fn.assign(proto, _StoreMixin2['default'], {
    displayName: key,
    alt: alt,
    dispatcher: alt.dispatcher,
    preventDefault: function () {
      function preventDefault() {
        this.getInstance().preventDefault = true;
      }

      return preventDefault;
    }(),

    boundListeners: [],
    lifecycleEvents: {},
    actionListeners: {},
    publicMethods: {},
    handlesOwnErrors: false
  }, extras);
}

function createStoreConfig(globalConfig, StoreModel) {
  StoreModel.config = fn.assign({
    getState: function () {
      function getState(state) {
        if (Array.isArray(state)) {
          return state.slice();
        } else if (fn.isMutableObject(state)) {
          return fn.assign({}, state);
        }

        return state;
      }

      return getState;
    }(),
    setState: function () {
      function setState(currentState, nextState) {
        if (fn.isMutableObject(nextState)) {
          return fn.assign(currentState, nextState);
        }
        return nextState;
      }

      return setState;
    }()
  }, globalConfig, StoreModel.config);
}

function transformStore(transforms, StoreModel) {
  return transforms.reduce(function (Store, transform) {
    return transform(Store);
  }, StoreModel);
}

function createStoreFromObject(alt, StoreModel, key) {
  var storeInstance = void 0;

  var StoreProto = createPrototype({}, alt, key, fn.assign({
    getInstance: function () {
      function getInstance() {
        return storeInstance;
      }

      return getInstance;
    }(),
    setState: function () {
      function setState(nextState) {
        doSetState(this, storeInstance, nextState);
      }

      return setState;
    }()
  }, StoreModel));

  // bind the store listeners
  /* istanbul ignore else */
  if (StoreProto.bindListeners) {
    _StoreMixin2['default'].bindListeners.call(StoreProto, StoreProto.bindListeners);
  }
  /* istanbul ignore else */
  if (StoreProto.observe) {
    _StoreMixin2['default'].bindListeners.call(StoreProto, StoreProto.observe(alt));
  }

  // bind the lifecycle events
  /* istanbul ignore else */
  if (StoreProto.lifecycle) {
    fn.eachObject(function (eventName, event) {
      _StoreMixin2['default'].on.call(StoreProto, eventName, event);
    }, [StoreProto.lifecycle]);
  }

  // create the instance and fn.assign the public methods to the instance
  storeInstance = fn.assign(new _AltStore2['default'](alt, StoreProto, StoreProto.state !== undefined ? StoreProto.state : {}, StoreModel), StoreProto.publicMethods, {
    displayName: key,
    config: StoreModel.config
  });

  return storeInstance;
}

function createStoreFromClass(alt, StoreModel, key) {
  var storeInstance = void 0;
  var config = StoreModel.config;

  // Creating a class here so we don't overload the provided store's
  // prototype with the mixin behaviour and I'm extending from StoreModel
  // so we can inherit any extensions from the provided store.

  var Store = function (_StoreModel) {
    _inherits(Store, _StoreModel);

    function Store() {
      _classCallCheck(this, Store);

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _possibleConstructorReturn(this, _StoreModel.call.apply(_StoreModel, [this].concat(args)));
    }

    return Store;
  }(StoreModel);

  createPrototype(Store.prototype, alt, key, {
    type: 'AltStore',
    getInstance: function () {
      function getInstance() {
        return storeInstance;
      }

      return getInstance;
    }(),
    setState: function () {
      function setState(nextState) {
        doSetState(this, storeInstance, nextState);
      }

      return setState;
    }()
  });

  for (var _len = arguments.length, argsForClass = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    argsForClass[_key - 3] = arguments[_key];
  }

  var store = new (Function.prototype.bind.apply(Store, [null].concat(argsForClass)))();

  /* istanbul ignore next */
  if (config.bindListeners) store.bindListeners(config.bindListeners);
  /* istanbul ignore next */
  if (config.datasource) store.registerAsync(config.datasource);

  storeInstance = fn.assign(new _AltStore2['default'](alt, store, store.state !== undefined ? store.state : store, StoreModel), utils.getInternalMethods(StoreModel), config.publicMethods, { displayName: key });

  return storeInstance;
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAppState = setAppState;
exports.snapshot = snapshot;
exports.saveInitialSnapshot = saveInitialSnapshot;
exports.filterSnapshots = filterSnapshots;

var _functions = __webpack_require__(2);

var fn = _interopRequireWildcard(_functions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function setAppState(instance, data, onStore) {
  var obj = instance.deserialize(data);
  fn.eachObject(function (key, value) {
    var store = instance.stores[key];
    if (store) {
      (function () {
        var config = store.StoreModel.config;

        var state = store.state;
        if (config.onDeserialize) obj[key] = config.onDeserialize(value) || value;
        if (fn.isMutableObject(state)) {
          fn.eachObject(function (k) {
            return delete state[k];
          }, [state]);
          fn.assign(state, obj[key]);
        } else {
          store.state = obj[key];
        }
        onStore(store, store.state);
      })();
    }
  }, [obj]);
}

function snapshot(instance) {
  var storeNames = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var stores = storeNames.length ? storeNames : Object.keys(instance.stores);
  return stores.reduce(function (obj, storeHandle) {
    var storeName = storeHandle.displayName || storeHandle;
    var store = instance.stores[storeName];
    var config = store.StoreModel.config;

    store.lifecycle('snapshot');
    var customSnapshot = config.onSerialize && config.onSerialize(store.state);
    obj[storeName] = customSnapshot ? customSnapshot : store.getState();
    return obj;
  }, {});
}

function saveInitialSnapshot(instance, key) {
  var state = instance.deserialize(instance.serialize(instance.stores[key].state));
  instance._initSnapshot[key] = state;
  instance._lastSnapshot[key] = state;
}

function filterSnapshots(instance, state, stores) {
  return stores.reduce(function (obj, store) {
    var storeName = store.displayName || store;
    if (!state[storeName]) {
      throw new ReferenceError(String(storeName) + ' is not a valid store');
    }
    obj[storeName] = state[storeName];
    return obj;
  }, {});
}

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_preact__);
var Alt, View;

__webpack_require__(15);



window.addEventListener('mousemove', function(e) {
  g.mouse[0] = e.clientX;
  return g.mouse[1] = e.clientY;
});

window.g = {
  isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  colors: ['#aa00ff', '#ff0000', '#0088ff', '#e55c00', '#00d991', '#3600cc', '#bf0000', '#0077b3', '#ff0044', '#00ccff', '#00f2e2', '#d9ca00', '#36cc00', '#bf00b3', '#b27700', '#b20047'],
  dim: 50,
  dark: '#171a1c',
  mouse: [window.innerWidth / 2, window.innerHeight / 2],
  light: '#fff',
  slide_duration: 400,
  small_width: window.innerWidth < 500,
  origin: 'http://localhost:8787'
};

Alt = __webpack_require__(16);

window.alt = new Alt();

window.actions = __webpack_require__(7);

window.store = __webpack_require__(17);

View = __webpack_require__(18);

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_preact__["render"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_preact__["h"])(View, {}), document.getElementById('checki'));

__webpack_require__(19);


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var Component, Slide, Viewer, h, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

Slide = __webpack_require__(5);

Viewer = (function(superClass) {
  extend(Viewer, superClass);

  function Viewer(props) {
    this.render = bind(this.render, this);
    this.onWheelDelta = bind(this.onWheelDelta, this);
    this.onMouseMove = bind(this.onMouseMove, this);
    this.imageLoaded = bind(this.imageLoaded, this);
    this.onUpdate = bind(this.onUpdate, this);
    Viewer.__super__.constructor.call(this, props);
    this.state = {
      loaded: false,
      scale: 1,
      min_scale: 1
    };
    this.stage = {};
  }

  Viewer.prototype.onUpdate = function() {
    var str;
    if (!this._img) {
      return;
    }
    str = 'translate3d(' + this.stage.x + 'px,' + this.stage.y + 'px,0px) scale(' + this.stage.scale + ')';
    return this._img.style.transform = str;
  };

  Viewer.prototype.imageLoaded = function() {
    var c_h, c_w, i_h, i_w;
    this.setInitialScale();
    if (!this._img) {
      return;
    }
    i_w = this._img.naturalWidth;
    i_h = this._img.naturalHeight;
    c_w = this._root.clientWidth;
    c_h = this._root.clientHeight;
    this._img.style.width = i_w;
    this._img.style.height = i_h;
    TweenLite.set(this.stage, {
      x: c_w / 2 - i_w / 2,
      y: c_h / 2 - i_h / 2
    });
    this.onUpdate();
    return this.setState({
      loaded: true
    });
  };

  Viewer.prototype.setInitialScale = function() {
    var c_h, c_w, i_h, i_w, s, s_h, s_w;
    if (!this._img) {
      return;
    }
    i_w = this._img.naturalWidth;
    i_h = this._img.naturalHeight;
    c_w = this._root.clientWidth;
    c_h = this._root.clientHeight;
    if (i_w <= c_w && i_h <= c_h) {
      return;
    }
    s_w = c_w / i_w * 0.9;
    s_h = c_h / i_h * 0.9;
    if (s_h < s_w) {
      s = s_h;
    } else {
      s = s_w;
    }
    this.state.min_scale = s;
    this.state.scale = s;
    return TweenLite.set(this.stage, {
      scale: s,
      onUpdate: this.onUpdate
    });
  };

  Viewer.prototype.onMouseMove = function(e, get) {
    var c_h, c_w, c_x, c_y, i_h, i_h0, i_w, i_w0, i_x, i_y, x, y;
    if (!this._img) {
      return;
    }
    i_w0 = this._img.naturalWidth;
    i_h0 = this._img.naturalHeight;
    i_w = this._img.naturalWidth * this.state.scale;
    i_h = this._img.naturalHeight * this.state.scale;
    c_w = this._root.clientWidth;
    c_h = this._root.clientHeight;
    i_x = (-e.layerX + c_w / 2) * 1.3;
    c_x = c_w / 2 - i_w0 / 2;
    i_y = (-(e.clientY - this.pos.top) + c_h / 2) * 1.15;
    c_y = c_h / 2 - i_h0 / 2;
    x = c_x + (i_x * (i_w - c_w) / c_w);
    y = c_y + (i_y * (i_h - c_h) / c_h);
    if (i_w <= c_w) {
      x = c_w / 2 - i_w0 / 2;
    }
    if (i_h <= c_h) {
      y = c_h / 2 - i_h0 / 2;
    }
    if (get === true) {
      return [x, y];
    }
    return TweenLite.to(this.stage, 0.2, {
      x: x,
      y: y,
      onUpdate: this.onUpdate
    });
  };

  Viewer.prototype.onWheelDelta = function(e) {
    var c_h, c_w, i_h, i_h0, i_w, i_w0, n_s, pos;
    if (!this._img) {
      return;
    }
    this.state.scale = this.state.scale + e.deltaY * 0.005;
    if (this.state.scale > 1) {
      this.state.scale = 1;
    } else if (this.state.scale < this.state.min_scale) {
      this.state.scale = this.state.min_scale;
    }
    i_w0 = this._img.naturalWidth;
    i_h0 = this._img.naturalHeight;
    i_w = this._img.naturalWidth * this.state.scale;
    i_h = this._img.naturalHeight * this.state.scale;
    c_w = this._root.clientWidth;
    c_h = this._root.clientHeight;
    n_s = {};
    n_s.scale = this.state.scale;
    if (i_w <= c_w) {
      n_s.x = c_w / 2 - i_w0 / 2;
    }
    if (i_h <= c_h) {
      n_s.y = c_h / 2 - i_h0 / 2;
    }
    pos = this.onMouseMove(e, true);
    if (!pos.length) {
      return;
    }
    n_s.x = pos[0];
    n_s.y = pos[1];
    n_s.onUpdate = this.onUpdate;
    return TweenLite.to(this.stage, 0.4, n_s);
  };

  Viewer.prototype.flushState = function() {
    this.state.loaded = false;
    this.stage = {};
    return this.min_scale = 1;
  };

  Viewer.prototype.componentDidUpdate = function(props) {
    return this.pos = this._root.getBoundingClientRect();
  };

  Viewer.prototype.componentDidMount = function() {
    this.state.scale = 1;
    this.state.min_scale = 1;
    this.pos = this._root.getBoundingClientRect();
    if (this.state.loaded === false) {
      if (this._img.complete) {
        return this.imageLoaded();
      }
    }
  };

  Viewer.prototype.render = function(props) {
    var loader;
    if (!this.state.loaded) {
      loader = h('div', {
        className: '-i-loader'
      });
    }
    return h('div', {
      ref: (function(_this) {
        return function(e) {
          return _this._root = e;
        };
      })(this),
      onMouseMove: this.onMouseMove,
      onMouseWheel: this.onWheelDelta,
      className: '-i-viewer',
      id: '-i-viewer',
      onClick: (function(_this) {
        return function(e) {
          if (_this.props.onClick) {
            return _this.props.onClick(e);
          }
        };
      })(this)
    }, h('img', {
      id: '-i-viewer-image',
      onClick: (function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        };
      })(this),
      ref: (function(_this) {
        return function(e) {
          return _this._img = e;
        };
      })(this),
      src: this.props.img,
      onLoad: this.imageLoaded,
      className: '-i-viewer-image ' + (!this.state.loaded && 'hidden' || "")
    }), loader);
  };

  return Viewer;

})(Component);

module.exports = Viewer;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var Component, Grid, GridItem, el, h, ref,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

__webpack_require__(50);

el = h;

GridItem = (function(superClass) {
  extend(GridItem, superClass);

  function GridItem(props) {
    GridItem.__super__.constructor.call(this, props);
    this.state = {
      hidden: false,
      show: false
    };
    this.state_show = false;
    if (props.w === 0 || props.h === 0) {
      throw new Error('invalid grid item w/h ' + w + ',' + h);
    }
  }

  GridItem.prototype.componentWillMount = function() {
    return this.state_show = false;
  };

  GridItem.prototype.show = function(set, delay) {
    var base;
    if (this.hide_t) {
      clearTimeout(this.hide_t);
      this.hide_t = null;
    }
    this.hide_t = setTimeout((function(_this) {
      return function() {
        var ref1, ref2;
        if (!_this._item) {
          return;
        }
        _this.state.transition = 'transform ' + _this.props.ease_dur + 's cubic-bezier(.29,.3,.08,1)';
        _this.state.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1)';
        if ((ref1 = _this._item) != null) {
          ref1.style.transition = _this.state.transition;
        }
        return (ref2 = _this._item) != null ? ref2.style.transform = _this.state.transform : void 0;
      };
    })(this), delay);
    return typeof (base = this.props).onShow === "function" ? base.onShow() : void 0;
  };

  GridItem.prototype.render = function() {
    var d;
    if (this.state.show !== this.props.show) {
      this.state.show = this.props.show;
      this.setState();
      if (this.state.show === true) {
        if (this.props.w > this.props.h) {
          this.state.transform = 'matrix3d(0.6,0,0.00,' + (-0.001 + Math.random() * 0.002) + ',0.00,0,1.00,-0.003,0,-1,0,0,0,0,0,1)';
        } else {
          this.state.transform = 'matrix3d(0,0,1,' + (-0.001 + Math.random() * 0.002) + ',0.00,0.6,0.00,0.001,-1,0,0,0,0,0,0,1)';
        }
        this.state.transition = '';
        this.show(false, 50 + Math.random() * 100);
      }
    }
    d = this.context.dim;
    return el('div', {
      className: '-i-grid-item-outer ' + (this.props["class"] || this.props.className || this.props.outerClassName || ''),
      ref: (function(_this) {
        return function(e) {
          return _this._item = e;
        };
      })(this),
      style: {
        visibility: !this.props.show && 'hidden' || 'initial',
        transition: this.state.transition,
        transform: this.state.transform,
        left: (this.props.c / this.context.w * 100) + '%',
        top: (this.props.r * d) + 'px',
        height: (this.props.h * d) + 'px',
        width: (this.props.w / this.context.w * 100) + '%'
      }
    }, this.props.children);
  };

  return GridItem;

})(Component);

GridItem.defaultProps = {
  w: 1,
  h: 1,
  show: true,
  ease_dur: 0.4
};

Grid = (function(superClass) {
  extend(Grid, superClass);

  function Grid(props) {
    this.render = bind(this.render, this);
    this.onScroll = bind(this.onScroll, this);
    this.offsetChildren = bind(this.offsetChildren, this);
    this.getDim = bind(this.getDim, this);
    this.getChildContext = bind(this.getChildContext, this);
    Grid.__super__.constructor.call(this, props);
    this.state = {
      min_row_index: 0,
      display_children: [],
      index_array: [],
      child_props: [],
      inner_width: 0
    };
  }

  Grid.prototype.getChildContext = function() {
    return {
      animate: this.props.animate,
      w: this.props.w,
      dim: this.getDim()
    };
  };

  Grid.prototype.componentWillRecieveProps = function(props) {
    if (props.innerClass) {
      props.iclass = props.innerClass;
    }
    if (props.outerClass) {
      props.oclass = props.outerClass;
    }
    if (props.className) {
      props.oclass = props.className;
    }
    if (props.outerClass) {
      return props.oclass = props.outerClass;
    }
  };

  Grid.prototype.componentWillUnmount = function() {
    this._outer.removeEventListener('scroll', this.onScroll);
    return clearInterval(this.check_end_interval);
  };

  Grid.prototype.addChildSpot = function(child) {
    var w;
    if ((child.attributes.r != null) && (child.attributes.c != null)) {
      return child;
    }
    w = child.attributes.w;
    return h = child.attributes.h;
  };

  Grid.prototype.checkSpot = function(r, c, w, h, arr) {
    var col, j, k, ref1, ref2, ref3, ref4, row;
    if (arr[r][c] > -1) {
      return false;
    }
    for (row = j = ref1 = r, ref2 = r + h; ref1 <= ref2 ? j < ref2 : j > ref2; row = ref1 <= ref2 ? ++j : --j) {
      for (col = k = ref3 = c, ref4 = c + w; ref3 <= ref4 ? k < ref4 : k > ref4; col = ref3 <= ref4 ? ++k : --k) {
        if ((arr[row] != null) && (arr[row][col] != null)) {
          if (arr[row][col] > -1) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    return true;
  };

  Grid.prototype.fillSpot = function(w, h, r, c, arr, index) {
    var col, j, ref1, ref2, results, row;
    results = [];
    for (row = j = ref1 = r, ref2 = r + h; ref1 <= ref2 ? j < ref2 : j > ref2; row = ref1 <= ref2 ? ++j : --j) {
      results.push((function() {
        var k, ref3, ref4, results1;
        results1 = [];
        for (col = k = ref3 = c, ref4 = c + w; ref3 <= ref4 ? k < ref4 : k > ref4; col = ref3 <= ref4 ? ++k : --k) {
          if ((arr[row] != null) && (arr[row][col] != null)) {
            results1.push(arr[row][col] = index);
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    }
    return results;
  };

  Grid.prototype.addSpots = function(h, arr) {
    var c, i, j, k, ref1, ref2, results, row;
    results = [];
    for (i = j = 0, ref1 = h; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
      row = [];
      for (c = k = 0, ref2 = this.props.w; 0 <= ref2 ? k < ref2 : k > ref2; c = 0 <= ref2 ? ++k : --k) {
        row[c] = -1;
      }
      results.push(arr.push(row));
    }
    return results;
  };

  Grid.prototype.getSpot = function(w, h, arr) {
    var col, found, j, k, len, min_r_i, ref1, ref2, ref3, row, row_filled, spot;
    min_r_i = 0;
    found = false;
    row_filled = true;
    if ((arr.length - this.state.min_row_index) < h) {
      this.addSpots(h, arr);
    }
    for (row = j = ref1 = this.state.min_row_index, ref2 = arr.length; ref1 <= ref2 ? j < ref2 : j > ref2; row = ref1 <= ref2 ? ++j : --j) {
      ref3 = arr[row];
      for (col = k = 0, len = ref3.length; k < len; col = ++k) {
        spot = ref3[col];
        if (spot > -1) {
          row_filled = false;
        } else if (this.checkSpot(row, col, w, h, arr)) {
          return [row, col];
        }
      }
      if (row_filled) {
        this.state.min_row_index = row;
      }
    }
    this.addSpots(h, arr);
    return this.getSpot(w, h, arr);
  };

  Grid.prototype.flushState = function() {
    this.state.display_children = [];
    this.state.index_array = [];
    this.state.min_row_index = 0;
    this.state.row_h = null;
    this.state.row_n = null;
    this.state.row_top = null;
    this.state.row_bot = null;
    return this.state.offset_update = null;
  };

  Grid.prototype.addChild = function(child, index) {
    var col, ref1, row, w;
    w = child.attributes.w;
    h = child.attributes.h;
    ref1 = this.getSpot(w, h, this.state.index_array), row = ref1[0], col = ref1[1];
    this.state.child_props[index] = {
      r: row,
      c: col
    };
    return this.fillSpot(w, h, row, col, this.state.index_array, index);
  };

  Grid.prototype.setChildren = function(children) {
    var child, i, j, len;
    this.flushState();
    for (i = j = 0, len = children.length; j < len; i = ++j) {
      child = children[i];
      this.addChild(child, i);
    }
    return children;
  };

  Grid.prototype.appendChildren = function(children) {
    var child, i, j, len;
    for (i = j = 0, len = children.length; j < len; i = ++j) {
      child = children[i];
      if ((child.attributes.r != null) && (child.attributes.c != null)) {
        continue;
      }
      this.addChild(child, i);
    }
    return children;
  };

  Grid.prototype.getDim = function() {
    var ref1;
    return ((ref1 = this._inner) != null ? ref1.clientWidth : void 0) / this.props.w;
  };

  Grid.prototype.getInnerHeight = function() {
    return this.getDim() * this.state.index_array.length;
  };

  Grid.prototype.offsetChildren = function(children) {
    var added, arr, dim, display_children, j, k, len, ref1, ref2, ref3, row, row_bot, row_h, row_n, row_top, spot;
    arr = this.state.index_array;
    dim = this.getDim();
    row_h = Math.round(this._outer.clientHeight / dim);
    row_n = Math.round((this.props.offset_height_factor * this._outer.clientHeight) / dim);
    row_top = Math.round(this._outer.scrollTop / dim);
    row_top += Math.round(row_h / 2 - row_n / 2);
    row_bot = Math.round(row_top + row_n);
    if (row_top < 0) {
      row_top = 0;
    }
    if (row_bot > arr.length) {
      row_bot = arr.length;
    }
    if (row_top > arr.length) {
      row_top = 0;
    }
    if (this.state.row_h === row_h && row_n === this.state.row_n && row_top === this.state.row_top && row_bot === this.state.row_bot) {
      return this.state.display_children;
    }
    this.state.row_scroll_top = Math.round(this._outer.scrollTop / dim);
    this.state.row_h = row_h;
    this.state.row_n = row_n;
    this.state.row_top = row_top;
    this.state.row_bot = row_bot;
    this.state.offset_update = true;
    display_children = [];
    added = [];
    for (row = j = ref1 = row_top, ref2 = row_bot; ref1 <= ref2 ? j < ref2 : j > ref2; row = ref1 <= ref2 ? ++j : --j) {
      ref3 = arr[row];
      for (k = 0, len = ref3.length; k < len; k++) {
        spot = ref3[k];
        if (spot === -1) {
          continue;
        }
        if (!(added[spot] != null)) {
          added[spot] = true;
          if (this.state.scroll_up) {
            display_children[display_children.length] = children[spot];
          } else {
            display_children.unshift(children[spot]);
          }
        }
      }
    }
    return display_children;
  };

  Grid.prototype.updateGrid = function(oldProps, newProps) {
    if (oldProps.children.length !== newProps.children.length || oldProps.list_key !== newProps.list_key) {
      if (this.props.fixed) {
        this.state.display_children = this.setChildren(newProps.children);
      } else {
        this.state.display_children = this.offsetChildren(this.setChildren(newProps.children));
      }
    }
    if (oldProps.append_children.length !== newProps.append_children.length) {
      if (this.props.fixed) {
        return this.appendChildren(newProps.children);
      } else {
        return this.state.display_children = this.offsetChildren(this.appendChildren(newProps.children));
      }
    }
  };

  Grid.prototype.onScroll = function() {
    if (this.state.last_scroll > this._outer.scrollTop) {
      this.state.scroll_up = true;
    } else {
      this.state.scroll_up = false;
    }
    this.state.last_scroll = this._outer.scrollTop;
    this.state.display_children = this.offsetChildren(this.props.children);
    if (this.state.offset_update) {
      return this.forceUpdate();
    }
  };

  Grid.prototype.componentDidMount = function() {
    this._outer.addEventListener('scroll', this.onScroll);
    return setTimeout((function(_this) {
      return function() {
        if (_this.props.fixed) {
          _this.state.display_children = _this.setChildren(_this.props.children);
        } else {
          _this.state.display_children = _this.offsetChildren(_this.setChildren(_this.props.children));
        }
        return _this.forceUpdate();
      };
    })(this), 0);
  };

  Grid.prototype.updateScroll = function() {
    return this._outer.scrollTop = this.state.row_scroll_top * this.getDim();
  };

  Grid.prototype.componentWillUpdate = function(newProps) {
    if (this._inner.clientWidth !== this.state.inner_width) {
      this.updateScroll();
      this.state.inner_width = this._inner.clientWidth;
    }
    return this.updateGrid(this.props, newProps);
  };

  Grid.prototype.childVisible = function(c) {
    var bot, d, max, min, top;
    d = this.getDim();
    min = this._outer.scrollTop - 100;
    max = this._outer.scrollTop + this._outer.clientHeight + 100;
    top = c.attributes.r * d;
    bot = top + c.attributes.h * d;
    if (this._outer != null) {
      if (min <= bot && top <= max) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  Grid.prototype.render = function() {
    var c, i, j, len, loader, ref1, stop_loader;
    this.state.display_children = this.state.display_children.map((function(_this) {
      return function(c) {
        if (!c) {
          return null;
        }
        return _this.props.children[c.attributes.i];
      };
    })(this));
    ref1 = this.state.display_children;
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      c = ref1[i];
      if ((c == null) || !this.state.child_props.length) {
        continue;
      }
      c.attributes.r = this.state.child_props[c.attributes.i].r;
      c.attributes.c = this.state.child_props[c.attributes.i].c;
      c.attributes.show = this.props.fixed ? true : this.childVisible(c);
    }
    if (this.props.show_loader) {
      stop_loader = this.props.max_reached && this.max_scroll_pos >= this.total_max_pos && '-i-loader-stop' || '';
      loader = h('div', {
        className: "-i-loader " + (stop_loader || '')
      });
    }
    this.state.offset_update = false;
    return el('div', {
      key: this.key,
      ref: (function(_this) {
        return function(e) {
          return _this._outer = e;
        };
      })(this),
      className: "-i-grid " + (this.props.fixed && '-i-grid-fixed' || '') + " " + (this.props.oclass || this.props["class"] || this.props.className)
    }, this.props.pre_children, el('div', {
      style: {
        height: this.getInnerHeight() + 'px'
      },
      ref: (function(_this) {
        return function(e) {
          return _this._inner = e;
        };
      })(this),
      className: "-i-grid-inner " + (this.props.iclass || '')
    }, this.state.display_children, loader), this.props.post_children);
  };

  return Grid;

})(Component);

Grid.defaultProps = {
  animate: true,
  append_children: [],
  children: [],
  pre_children: [],
  fixed: false,
  post_children: [],
  offset_height_factor: 1.5,
  w: 4
};

module.exports = {
  GridItem: GridItem,
  Grid: Grid
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var Component, Input, InputFile, cn, h, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Input = __webpack_require__(8);

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

cn = __webpack_require__(1);

InputFile = (function(superClass) {
  extend(InputFile, superClass);

  function InputFile(props) {
    this.render = bind(this.render, this);
    this.onInput = bind(this.onInput, this);
    this.onClick = bind(this.onClick, this);
    this.onBlur = bind(this.onBlur, this);
    this.state = {
      focus: false,
      initial_value: props.value,
      value: props.value,
      clicked: false
    };
  }

  InputFile.prototype.onBlur = function(e) {
    return console.log('blur');
  };

  InputFile.prototype.onClick = function(e) {
    var e_n;
    if (this.state.clicked) {
      this.setState({
        clicked: false
      });
      return false;
    }
    this.setState({
      clicked: true
    });
    e_n = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    return this._file.dispatchEvent(e_n);
  };

  InputFile.prototype.onInput = function(e) {
    console.log("ON INPUT");
    this.setState({
      initial_value: null,
      value: e.target.files[0].name
    });
    return this.props.onInput && this.props.onInput(e);
  };

  InputFile.prototype.render = function() {
    var icon, label, style;
    if (this.props.barColor) {
      style = {
        'border-color': this.props.barColor
      };
    }
    return h(Input, {
      onClick: this.onClick,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      disabled: this.props.disabled,
      label: this.props.label,
      className: cn('file', this.props.className, !this.state.value && 'focus', (this.state.focus || this.state.value) && 'has-data')
    }, label = h('input', {
      type: 'text',
      disabled: true,
      style: style,
      className: cn('-i-input-text', !this.state.value && 'hidden'),
      value: this.state.value
    }), icon = h('i', {
      className: cn('material-icons', this.state.value && 'hidden')
    }, 'file_upload'), h('input', {
      name: this.props.name,
      value: this.state.initial_value || this.state.value,
      type: 'file',
      ref: (function(_this) {
        return function(e) {
          return _this._file = e;
        };
      })(this),
      onBlur: this.onBlur,
      onChange: this.onInput
    }));
  };

  return InputFile;

})(Component);

module.exports = InputFile;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var Component, Input, InputText, cn, h, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Input = __webpack_require__(8);

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

cn = __webpack_require__(1);

InputText = (function(superClass) {
  extend(InputText, superClass);

  function InputText(props) {
    this.render = bind(this.render, this);
    this.componentWillUpdate = bind(this.componentWillUpdate, this);
    this.onKey = bind(this.onKey, this);
    this.onBlur = bind(this.onBlur, this);
    this.onInput = bind(this.onInput, this);
    this.onFocus = bind(this.onFocus, this);
    this.state = {
      focus: false,
      initial_value: props.value,
      value: props.value
    };
  }

  InputText.prototype.onFocus = function() {
    if (this.state.focus || this.props.disabled) {
      return false;
    }
    this.setState({
      focus: true
    });
    return this._input.focus();
  };

  InputText.prototype.onInput = function(e) {
    return this.props.onInput(e);
  };

  InputText.prototype.onBlur = function() {
    if (!this.state.focus) {
      return false;
    }
    this.setState({
      focus: false
    });
    return this._input.blur();
  };

  InputText.prototype.onKey = function(e) {
    console.log('TEST');
    if (e.keyCode === 13) {
      this.props.onEnter && this.props.onEnter(e);
    }
    return this.props.onKeyDown && this.props.onKeyDown(e);
  };

  InputText.prototype.componentWillUpdate = function(props, state) {
    if (this.props.value !== props.value) {
      return this.setState({
        initial_value: props.value,
        value: props.value
      });
    }
  };

  InputText.prototype.focus = function() {
    return this._input.focus();
  };

  InputText.prototype.render = function() {
    var props, style;
    if (this.props.barColor) {
      style = {
        'border-color': this.props.barColor
      };
    }
    props = Object.assign({}, this.props, {
      ref: (function(_this) {
        return function(e) {
          return _this._input = e;
        };
      })(this),
      onKeyDown: this.onKey,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      value: this.props.value,
      type: this.props.type || 'text',
      style: style,
      className: '-i-input-text'
    });
    return h(Input, {
      disabled: this.props.disabled,
      label: this.props.label,
      onFocus: this.onFocus,
      onClick: this.onFocus,
      icon: this.props.icon,
      className: cn(this.props.className, this.state.focus && 'focus' || null, (this.state.focus || this.state.value) && 'has-data' || null, this.props.icon_labh && '-i-icon-label' || null)
    }, h('input', props));
  };

  return InputText;

})(Component);

module.exports = InputText;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var Component, InputTextArea, cn, h, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

__webpack_require__(11);

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

cn = __webpack_require__(1);

InputTextArea = (function(superClass) {
  extend(InputTextArea, superClass);

  function InputTextArea(props) {
    this.componentDidMount = bind(this.componentDidMount, this);
    this.onInput = bind(this.onInput, this);
    this.resize = bind(this.resize, this);
    this.onBlur = bind(this.onBlur, this);
    this.onFocus = bind(this.onFocus, this);
    this.onClick = bind(this.onClick, this);
    this.state = {
      focus: false,
      initial_value: props.value,
      value: props.value
    };
  }

  InputTextArea.prototype.onClick = function() {
    return this._text_area.focus();
  };

  InputTextArea.prototype.onFocus = function() {
    if (this.state.focus) {
      return false;
    }
    return this.setState({
      focus: true
    });
  };

  InputTextArea.prototype.onBlur = function() {
    if (!this.state.focus) {
      return false;
    }
    return this.setState({
      focus: false
    });
  };

  InputTextArea.prototype.resize = function() {
    return setTimeout((function(_this) {
      return function() {
        _this._text_area.style.height = 'auto';
        return _this._text_area.style.height = _this._text_area.scrollHeight + 'px';
      };
    })(this), 0);
  };

  InputTextArea.prototype.onInput = function(e) {
    this.resize(e);
    this.state.value = e.value;
    return this.props.onInput && this.props.onInput(e);
  };

  InputTextArea.prototype.componentDidMount = function() {
    return this.resize();
  };

  InputTextArea.prototype.render = function() {
    var area, bar, label;
    if (this.props.label) {
      label = h('span', {
        className: 'label'
      }, this.props.label);
    }
    area = h('textarea', {
      onBlur: this.onBlur,
      value: this.props.value,
      onFocus: this.onFocus,
      onInput: this.onInput,
      ref: (function(_this) {
        return function(e) {
          return _this._text_area = e;
        };
      })(this)
    }, this.props.value);
    bar = h('div', {
      className: 'textarea-bar'
    });
    return h('div', {
      onClick: this.onClick,
      className: cn('-i-input', this.state.focus && 'focus' || '', 'textarea', this.props.className, this.props.disabled && 'disabled' || '')
    }, bar, label, area);
  };

  return InputTextArea;

})(Component);

module.exports = InputTextArea;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var Component, Modal, Overlay, cn, h, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

__webpack_require__(51);

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

Overlay = __webpack_require__(9);

cn = __webpack_require__(1);

Modal = (function(superClass) {
  extend(Modal, superClass);

  function Modal(props) {
    this.render = bind(this.render, this);
    this.show = bind(this.show, this);
    this.update = bind(this.update, this);
    Modal.__super__.constructor.call(this, props);
    this.mouse = props.mouse || [window.innerWidth / 2, window.innerHeight / 2];
    this.stage = {
      x: 0,
      y: 0
    };
    this.state = {
      start_radius: 10
    };
  }

  Modal.prototype.attr = function(b, a, delta) {
    return b - (b - a) * delta;
  };

  Modal.prototype.draw_rect = function(ctx) {
    var i, j;
    if (!this._canvas) {
      return;
    }
    ctx.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientWidth);
    ctx.beginPath();
    for (i = j = 0; j <= 3; i = ++j) {
      ctx.lineTo(this.pos[i].x, this.pos[i].y);
    }
    ctx.closePath();
    return ctx.fill();
  };

  Modal.prototype.update = function() {
    var rect;
    this.ctx = this._canvas.getContext('2d');
    rect = this._content.getBoundingClientRect();
    this._canvas.width = this._overlay._overlay.clientWidth;
    this._canvas.height = this._overlay._overlay.clientHeight;
    this.ctx.fillStyle = this.props.backColor;
    this.pos = [
      {
        x: rect.left,
        y: rect.top
      }, {
        x: rect.left + rect.width,
        y: rect.top
      }, {
        x: rect.left + rect.width,
        y: rect.top + rect.height
      }, {
        x: rect.left,
        y: rect.top + rect.height
      }
    ];
    return this.draw_rect(this.ctx);
  };

  Modal.prototype.show = function() {
    var i, j, r, rect, results, x, y;
    rect = this._content.getBoundingClientRect();
    rect = rect;
    this.ctx = this._canvas.getContext('2d');
    this._canvas.width = this._overlay._overlay.clientWidth;
    this._canvas.height = this._overlay._overlay.clientHeight;
    this.ctx.fillStyle = this.props.backColor;
    this.perim = [
      {
        x: rect.left,
        y: rect.top
      }, {
        x: rect.left + rect.width,
        y: rect.top
      }, {
        x: rect.left + rect.width,
        y: rect.top + rect.height
      }, {
        x: rect.left,
        y: rect.top + rect.height
      }
    ];
    r = this.state.start_radius;
    x = this.mouse[0];
    y = this.mouse[1];
    this.perim_start = [
      {
        x: x,
        y: y
      }, {
        x: x + r,
        y: y
      }, {
        x: x + r,
        y: y + r
      }, {
        x: x,
        y: y + r
      }
    ];
    this.pos = this.perim.slice(0);
    results = [];
    for (i = j = 3; j >= 0; i = --j) {
      results.push(TweenLite.fromTo(this.pos[i], 0.2 + (i * 0.1), {
        x: this.perim_start[i].x,
        y: this.perim_start[i].y
      }, {
        x: this.perim[i].x,
        y: this.perim[i].y,
        ease: Elastic.easeOut.config(0.2),
        onUpdate: (function(_this) {
          return function() {
            return _this.draw_rect(_this.ctx);
          };
        })(this)
      }));
    }
    return results;
  };

  Modal.prototype.componentDidUpdate = function(props, state) {
    if (this.props.show === true && this.props.show !== props.show) {
      return setTimeout(this.show, 0);
    }
  };

  Modal.prototype.componentDidMount = function(props, state) {
    if (this.props.show === true) {
      setTimeout(this.show, 0);
    }
    return window.addEventListener('resize', this.update);
  };

  Modal.prototype.componentWillUnmount = function() {
    return window.removeEventListener('resize', this.update);
  };

  Modal.prototype.render = function() {
    return h(Overlay, {
      className: '-i-modal-wrap',
      onClick: this.props.onClick,
      show: this.props.show,
      ref: (function(_this) {
        return function(el) {
          return _this._overlay = el;
        };
      })(this)
    }, h('canvas', {
      className: '-i-modal-canvas',
      ref: (function(_this) {
        return function(el) {
          return _this._canvas = el;
        };
      })(this)
    }), h('div', {
      className: '-i-modal-close',
      onClick: (function(_this) {
        return function(e) {
          e.stopPropagation();
          e.preventDefault();
          _this.props.onClick();
          return false;
        };
      })(this)
    }, h('i', {
      className: 'material-icons'
    }, 'close')), h('div', {
      onClick: function(e) {
        return e.stopPropagation();
      },
      ref: (function(_this) {
        return function(el) {
          return _this._content = el;
        };
      })(this),
      className: cn('-i-modal-content', this.props.className)
    }, this.props.children));
  };

  return Modal;

})(Component);

module.exports = Modal;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var Button, Component, Slide, SlideButton, cn, h, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = __webpack_require__(0), h = ref.h, Component = ref.Component;

cn = __webpack_require__(1);

Button = __webpack_require__(10);

Slide = __webpack_require__(5);

__webpack_require__(49);

SlideButton = (function(superClass) {
  extend(SlideButton, superClass);

  SlideButton.prototype.getChildContext = function() {
    return {
      vert: this.context.vert,
      dim: this.context.dim
    };
  };

  function SlideButton(props) {
    this.render = bind(this.render, this);
    this.onClick = bind(this.onClick, this);
    this.onMouseLeave = bind(this.onMouseLeave, this);
    this.onMouseEnter = bind(this.onMouseEnter, this);
    this.getPos = bind(this.getPos, this);
    this.getChildContext = bind(this.getChildContext, this);
    SlideButton.__super__.constructor.call(this, props);
    this.state = {
      hover: false,
      start_pos: this.getStartPos(props),
      pos: this.getStartPos(props)
    };
  }

  SlideButton.prototype.getStartPos = function(props) {
    var pos;
    pos = 0;
    if (props.active) {
      pos = 0;
      if (props.reverse) {
        pos = 1;
      }
    } else {
      pos = 0;
      if (props.reverse) {
        pos = 1;
      }
    }
    return pos;
  };

  SlideButton.prototype.getPos = function() {
    if (this.props.active) {
      return 1 - this.state.start_pos;
    } else {
      return this.state.start_pos;
    }
  };

  SlideButton.prototype.onMouseEnter = function(e) {
    var offset;
    if (this.props.disabled) {
      return false;
    }
    offset = 0;
    if (!this.props.index_reverse) {
      if (this.props.active) {
        offset = -this.props.active_index_offset;
      } else {
        offset = this.props.index_offset;
      }
    }
    if (this.props.reverse) {
      offset = -offset;
    }
    this.setState({
      hover: true,
      offset: offset
    });
    if (this.props.onMouseEnter) {
      return this.props.onMouseEnter(e);
    }
  };

  SlideButton.prototype.onMouseLeave = function(e) {
    var offset;
    offset = 0;
    if (this.props.index_reverse) {
      if (this.props.active) {
        offset = -this.props.active_index_offset;
      } else {
        offset = this.props.index_offset;
      }
    }
    if (this.props.reverse) {
      offset = -offset;
    }
    this.setState({
      hover: false,
      offset: offset
    });
    if (this.props.onMouseLeave) {
      return this.props.onMouseLeave(e);
    }
  };

  SlideButton.prototype.onClick = function(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
    return setTimeout((function(_this) {
      return function() {
        return _this.onMouseLeave(e);
      };
    })(this), 0);
  };

  SlideButton.prototype.render = function() {
    var bot, props, top, tp;
    top = this.props.top || {};
    bot = this.props.bot || {};
    top["class"] = top["class"] || this.props.sClass;
    bot["class"] = bot["class"] || this.props.pClass;
    top.label = top.label || this.props.label;
    top.i = top.i || this.props.i;
    bot.label = bot.label || this.props.label;
    bot.i = bot.i || this.props.i;
    if (this.props.reverse) {
      tp = top["class"];
      top["class"] = bot["class"];
      bot["class"] = tp;
    }
    props = Object.assign({}, this.props, {
      className: cn('-i-slide-btn', this.props["class"] || this.props.className, this.props.disabled && 'disabled' || null),
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onClick: this.onClick,
      pos: this.getPos(),
      slide: true,
      index_offset: this.state.offset
    });
    return h(Slide, props, h(Button, top), h(Button, bot));
  };

  return SlideButton;

})(Component);

SlideButton.defaultProps = {
  pos: null,
  index_reverse: false,
  active_index_offset: 0,
  index_offset: 5
};

module.exports = SlideButton;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "* {\n  box-sizing: border-box; }\n\nhtml, body {\n  margin: 0;\n  padding: 0; }\n\n.full-w {\n  width: 100%; }\n\n.hidden {\n  display: none; }\n\n.center {\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n.-i-btn {\n  cursor: pointer;\n  width: 100%;\n  position: relative;\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center;\n  display: inline-flex; }\n  .-i-btn .label {\n    padding-left: 10px; }\n  .-i-btn i {\n    font-size: 24px; }\n  .-i-btn.disabled {\n    cursor: default;\n    pointer-events: none;\n    opacity: 0.3; }\n", ""]);

// exports


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".-i-slide-btn {\n  cursor: pointer; }\n  .-i-slide-btn.disabled {\n    pointer-events: none;\n    opacity: 0.3;\n    cursor: default; }\n    .-i-slide-btn.disabled i {\n      cursor: default; }\n", ""]);

// exports


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "* {\n  box-sizing: border-box; }\n\nhtml, body {\n  margin: 0;\n  padding: 0; }\n\n.full-w {\n  width: 100%; }\n\n.hidden {\n  display: none; }\n\n.center {\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n.flex {\n  display: flex; }\n  .flex.down {\n    flex-direction: column; }\n  .flex.right {\n    flex-direction: row; }\n\n.s1 {\n  float: left;\n  width: 8.33333%; }\n\n.s2 {\n  float: left;\n  width: 16.66667%; }\n\n.s3 {\n  float: left;\n  width: 25%; }\n\n.s4 {\n  float: left;\n  width: 33.33333%; }\n\n.s5 {\n  float: left;\n  width: 41.66667%; }\n\n.s6 {\n  float: left;\n  width: 50%; }\n\n.s7 {\n  float: left;\n  width: 58.33333%; }\n\n.s8 {\n  float: left;\n  width: 66.66667%; }\n\n.s9 {\n  float: left;\n  width: 75%; }\n\n.s10 {\n  float: left;\n  width: 83.33333%; }\n\n.s11 {\n  float: left;\n  width: 91.66667%; }\n\n.s12 {\n  float: left;\n  width: 100%; }\n\n.m1 {\n  float: left;\n  width: 8.33333%; }\n\n.m2 {\n  float: left;\n  width: 16.66667%; }\n\n.m3 {\n  float: left;\n  width: 25%; }\n\n.m4 {\n  float: left;\n  width: 33.33333%; }\n\n.m5 {\n  float: left;\n  width: 41.66667%; }\n\n.m6 {\n  float: left;\n  width: 50%; }\n\n.m7 {\n  float: left;\n  width: 58.33333%; }\n\n.m8 {\n  float: left;\n  width: 66.66667%; }\n\n.m9 {\n  float: left;\n  width: 75%; }\n\n.m10 {\n  float: left;\n  width: 83.33333%; }\n\n.m11 {\n  float: left;\n  width: 91.66667%; }\n\n.m12 {\n  float: left;\n  width: 100%; }\n\n.pad-0-0 {\n  padding: 0px 0px; }\n\n.pad-0-5 {\n  padding: 0px 5px; }\n\n.pad-0-10 {\n  padding: 0px 10px; }\n\n.pad-0-15 {\n  padding: 0px 15px; }\n\n.pad-0-20 {\n  padding: 0px 20px; }\n\n.pad-0-25 {\n  padding: 0px 25px; }\n\n.pad-0-30 {\n  padding: 0px 30px; }\n\n.pad-0-35 {\n  padding: 0px 35px; }\n\n.pad-0-40 {\n  padding: 0px 40px; }\n\n.pad-0-45 {\n  padding: 0px 45px; }\n\n.pad-0-50 {\n  padding: 0px 50px; }\n\n.pad-5-0 {\n  padding: 5px 0px; }\n\n.pad-5-5 {\n  padding: 5px 5px; }\n\n.pad-5-10 {\n  padding: 5px 10px; }\n\n.pad-5-15 {\n  padding: 5px 15px; }\n\n.pad-5-20 {\n  padding: 5px 20px; }\n\n.pad-5-25 {\n  padding: 5px 25px; }\n\n.pad-5-30 {\n  padding: 5px 30px; }\n\n.pad-5-35 {\n  padding: 5px 35px; }\n\n.pad-5-40 {\n  padding: 5px 40px; }\n\n.pad-5-45 {\n  padding: 5px 45px; }\n\n.pad-5-50 {\n  padding: 5px 50px; }\n\n.pad-10-0 {\n  padding: 10px 0px; }\n\n.pad-10-5 {\n  padding: 10px 5px; }\n\n.pad-10-10 {\n  padding: 10px 10px; }\n\n.pad-10-15 {\n  padding: 10px 15px; }\n\n.pad-10-20 {\n  padding: 10px 20px; }\n\n.pad-10-25 {\n  padding: 10px 25px; }\n\n.pad-10-30 {\n  padding: 10px 30px; }\n\n.pad-10-35 {\n  padding: 10px 35px; }\n\n.pad-10-40 {\n  padding: 10px 40px; }\n\n.pad-10-45 {\n  padding: 10px 45px; }\n\n.pad-10-50 {\n  padding: 10px 50px; }\n\n.pad-15-0 {\n  padding: 15px 0px; }\n\n.pad-15-5 {\n  padding: 15px 5px; }\n\n.pad-15-10 {\n  padding: 15px 10px; }\n\n.pad-15-15 {\n  padding: 15px 15px; }\n\n.pad-15-20 {\n  padding: 15px 20px; }\n\n.pad-15-25 {\n  padding: 15px 25px; }\n\n.pad-15-30 {\n  padding: 15px 30px; }\n\n.pad-15-35 {\n  padding: 15px 35px; }\n\n.pad-15-40 {\n  padding: 15px 40px; }\n\n.pad-15-45 {\n  padding: 15px 45px; }\n\n.pad-15-50 {\n  padding: 15px 50px; }\n\n.pad-20-0 {\n  padding: 20px 0px; }\n\n.pad-20-5 {\n  padding: 20px 5px; }\n\n.pad-20-10 {\n  padding: 20px 10px; }\n\n.pad-20-15 {\n  padding: 20px 15px; }\n\n.pad-20-20 {\n  padding: 20px 20px; }\n\n.pad-20-25 {\n  padding: 20px 25px; }\n\n.pad-20-30 {\n  padding: 20px 30px; }\n\n.pad-20-35 {\n  padding: 20px 35px; }\n\n.pad-20-40 {\n  padding: 20px 40px; }\n\n.pad-20-45 {\n  padding: 20px 45px; }\n\n.pad-20-50 {\n  padding: 20px 50px; }\n\n.pad-25-0 {\n  padding: 25px 0px; }\n\n.pad-25-5 {\n  padding: 25px 5px; }\n\n.pad-25-10 {\n  padding: 25px 10px; }\n\n.pad-25-15 {\n  padding: 25px 15px; }\n\n.pad-25-20 {\n  padding: 25px 20px; }\n\n.pad-25-25 {\n  padding: 25px 25px; }\n\n.pad-25-30 {\n  padding: 25px 30px; }\n\n.pad-25-35 {\n  padding: 25px 35px; }\n\n.pad-25-40 {\n  padding: 25px 40px; }\n\n.pad-25-45 {\n  padding: 25px 45px; }\n\n.pad-25-50 {\n  padding: 25px 50px; }\n\n.pad-30-0 {\n  padding: 30px 0px; }\n\n.pad-30-5 {\n  padding: 30px 5px; }\n\n.pad-30-10 {\n  padding: 30px 10px; }\n\n.pad-30-15 {\n  padding: 30px 15px; }\n\n.pad-30-20 {\n  padding: 30px 20px; }\n\n.pad-30-25 {\n  padding: 30px 25px; }\n\n.pad-30-30 {\n  padding: 30px 30px; }\n\n.pad-30-35 {\n  padding: 30px 35px; }\n\n.pad-30-40 {\n  padding: 30px 40px; }\n\n.pad-30-45 {\n  padding: 30px 45px; }\n\n.pad-30-50 {\n  padding: 30px 50px; }\n\n.pad-35-0 {\n  padding: 35px 0px; }\n\n.pad-35-5 {\n  padding: 35px 5px; }\n\n.pad-35-10 {\n  padding: 35px 10px; }\n\n.pad-35-15 {\n  padding: 35px 15px; }\n\n.pad-35-20 {\n  padding: 35px 20px; }\n\n.pad-35-25 {\n  padding: 35px 25px; }\n\n.pad-35-30 {\n  padding: 35px 30px; }\n\n.pad-35-35 {\n  padding: 35px 35px; }\n\n.pad-35-40 {\n  padding: 35px 40px; }\n\n.pad-35-45 {\n  padding: 35px 45px; }\n\n.pad-35-50 {\n  padding: 35px 50px; }\n\n.pad-40-0 {\n  padding: 40px 0px; }\n\n.pad-40-5 {\n  padding: 40px 5px; }\n\n.pad-40-10 {\n  padding: 40px 10px; }\n\n.pad-40-15 {\n  padding: 40px 15px; }\n\n.pad-40-20 {\n  padding: 40px 20px; }\n\n.pad-40-25 {\n  padding: 40px 25px; }\n\n.pad-40-30 {\n  padding: 40px 30px; }\n\n.pad-40-35 {\n  padding: 40px 35px; }\n\n.pad-40-40 {\n  padding: 40px 40px; }\n\n.pad-40-45 {\n  padding: 40px 45px; }\n\n.pad-40-50 {\n  padding: 40px 50px; }\n\n.pad-45-0 {\n  padding: 45px 0px; }\n\n.pad-45-5 {\n  padding: 45px 5px; }\n\n.pad-45-10 {\n  padding: 45px 10px; }\n\n.pad-45-15 {\n  padding: 45px 15px; }\n\n.pad-45-20 {\n  padding: 45px 20px; }\n\n.pad-45-25 {\n  padding: 45px 25px; }\n\n.pad-45-30 {\n  padding: 45px 30px; }\n\n.pad-45-35 {\n  padding: 45px 35px; }\n\n.pad-45-40 {\n  padding: 45px 40px; }\n\n.pad-45-45 {\n  padding: 45px 45px; }\n\n.pad-45-50 {\n  padding: 45px 50px; }\n\n.pad-50-0 {\n  padding: 50px 0px; }\n\n.pad-50-5 {\n  padding: 50px 5px; }\n\n.pad-50-10 {\n  padding: 50px 10px; }\n\n.pad-50-15 {\n  padding: 50px 15px; }\n\n.pad-50-20 {\n  padding: 50px 20px; }\n\n.pad-50-25 {\n  padding: 50px 25px; }\n\n.pad-50-30 {\n  padding: 50px 30px; }\n\n.pad-50-35 {\n  padding: 50px 35px; }\n\n.pad-50-40 {\n  padding: 50px 40px; }\n\n.pad-50-45 {\n  padding: 50px 45px; }\n\n.pad-50-50 {\n  padding: 50px 50px; }\n\n.mar-0-0 {\n  margin: 0px 0px; }\n\n.mar-0-5 {\n  margin: 0px 5px; }\n\n.mar-0-10 {\n  margin: 0px 10px; }\n\n.mar-0-15 {\n  margin: 0px 15px; }\n\n.mar-0-20 {\n  margin: 0px 20px; }\n\n.mar-0-25 {\n  margin: 0px 25px; }\n\n.mar-0-30 {\n  margin: 0px 30px; }\n\n.mar-0-35 {\n  margin: 0px 35px; }\n\n.mar-0-40 {\n  margin: 0px 40px; }\n\n.mar-0-45 {\n  margin: 0px 45px; }\n\n.mar-0-50 {\n  margin: 0px 50px; }\n\n.mar-5-0 {\n  margin: 5px 0px; }\n\n.mar-5-5 {\n  margin: 5px 5px; }\n\n.mar-5-10 {\n  margin: 5px 10px; }\n\n.mar-5-15 {\n  margin: 5px 15px; }\n\n.mar-5-20 {\n  margin: 5px 20px; }\n\n.mar-5-25 {\n  margin: 5px 25px; }\n\n.mar-5-30 {\n  margin: 5px 30px; }\n\n.mar-5-35 {\n  margin: 5px 35px; }\n\n.mar-5-40 {\n  margin: 5px 40px; }\n\n.mar-5-45 {\n  margin: 5px 45px; }\n\n.mar-5-50 {\n  margin: 5px 50px; }\n\n.mar-10-0 {\n  margin: 10px 0px; }\n\n.mar-10-5 {\n  margin: 10px 5px; }\n\n.mar-10-10 {\n  margin: 10px 10px; }\n\n.mar-10-15 {\n  margin: 10px 15px; }\n\n.mar-10-20 {\n  margin: 10px 20px; }\n\n.mar-10-25 {\n  margin: 10px 25px; }\n\n.mar-10-30 {\n  margin: 10px 30px; }\n\n.mar-10-35 {\n  margin: 10px 35px; }\n\n.mar-10-40 {\n  margin: 10px 40px; }\n\n.mar-10-45 {\n  margin: 10px 45px; }\n\n.mar-10-50 {\n  margin: 10px 50px; }\n\n.mar-15-0 {\n  margin: 15px 0px; }\n\n.mar-15-5 {\n  margin: 15px 5px; }\n\n.mar-15-10 {\n  margin: 15px 10px; }\n\n.mar-15-15 {\n  margin: 15px 15px; }\n\n.mar-15-20 {\n  margin: 15px 20px; }\n\n.mar-15-25 {\n  margin: 15px 25px; }\n\n.mar-15-30 {\n  margin: 15px 30px; }\n\n.mar-15-35 {\n  margin: 15px 35px; }\n\n.mar-15-40 {\n  margin: 15px 40px; }\n\n.mar-15-45 {\n  margin: 15px 45px; }\n\n.mar-15-50 {\n  margin: 15px 50px; }\n\n.mar-20-0 {\n  margin: 20px 0px; }\n\n.mar-20-5 {\n  margin: 20px 5px; }\n\n.mar-20-10 {\n  margin: 20px 10px; }\n\n.mar-20-15 {\n  margin: 20px 15px; }\n\n.mar-20-20 {\n  margin: 20px 20px; }\n\n.mar-20-25 {\n  margin: 20px 25px; }\n\n.mar-20-30 {\n  margin: 20px 30px; }\n\n.mar-20-35 {\n  margin: 20px 35px; }\n\n.mar-20-40 {\n  margin: 20px 40px; }\n\n.mar-20-45 {\n  margin: 20px 45px; }\n\n.mar-20-50 {\n  margin: 20px 50px; }\n\n.mar-25-0 {\n  margin: 25px 0px; }\n\n.mar-25-5 {\n  margin: 25px 5px; }\n\n.mar-25-10 {\n  margin: 25px 10px; }\n\n.mar-25-15 {\n  margin: 25px 15px; }\n\n.mar-25-20 {\n  margin: 25px 20px; }\n\n.mar-25-25 {\n  margin: 25px 25px; }\n\n.mar-25-30 {\n  margin: 25px 30px; }\n\n.mar-25-35 {\n  margin: 25px 35px; }\n\n.mar-25-40 {\n  margin: 25px 40px; }\n\n.mar-25-45 {\n  margin: 25px 45px; }\n\n.mar-25-50 {\n  margin: 25px 50px; }\n\n.mar-30-0 {\n  margin: 30px 0px; }\n\n.mar-30-5 {\n  margin: 30px 5px; }\n\n.mar-30-10 {\n  margin: 30px 10px; }\n\n.mar-30-15 {\n  margin: 30px 15px; }\n\n.mar-30-20 {\n  margin: 30px 20px; }\n\n.mar-30-25 {\n  margin: 30px 25px; }\n\n.mar-30-30 {\n  margin: 30px 30px; }\n\n.mar-30-35 {\n  margin: 30px 35px; }\n\n.mar-30-40 {\n  margin: 30px 40px; }\n\n.mar-30-45 {\n  margin: 30px 45px; }\n\n.mar-30-50 {\n  margin: 30px 50px; }\n\n.mar-35-0 {\n  margin: 35px 0px; }\n\n.mar-35-5 {\n  margin: 35px 5px; }\n\n.mar-35-10 {\n  margin: 35px 10px; }\n\n.mar-35-15 {\n  margin: 35px 15px; }\n\n.mar-35-20 {\n  margin: 35px 20px; }\n\n.mar-35-25 {\n  margin: 35px 25px; }\n\n.mar-35-30 {\n  margin: 35px 30px; }\n\n.mar-35-35 {\n  margin: 35px 35px; }\n\n.mar-35-40 {\n  margin: 35px 40px; }\n\n.mar-35-45 {\n  margin: 35px 45px; }\n\n.mar-35-50 {\n  margin: 35px 50px; }\n\n.mar-40-0 {\n  margin: 40px 0px; }\n\n.mar-40-5 {\n  margin: 40px 5px; }\n\n.mar-40-10 {\n  margin: 40px 10px; }\n\n.mar-40-15 {\n  margin: 40px 15px; }\n\n.mar-40-20 {\n  margin: 40px 20px; }\n\n.mar-40-25 {\n  margin: 40px 25px; }\n\n.mar-40-30 {\n  margin: 40px 30px; }\n\n.mar-40-35 {\n  margin: 40px 35px; }\n\n.mar-40-40 {\n  margin: 40px 40px; }\n\n.mar-40-45 {\n  margin: 40px 45px; }\n\n.mar-40-50 {\n  margin: 40px 50px; }\n\n.mar-45-0 {\n  margin: 45px 0px; }\n\n.mar-45-5 {\n  margin: 45px 5px; }\n\n.mar-45-10 {\n  margin: 45px 10px; }\n\n.mar-45-15 {\n  margin: 45px 15px; }\n\n.mar-45-20 {\n  margin: 45px 20px; }\n\n.mar-45-25 {\n  margin: 45px 25px; }\n\n.mar-45-30 {\n  margin: 45px 30px; }\n\n.mar-45-35 {\n  margin: 45px 35px; }\n\n.mar-45-40 {\n  margin: 45px 40px; }\n\n.mar-45-45 {\n  margin: 45px 45px; }\n\n.mar-45-50 {\n  margin: 45px 50px; }\n\n.mar-50-0 {\n  margin: 50px 0px; }\n\n.mar-50-5 {\n  margin: 50px 5px; }\n\n.mar-50-10 {\n  margin: 50px 10px; }\n\n.mar-50-15 {\n  margin: 50px 15px; }\n\n.mar-50-20 {\n  margin: 50px 20px; }\n\n.mar-50-25 {\n  margin: 50px 25px; }\n\n.mar-50-30 {\n  margin: 50px 30px; }\n\n.mar-50-35 {\n  margin: 50px 35px; }\n\n.mar-50-40 {\n  margin: 50px 40px; }\n\n.mar-50-45 {\n  margin: 50px 45px; }\n\n.mar-50-50 {\n  margin: 50px 50px; }\n\n@media only screen and (max-width: 600px) {\n  .s1 {\n    float: left;\n    width: 8.33333%; }\n  .s2 {\n    float: left;\n    width: 16.66667%; }\n  .s3 {\n    float: left;\n    width: 25%; }\n  .s4 {\n    float: left;\n    width: 33.33333%; }\n  .s5 {\n    float: left;\n    width: 41.66667%; }\n  .s6 {\n    float: left;\n    width: 50%; }\n  .s7 {\n    float: left;\n    width: 58.33333%; }\n  .s8 {\n    float: left;\n    width: 66.66667%; }\n  .s9 {\n    float: left;\n    width: 75%; }\n  .s10 {\n    float: left;\n    width: 83.33333%; }\n  .s11 {\n    float: left;\n    width: 91.66667%; }\n  .s12 {\n    float: left;\n    width: 100%; } }\n\n.-i-s-fixed {\n  transform: none !important;\n  flex-shrink: 0; }\n\n.-i-s-scroll {\n  overflow-x: scroll;\n  overflow-y: hidden; }\n\n.-i-s-scroll.-i-s-vertical {\n  overflow-y: scroll;\n  overflow-x: hidden; }\n\n.-i-s-center {\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n.-i-s-static {\n  box-sizing: border-box;\n  position: relative;\n  flex-direction: row;\n  display: flex;\n  overflow: hidden; }\n  .-i-s-static.-i-s-reverse {\n    flex-direction: row-reverse; }\n\n.-i-s-outer {\n  position: relative;\n  overflow: hidden; }\n  .-i-s-outer ::-webkit-scrollbar {\n    display: none; }\n\n.-i-s-inner {\n  min-height: 100%;\n  display: flex; }\n  .-i-s-inner > .-i-s-in {\n    transition: transform 0.3s cubic-bezier(0, 0.93, 0.27, 1);\n    transform: scale(1) rotateY(0deg) !important; }\n  .-i-s-inner > .-i-s-in_pre.-i-s-right {\n    transform-origin: 0% 50%;\n    transform: scale(1) rotateY(10deg); }\n  .-i-s-inner > .-i-s-in_pre.-i-s-left {\n    transform-origin: 100% 50%;\n    transform: scale(1) rotateY(-10deg); }\n  .-i-s-inner.-i-s-reverse {\n    flex-direction: row-reverse; }\n\n.-i-s-inner > .-i-s-outer {\n  flex-shrink: 0; }\n\n.-i-s-inner > .-i-s-static {\n  flex-shrink: 0; }\n\n.-i-s-horizontal {\n  flex-direction: row; }\n\n.-i-s-vertical {\n  flex-direction: column; }\n  .-i-s-vertical > .-i-s-in_pre.-i-s-right {\n    transform-origin: 50% 0%;\n    transform: scale(1) rotateX(-60deg); }\n  .-i-s-vertical > .-i-s-in_pre.-i-s-left {\n    transform-origin: 50% 100%;\n    transform: scale(1) rotateX(60deg); }\n  .-i-s-vertical.-i-s-reverse {\n    flex-direction: column-reverse; }\n\n.-i-viewer {\n  background: black;\n  position: absolute;\n  width: 100vw;\n  height: calc(100vh - 50px);\n  top: 50px;\n  left: 0;\n  overflow: hidden;\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n.-i-viewer-image {\n  border-radius: 10px;\n  position: absolute;\n  left: 0;\n  top: 0;\n  transition: opacity 0.3s ease;\n  opacity: 1; }\n  .-i-viewer-image:hidden {\n    opacity: 0; }\n\n.-i-loader {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: auto;\n  width: 10px;\n  height: 10px;\n  background-color: #FFFFFF;\n  animation: rotate 1s infinite ease-in-out;\n  transition: opacity 1s ease; }\n\n.-i-loader-stop {\n  animation-iteration-count: 0;\n  opacity: 0.2;\n  transform: scale(0.5); }\n\n@keyframes rotate {\n  0% {\n    transform: perspective(20px) rotateX(0deg) rotateY(0deg); }\n  50% {\n    transform: perspective(20px) rotateX(-180deg) rotateY(0deg); }\n  100% {\n    transform: perspective(20px) rotateX(-180deg) rotateY(-180deg); } }\n\n.-i-grid {\n  -webkit-overflow-scrolling: touch;\n  transform: translateZ(0);\n  position: relative;\n  width: 100%;\n  overflow: scroll;\n  height: 100%; }\n  .-i-grid .-i-grid-item-outer {\n    transform-origin: center center 0px;\n    -webkit-transform-origin: center center 0px;\n    position: absolute;\n    box-sizing: border-box;\n    backface-visibility: hidden; }\n    .-i-grid .-i-grid-item-outer::before {\n      will-change: transform; }\n  .-i-grid .-i-grid-item-inner {\n    backface-visibility: hidden;\n    transform-style: preserve-3d;\n    width: 100%;\n    height: 100%;\n    position: relative; }\n  .-i-grid .-i-grid-inner {\n    -webkit-overflow-scrolling: touch;\n    width: 100%;\n    height: auto;\n    position: relative; }\n  .-i-grid .-i-loader {\n    position: absolute;\n    left: calc( 50% - 5px);\n    bottom: 25px; }\n\n.-i-grid-fixed {\n  height: auto;\n  overflow: visible; }\n", ""]);

// exports


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "* {\n  box-sizing: border-box; }\n\nhtml, body {\n  margin: 0;\n  padding: 0; }\n\n.full-w {\n  width: 100%; }\n\n.hidden {\n  display: none; }\n\n.center {\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n@-webkit-keyframes autofill {\n  to {\n    color: #666;\n    background: transparent; } }\n\n.-i-input {\n  font-family: 'Lato', sans-serif;\n  height: 50px;\n  padding-left: 15px;\n  min-width: 50px;\n  position: relative;\n  overflow: hidden;\n  transition: background 0.1s ease;\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n  .-i-input i {\n    color: rgba(255, 255, 255, 0.13);\n    transition: color 0.1s ease; }\n  .-i-input input {\n    font-family: inherit;\n    border: none;\n    background: none;\n    font-size: 14px;\n    line-height: 14px;\n    color: white;\n    font-weight: 100;\n    outline: none;\n    height: 100%;\n    width: calc(100% - 4px);\n    border-bottom: none;\n    padding: 0px 8px;\n    padding-left: 10px; }\n    .-i-input input:-webkit-autofill {\n      -webkit-text-fill-color: cyan;\n      -webkit-animation-name: autofill;\n      -webkit-animation-fill-mode: both; }\n  .-i-input.file > i {\n    margin: 0 auto; }\n  .-i-input input[type=\"file\"] {\n    display: block;\n    width: 66px;\n    height: 25px;\n    clip: rect(0px 0px 0px 0px);\n    position: absolute;\n    left: 0;\n    top: 0; }\n  .-i-input input::-webkit-input-placeholder {\n    font-weight: 200;\n    font-size: 14px;\n    color: rgba(255, 255, 255, 0.15); }\n  .-i-input.disabled input::-webkit-input-placeholder {\n    opacity: 0.2; }\n  .-i-input .label {\n    display: inline-table;\n    padding: 0px 5px;\n    margin-top: 0px;\n    padding-top: 2px;\n    padding-left: 10px;\n    min-width: 90px;\n    border-left: 2px solid rgba(255, 255, 255, 0.13);\n    border-right: 2px solid rgba(255, 255, 255, 0);\n    font-size: 14px;\n    line-height: 14px;\n    font-weight: 400;\n    color: rgba(255, 255, 255, 0.64); }\n  .-i-input.-i-icon-label .label {\n    padding: 0px;\n    min-width: 0px;\n    border: none !important; }\n  .-i-input.file {\n    cursor: pointer; }\n    .-i-input.file input {\n      cursor: pointer !important; }\n    .-i-input.file .label {\n      color: rgba(255, 255, 255, 0.4); }\n  .-i-input.file:hover i {\n    color: white; }\n  .-i-input.has-data input {\n    font-size: 14px; }\n  .-i-input.file:hover {\n    background: rgba(0, 0, 0, 0.1); }\n  .-i-input.focus {\n    background: rgba(0, 0, 0, 0.1); }\n    .-i-input.focus .label {\n      border-left: 2px solid rgba(255, 255, 255, 0);\n      border-right: 2px solid rgba(255, 255, 255, 0.13); }\n  .-i-input.has-data .label {\n    border-left: 2px solid rgba(255, 255, 255, 0);\n    border-right: 2px solid rgba(255, 255, 255, 0.13); }\n  .-i-input.textarea {\n    display: block;\n    height: auto; }\n    .-i-input.textarea .label {\n      border-left: 2px solid rgba(255, 255, 255, 0);\n      border-right: 2px solid rgba(255, 255, 255, 0);\n      margin-top: 8px; }\n    .-i-input.textarea textarea {\n      color: white;\n      font-family: 'Lato', sans-serif;\n      font-weight: 400;\n      font-size: 14px;\n      padding: 10px;\n      width: 100%;\n      outline: none;\n      border: none;\n      background: none;\n      max-width: 100%; }\n    .-i-input.textarea .textarea-bar {\n      position: absolute;\n      height: calc(100% - 14px);\n      width: 2px;\n      left: 0px;\n      top: 8px;\n      background: rgba(255, 255, 255, 0.1); }\n", ""]);

// exports


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "* {\n  box-sizing: border-box; }\n\nhtml, body {\n  margin: 0;\n  padding: 0; }\n\n.full-w {\n  width: 100%; }\n\n.hidden {\n  display: none; }\n\n.center {\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n.-i-modal-wrap {\n  height: 100%; }\n  .-i-modal-wrap .-i-modal-canvas {\n    height: 100%;\n    position: absolute;\n    left: 0px;\n    width: 100%;\n    top: 0px; }\n  .-i-modal-wrap .-i-modal-content {\n    z-index: 1;\n    position: relative; }\n  .-i-modal-wrap .-i-modal-close {\n    position: absolute;\n    right: 0px;\n    top: 0px;\n    width: 50px;\n    height: 50px;\n    cursor: pointer;\n    align-items: center;\n    display: flex;\n    align-content: center;\n    justify-content: center;\n    color: white;\n    opacity: 0.7;\n    transition: opacity 0.3s ease;\n    z-index: 10; }\n    .-i-modal-wrap .-i-modal-close:hover {\n      opacity: 1; }\n", ""]);

// exports


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "* {\n  box-sizing: border-box; }\n\nhtml, body {\n  margin: 0;\n  padding: 0; }\n\n.full-w {\n  width: 100%; }\n\n.hidden {\n  display: none; }\n\n.center {\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n.-i-overlay {\n  z-index: 90;\n  transition: opacity 0.2s ease;\n  opacity: 1;\n  background: rgba(0, 0, 0, 0.8);\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  left: 0px;\n  top: 0px;\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n.-i-overlay-hidden {\n  pointer-events: none;\n  opacity: 0; }\n\n.-i-angle {\n  position: absolute;\n  height: 50px;\n  width: 50px; }\n\n.-i-angle-bottom {\n  left: calc(50% - 25px);\n  bottom: 0; }\n\n.-i-angle-top {\n  left: calc(50% - 25px);\n  top: 0; }\n\n.-i-angle-right {\n  right: 0%;\n  top: calc(50% - 25px); }\n\n.-i-angle-left {\n  left: 0%;\n  top: calc(50% - 25px); }\n", ""]);

// exports


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "* {\n  box-sizing: border-box; }\n\nhtml, body {\n  margin: 0;\n  padding: 0; }\n\n.full-w {\n  width: 100%; }\n\n.hidden {\n  display: none; }\n\n.center {\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n* {\n  box-sizing: border-box; }\n\nhtml, body {\n  margin: 0;\n  padding: 0; }\n\n.full-w {\n  width: 100%; }\n\n.hidden {\n  display: none; }\n\n.center {\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n.flex {\n  display: flex; }\n  .flex.down {\n    flex-direction: column; }\n  .flex.right {\n    flex-direction: row; }\n\n.s1 {\n  float: left;\n  width: 8.33333%; }\n\n.s2 {\n  float: left;\n  width: 16.66667%; }\n\n.s3 {\n  float: left;\n  width: 25%; }\n\n.s4 {\n  float: left;\n  width: 33.33333%; }\n\n.s5 {\n  float: left;\n  width: 41.66667%; }\n\n.s6 {\n  float: left;\n  width: 50%; }\n\n.s7 {\n  float: left;\n  width: 58.33333%; }\n\n.s8 {\n  float: left;\n  width: 66.66667%; }\n\n.s9 {\n  float: left;\n  width: 75%; }\n\n.s10 {\n  float: left;\n  width: 83.33333%; }\n\n.s11 {\n  float: left;\n  width: 91.66667%; }\n\n.s12 {\n  float: left;\n  width: 100%; }\n\n.m1 {\n  float: left;\n  width: 8.33333%; }\n\n.m2 {\n  float: left;\n  width: 16.66667%; }\n\n.m3 {\n  float: left;\n  width: 25%; }\n\n.m4 {\n  float: left;\n  width: 33.33333%; }\n\n.m5 {\n  float: left;\n  width: 41.66667%; }\n\n.m6 {\n  float: left;\n  width: 50%; }\n\n.m7 {\n  float: left;\n  width: 58.33333%; }\n\n.m8 {\n  float: left;\n  width: 66.66667%; }\n\n.m9 {\n  float: left;\n  width: 75%; }\n\n.m10 {\n  float: left;\n  width: 83.33333%; }\n\n.m11 {\n  float: left;\n  width: 91.66667%; }\n\n.m12 {\n  float: left;\n  width: 100%; }\n\n.pad-0-0 {\n  padding: 0px 0px; }\n\n.pad-0-5 {\n  padding: 0px 5px; }\n\n.pad-0-10 {\n  padding: 0px 10px; }\n\n.pad-0-15 {\n  padding: 0px 15px; }\n\n.pad-0-20 {\n  padding: 0px 20px; }\n\n.pad-0-25 {\n  padding: 0px 25px; }\n\n.pad-0-30 {\n  padding: 0px 30px; }\n\n.pad-0-35 {\n  padding: 0px 35px; }\n\n.pad-0-40 {\n  padding: 0px 40px; }\n\n.pad-0-45 {\n  padding: 0px 45px; }\n\n.pad-0-50 {\n  padding: 0px 50px; }\n\n.pad-5-0 {\n  padding: 5px 0px; }\n\n.pad-5-5 {\n  padding: 5px 5px; }\n\n.pad-5-10 {\n  padding: 5px 10px; }\n\n.pad-5-15 {\n  padding: 5px 15px; }\n\n.pad-5-20 {\n  padding: 5px 20px; }\n\n.pad-5-25 {\n  padding: 5px 25px; }\n\n.pad-5-30 {\n  padding: 5px 30px; }\n\n.pad-5-35 {\n  padding: 5px 35px; }\n\n.pad-5-40 {\n  padding: 5px 40px; }\n\n.pad-5-45 {\n  padding: 5px 45px; }\n\n.pad-5-50 {\n  padding: 5px 50px; }\n\n.pad-10-0 {\n  padding: 10px 0px; }\n\n.pad-10-5 {\n  padding: 10px 5px; }\n\n.pad-10-10 {\n  padding: 10px 10px; }\n\n.pad-10-15 {\n  padding: 10px 15px; }\n\n.pad-10-20 {\n  padding: 10px 20px; }\n\n.pad-10-25 {\n  padding: 10px 25px; }\n\n.pad-10-30 {\n  padding: 10px 30px; }\n\n.pad-10-35 {\n  padding: 10px 35px; }\n\n.pad-10-40 {\n  padding: 10px 40px; }\n\n.pad-10-45 {\n  padding: 10px 45px; }\n\n.pad-10-50 {\n  padding: 10px 50px; }\n\n.pad-15-0 {\n  padding: 15px 0px; }\n\n.pad-15-5 {\n  padding: 15px 5px; }\n\n.pad-15-10 {\n  padding: 15px 10px; }\n\n.pad-15-15 {\n  padding: 15px 15px; }\n\n.pad-15-20 {\n  padding: 15px 20px; }\n\n.pad-15-25 {\n  padding: 15px 25px; }\n\n.pad-15-30 {\n  padding: 15px 30px; }\n\n.pad-15-35 {\n  padding: 15px 35px; }\n\n.pad-15-40 {\n  padding: 15px 40px; }\n\n.pad-15-45 {\n  padding: 15px 45px; }\n\n.pad-15-50 {\n  padding: 15px 50px; }\n\n.pad-20-0 {\n  padding: 20px 0px; }\n\n.pad-20-5 {\n  padding: 20px 5px; }\n\n.pad-20-10 {\n  padding: 20px 10px; }\n\n.pad-20-15 {\n  padding: 20px 15px; }\n\n.pad-20-20 {\n  padding: 20px 20px; }\n\n.pad-20-25 {\n  padding: 20px 25px; }\n\n.pad-20-30 {\n  padding: 20px 30px; }\n\n.pad-20-35 {\n  padding: 20px 35px; }\n\n.pad-20-40 {\n  padding: 20px 40px; }\n\n.pad-20-45 {\n  padding: 20px 45px; }\n\n.pad-20-50 {\n  padding: 20px 50px; }\n\n.pad-25-0 {\n  padding: 25px 0px; }\n\n.pad-25-5 {\n  padding: 25px 5px; }\n\n.pad-25-10 {\n  padding: 25px 10px; }\n\n.pad-25-15 {\n  padding: 25px 15px; }\n\n.pad-25-20 {\n  padding: 25px 20px; }\n\n.pad-25-25 {\n  padding: 25px 25px; }\n\n.pad-25-30 {\n  padding: 25px 30px; }\n\n.pad-25-35 {\n  padding: 25px 35px; }\n\n.pad-25-40 {\n  padding: 25px 40px; }\n\n.pad-25-45 {\n  padding: 25px 45px; }\n\n.pad-25-50 {\n  padding: 25px 50px; }\n\n.pad-30-0 {\n  padding: 30px 0px; }\n\n.pad-30-5 {\n  padding: 30px 5px; }\n\n.pad-30-10 {\n  padding: 30px 10px; }\n\n.pad-30-15 {\n  padding: 30px 15px; }\n\n.pad-30-20 {\n  padding: 30px 20px; }\n\n.pad-30-25 {\n  padding: 30px 25px; }\n\n.pad-30-30 {\n  padding: 30px 30px; }\n\n.pad-30-35 {\n  padding: 30px 35px; }\n\n.pad-30-40 {\n  padding: 30px 40px; }\n\n.pad-30-45 {\n  padding: 30px 45px; }\n\n.pad-30-50 {\n  padding: 30px 50px; }\n\n.pad-35-0 {\n  padding: 35px 0px; }\n\n.pad-35-5 {\n  padding: 35px 5px; }\n\n.pad-35-10 {\n  padding: 35px 10px; }\n\n.pad-35-15 {\n  padding: 35px 15px; }\n\n.pad-35-20 {\n  padding: 35px 20px; }\n\n.pad-35-25 {\n  padding: 35px 25px; }\n\n.pad-35-30 {\n  padding: 35px 30px; }\n\n.pad-35-35 {\n  padding: 35px 35px; }\n\n.pad-35-40 {\n  padding: 35px 40px; }\n\n.pad-35-45 {\n  padding: 35px 45px; }\n\n.pad-35-50 {\n  padding: 35px 50px; }\n\n.pad-40-0 {\n  padding: 40px 0px; }\n\n.pad-40-5 {\n  padding: 40px 5px; }\n\n.pad-40-10 {\n  padding: 40px 10px; }\n\n.pad-40-15 {\n  padding: 40px 15px; }\n\n.pad-40-20 {\n  padding: 40px 20px; }\n\n.pad-40-25 {\n  padding: 40px 25px; }\n\n.pad-40-30 {\n  padding: 40px 30px; }\n\n.pad-40-35 {\n  padding: 40px 35px; }\n\n.pad-40-40 {\n  padding: 40px 40px; }\n\n.pad-40-45 {\n  padding: 40px 45px; }\n\n.pad-40-50 {\n  padding: 40px 50px; }\n\n.pad-45-0 {\n  padding: 45px 0px; }\n\n.pad-45-5 {\n  padding: 45px 5px; }\n\n.pad-45-10 {\n  padding: 45px 10px; }\n\n.pad-45-15 {\n  padding: 45px 15px; }\n\n.pad-45-20 {\n  padding: 45px 20px; }\n\n.pad-45-25 {\n  padding: 45px 25px; }\n\n.pad-45-30 {\n  padding: 45px 30px; }\n\n.pad-45-35 {\n  padding: 45px 35px; }\n\n.pad-45-40 {\n  padding: 45px 40px; }\n\n.pad-45-45 {\n  padding: 45px 45px; }\n\n.pad-45-50 {\n  padding: 45px 50px; }\n\n.pad-50-0 {\n  padding: 50px 0px; }\n\n.pad-50-5 {\n  padding: 50px 5px; }\n\n.pad-50-10 {\n  padding: 50px 10px; }\n\n.pad-50-15 {\n  padding: 50px 15px; }\n\n.pad-50-20 {\n  padding: 50px 20px; }\n\n.pad-50-25 {\n  padding: 50px 25px; }\n\n.pad-50-30 {\n  padding: 50px 30px; }\n\n.pad-50-35 {\n  padding: 50px 35px; }\n\n.pad-50-40 {\n  padding: 50px 40px; }\n\n.pad-50-45 {\n  padding: 50px 45px; }\n\n.pad-50-50 {\n  padding: 50px 50px; }\n\n.mar-0-0 {\n  margin: 0px 0px; }\n\n.mar-0-5 {\n  margin: 0px 5px; }\n\n.mar-0-10 {\n  margin: 0px 10px; }\n\n.mar-0-15 {\n  margin: 0px 15px; }\n\n.mar-0-20 {\n  margin: 0px 20px; }\n\n.mar-0-25 {\n  margin: 0px 25px; }\n\n.mar-0-30 {\n  margin: 0px 30px; }\n\n.mar-0-35 {\n  margin: 0px 35px; }\n\n.mar-0-40 {\n  margin: 0px 40px; }\n\n.mar-0-45 {\n  margin: 0px 45px; }\n\n.mar-0-50 {\n  margin: 0px 50px; }\n\n.mar-5-0 {\n  margin: 5px 0px; }\n\n.mar-5-5 {\n  margin: 5px 5px; }\n\n.mar-5-10 {\n  margin: 5px 10px; }\n\n.mar-5-15 {\n  margin: 5px 15px; }\n\n.mar-5-20 {\n  margin: 5px 20px; }\n\n.mar-5-25 {\n  margin: 5px 25px; }\n\n.mar-5-30 {\n  margin: 5px 30px; }\n\n.mar-5-35 {\n  margin: 5px 35px; }\n\n.mar-5-40 {\n  margin: 5px 40px; }\n\n.mar-5-45 {\n  margin: 5px 45px; }\n\n.mar-5-50 {\n  margin: 5px 50px; }\n\n.mar-10-0 {\n  margin: 10px 0px; }\n\n.mar-10-5 {\n  margin: 10px 5px; }\n\n.mar-10-10 {\n  margin: 10px 10px; }\n\n.mar-10-15 {\n  margin: 10px 15px; }\n\n.mar-10-20 {\n  margin: 10px 20px; }\n\n.mar-10-25 {\n  margin: 10px 25px; }\n\n.mar-10-30 {\n  margin: 10px 30px; }\n\n.mar-10-35 {\n  margin: 10px 35px; }\n\n.mar-10-40 {\n  margin: 10px 40px; }\n\n.mar-10-45 {\n  margin: 10px 45px; }\n\n.mar-10-50 {\n  margin: 10px 50px; }\n\n.mar-15-0 {\n  margin: 15px 0px; }\n\n.mar-15-5 {\n  margin: 15px 5px; }\n\n.mar-15-10 {\n  margin: 15px 10px; }\n\n.mar-15-15 {\n  margin: 15px 15px; }\n\n.mar-15-20 {\n  margin: 15px 20px; }\n\n.mar-15-25 {\n  margin: 15px 25px; }\n\n.mar-15-30 {\n  margin: 15px 30px; }\n\n.mar-15-35 {\n  margin: 15px 35px; }\n\n.mar-15-40 {\n  margin: 15px 40px; }\n\n.mar-15-45 {\n  margin: 15px 45px; }\n\n.mar-15-50 {\n  margin: 15px 50px; }\n\n.mar-20-0 {\n  margin: 20px 0px; }\n\n.mar-20-5 {\n  margin: 20px 5px; }\n\n.mar-20-10 {\n  margin: 20px 10px; }\n\n.mar-20-15 {\n  margin: 20px 15px; }\n\n.mar-20-20 {\n  margin: 20px 20px; }\n\n.mar-20-25 {\n  margin: 20px 25px; }\n\n.mar-20-30 {\n  margin: 20px 30px; }\n\n.mar-20-35 {\n  margin: 20px 35px; }\n\n.mar-20-40 {\n  margin: 20px 40px; }\n\n.mar-20-45 {\n  margin: 20px 45px; }\n\n.mar-20-50 {\n  margin: 20px 50px; }\n\n.mar-25-0 {\n  margin: 25px 0px; }\n\n.mar-25-5 {\n  margin: 25px 5px; }\n\n.mar-25-10 {\n  margin: 25px 10px; }\n\n.mar-25-15 {\n  margin: 25px 15px; }\n\n.mar-25-20 {\n  margin: 25px 20px; }\n\n.mar-25-25 {\n  margin: 25px 25px; }\n\n.mar-25-30 {\n  margin: 25px 30px; }\n\n.mar-25-35 {\n  margin: 25px 35px; }\n\n.mar-25-40 {\n  margin: 25px 40px; }\n\n.mar-25-45 {\n  margin: 25px 45px; }\n\n.mar-25-50 {\n  margin: 25px 50px; }\n\n.mar-30-0 {\n  margin: 30px 0px; }\n\n.mar-30-5 {\n  margin: 30px 5px; }\n\n.mar-30-10 {\n  margin: 30px 10px; }\n\n.mar-30-15 {\n  margin: 30px 15px; }\n\n.mar-30-20 {\n  margin: 30px 20px; }\n\n.mar-30-25 {\n  margin: 30px 25px; }\n\n.mar-30-30 {\n  margin: 30px 30px; }\n\n.mar-30-35 {\n  margin: 30px 35px; }\n\n.mar-30-40 {\n  margin: 30px 40px; }\n\n.mar-30-45 {\n  margin: 30px 45px; }\n\n.mar-30-50 {\n  margin: 30px 50px; }\n\n.mar-35-0 {\n  margin: 35px 0px; }\n\n.mar-35-5 {\n  margin: 35px 5px; }\n\n.mar-35-10 {\n  margin: 35px 10px; }\n\n.mar-35-15 {\n  margin: 35px 15px; }\n\n.mar-35-20 {\n  margin: 35px 20px; }\n\n.mar-35-25 {\n  margin: 35px 25px; }\n\n.mar-35-30 {\n  margin: 35px 30px; }\n\n.mar-35-35 {\n  margin: 35px 35px; }\n\n.mar-35-40 {\n  margin: 35px 40px; }\n\n.mar-35-45 {\n  margin: 35px 45px; }\n\n.mar-35-50 {\n  margin: 35px 50px; }\n\n.mar-40-0 {\n  margin: 40px 0px; }\n\n.mar-40-5 {\n  margin: 40px 5px; }\n\n.mar-40-10 {\n  margin: 40px 10px; }\n\n.mar-40-15 {\n  margin: 40px 15px; }\n\n.mar-40-20 {\n  margin: 40px 20px; }\n\n.mar-40-25 {\n  margin: 40px 25px; }\n\n.mar-40-30 {\n  margin: 40px 30px; }\n\n.mar-40-35 {\n  margin: 40px 35px; }\n\n.mar-40-40 {\n  margin: 40px 40px; }\n\n.mar-40-45 {\n  margin: 40px 45px; }\n\n.mar-40-50 {\n  margin: 40px 50px; }\n\n.mar-45-0 {\n  margin: 45px 0px; }\n\n.mar-45-5 {\n  margin: 45px 5px; }\n\n.mar-45-10 {\n  margin: 45px 10px; }\n\n.mar-45-15 {\n  margin: 45px 15px; }\n\n.mar-45-20 {\n  margin: 45px 20px; }\n\n.mar-45-25 {\n  margin: 45px 25px; }\n\n.mar-45-30 {\n  margin: 45px 30px; }\n\n.mar-45-35 {\n  margin: 45px 35px; }\n\n.mar-45-40 {\n  margin: 45px 40px; }\n\n.mar-45-45 {\n  margin: 45px 45px; }\n\n.mar-45-50 {\n  margin: 45px 50px; }\n\n.mar-50-0 {\n  margin: 50px 0px; }\n\n.mar-50-5 {\n  margin: 50px 5px; }\n\n.mar-50-10 {\n  margin: 50px 10px; }\n\n.mar-50-15 {\n  margin: 50px 15px; }\n\n.mar-50-20 {\n  margin: 50px 20px; }\n\n.mar-50-25 {\n  margin: 50px 25px; }\n\n.mar-50-30 {\n  margin: 50px 30px; }\n\n.mar-50-35 {\n  margin: 50px 35px; }\n\n.mar-50-40 {\n  margin: 50px 40px; }\n\n.mar-50-45 {\n  margin: 50px 45px; }\n\n.mar-50-50 {\n  margin: 50px 50px; }\n\n@media only screen and (max-width: 600px) {\n  .s1 {\n    float: left;\n    width: 8.33333%; }\n  .s2 {\n    float: left;\n    width: 16.66667%; }\n  .s3 {\n    float: left;\n    width: 25%; }\n  .s4 {\n    float: left;\n    width: 33.33333%; }\n  .s5 {\n    float: left;\n    width: 41.66667%; }\n  .s6 {\n    float: left;\n    width: 50%; }\n  .s7 {\n    float: left;\n    width: 58.33333%; }\n  .s8 {\n    float: left;\n    width: 66.66667%; }\n  .s9 {\n    float: left;\n    width: 75%; }\n  .s10 {\n    float: left;\n    width: 83.33333%; }\n  .s11 {\n    float: left;\n    width: 91.66667%; }\n  .s12 {\n    float: left;\n    width: 100%; } }\n\n.-i-s-fixed {\n  transform: none !important;\n  flex-shrink: 0; }\n\n.-i-s-scroll {\n  overflow-x: scroll;\n  overflow-y: hidden; }\n\n.-i-s-scroll.-i-s-vertical {\n  overflow-y: scroll;\n  overflow-x: hidden; }\n\n.-i-s-center {\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n.-i-s-static {\n  box-sizing: border-box;\n  position: relative;\n  flex-direction: row;\n  display: flex;\n  overflow: hidden; }\n  .-i-s-static.-i-s-reverse {\n    flex-direction: row-reverse; }\n\n.-i-s-outer {\n  position: relative;\n  overflow: hidden; }\n  .-i-s-outer ::-webkit-scrollbar {\n    display: none; }\n\n.-i-s-inner {\n  min-height: 100%;\n  display: flex; }\n  .-i-s-inner > .-i-s-in {\n    transition: transform 0.3s cubic-bezier(0, 0.93, 0.27, 1);\n    transform: scale(1) rotateY(0deg) !important; }\n  .-i-s-inner > .-i-s-in_pre.-i-s-right {\n    transform-origin: 0% 50%;\n    transform: scale(1) rotateY(10deg); }\n  .-i-s-inner > .-i-s-in_pre.-i-s-left {\n    transform-origin: 100% 50%;\n    transform: scale(1) rotateY(-10deg); }\n  .-i-s-inner.-i-s-reverse {\n    flex-direction: row-reverse; }\n\n.-i-s-inner > .-i-s-outer {\n  flex-shrink: 0; }\n\n.-i-s-inner > .-i-s-static {\n  flex-shrink: 0; }\n\n.-i-s-horizontal {\n  flex-direction: row; }\n\n.-i-s-vertical {\n  flex-direction: column; }\n  .-i-s-vertical > .-i-s-in_pre.-i-s-right {\n    transform-origin: 50% 0%;\n    transform: scale(1) rotateX(-60deg); }\n  .-i-s-vertical > .-i-s-in_pre.-i-s-left {\n    transform-origin: 50% 100%;\n    transform: scale(1) rotateX(60deg); }\n  .-i-s-vertical.-i-s-reverse {\n    flex-direction: column-reverse; }\n\n.-i-viewer {\n  background: black;\n  position: absolute;\n  width: 100vw;\n  height: calc(100vh - 50px);\n  top: 50px;\n  left: 0;\n  overflow: hidden;\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n\n.-i-viewer-image {\n  border-radius: 10px;\n  position: absolute;\n  left: 0;\n  top: 0;\n  transition: opacity 0.3s ease;\n  opacity: 1; }\n  .-i-viewer-image:hidden {\n    opacity: 0; }\n\n.-i-loader {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: auto;\n  width: 10px;\n  height: 10px;\n  background-color: #FFFFFF;\n  animation: rotate 1s infinite ease-in-out;\n  transition: opacity 1s ease; }\n\n.-i-loader-stop {\n  animation-iteration-count: 0;\n  opacity: 0.2;\n  transform: scale(0.5); }\n\n@keyframes rotate {\n  0% {\n    transform: perspective(20px) rotateX(0deg) rotateY(0deg); }\n  50% {\n    transform: perspective(20px) rotateX(-180deg) rotateY(0deg); }\n  100% {\n    transform: perspective(20px) rotateX(-180deg) rotateY(-180deg); } }\n\n.home-more-btn {\n  justify-content: flex-start;\n  padding-left: 20px; }\n\n.home-title {\n  font-family: Merienda;\n  font-size: 80px;\n  color: white; }\n\n.gain {\n  color: #1294bf; }\n\n.loss {\n  color: #FF5027; }\n\n.blue {\n  color: #1294bf;\n  background: #171a1c; }\n\n.blue-inv {\n  color: #171a1c;\n  background: #1294bf; }\n\n.opaque {\n  opacity: 0 !important; }\n\n.app-title {\n  font-family: Merienda;\n  font-size: 50px;\n  text-align: center;\n  color: #95B4C0; }\n\n.-i-overlay {\n  background: rgba(64, 94, 109, 0.86); }\n\n.noselect {\n  -webkit-touch-callout: none;\n  /* iOS Safari */\n  -webkit-user-select: none;\n  /* Safari */\n  -khtml-user-select: none;\n  /* Konqueror HTML */\n  -moz-user-select: none;\n  /* Firefox */\n  -ms-user-select: none;\n  /* Internet Explorer/Edge */\n  user-select: none;\n  /* Non-prefixed version, currently\n                                  supported by Chrome and Opera */ }\n\n.select {\n  -webkit-touch-callout: initial;\n  /* iOS Safari */\n  -webkit-user-select: initial;\n  /* Safari */\n  -khtml-user-select: initial;\n  /* Konqueror HTML */\n  -moz-user-select: initial;\n  /* Firefox */\n  -ms-user-select: initial;\n  /* Internet Explorer/Edge */\n  user-select: initial;\n  /* Non-prefixed version, currently\n                                  supported by Chrome and Opera */ }\n\n* {\n  -webkit-touch-callout: none;\n  /* iOS Safari */\n  -webkit-user-select: none;\n  /* Safari */\n  -khtml-user-select: none;\n  /* Konqueror HTML */\n  -moz-user-select: none;\n  /* Firefox */\n  -ms-user-select: none;\n  /* Internet Explorer/Edge */\n  user-select: none;\n  /* Non-prefixed version, currently */ }\n\nhtml {\n  background: #21282c; }\n\nbody {\n  background: #21282c;\n  color: #95B4C0;\n  text-rendering: geometricPrecision;\n  font-size: 14px;\n  overflow: hidden;\n  transition: color 0.3s ease; }\n\n.hidden2 {\n  visibility: hidden; }\n\n.b0 {\n  background: #171a1c;\n  color: #95B4C0; }\n\n.b1 {\n  background: #21282c;\n  color: #95B4C0; }\n\n.b1a {\n  background: #243035;\n  color: #95B4C0; }\n\n.b2 {\n  background: #365463;\n  color: white; }\n\n.b3 {\n  background: #95B4C0;\n  color: #171a1c; }\n\n.bg-highlight {\n  background: cyan;\n  color: #171a1c; }\n\n.bg-dark {\n  background: #171a1c;\n  color: #95B4C0; }\n\n.bg-light {\n  background: #95B4C0;\n  color: #171a1c; }\n\ndiv.btn {\n  flex-shrink: 0;\n  height: 50px;\n  cursor: pointer;\n  text-transform: uppercase;\n  text-rendering: geometricPrecision;\n  font-size: 12px; }\n\n.btn-sidebar {\n  height: 50px;\n  background: #95B4C0;\n  color: #171a1c; }\n\n.active {\n  background: #365463;\n  color: #95B4C0; }\n\n.slideshow {\n  height: 100%;\n  width: 100%; }\n  .slideshow img {\n    width: auto;\n    height: auto; }\n\n.pin-btn {\n  transition: background 0.3s ease;\n  width: 50px;\n  flex-shrink: 0;\n  transition: opacity 0.3s ease; }\n  .pin-btn:hover {\n    background: rgba(0, 0, 0, 0.1); }\n  .pin-btn.hidden-pin-btn {\n    opacity: 0; }\n  .pin-btn.active-pin {\n    background: rgba(0, 0, 0, 0.1); }\n\n.modal-label {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  height: 50px;\n  padding-left: 25px;\n  line-height: 50px;\n  font-family: 'Roboto Slab', serif;\n  opacity: 0.75; }\n\n.modal-label-pre {\n  color: grey; }\n\n.btn-add {\n  background: rgba(0, 0, 0, 0.1); }\n\n.stat-label {\n  padding: 0px 5px;\n  opacity: 0.5; }\n\n.stat-val {\n  padding: 0px 5px; }\n\n.view-sub {\n  background: #171a1c; }\n\n.view-bar {\n  background: #365463; }\n\n.view-error {\n  width: 100%;\n  height: 100%;\n  background: #de3232;\n  color: white;\n  font-weight: 700;\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n  .view-error .error-code {\n    opacity: 0.5;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    padding: 10px; }\n\n.error-bg {\n  background: #de3232;\n  color: white; }\n\n.error {\n  color: #de3232; }\n\n.show-listitem-pins {\n  position: absolute;\n  right: 0px; }\n\n.pin-link {\n  background: white; }\n\n.pin-title {\n  background: rgba(0, 0, 0, 0.06);\n  height: auto;\n  position: absolute;\n  color: white;\n  font-family: 'Roboto Slab', serif;\n  bottom: 10%;\n  padding: 5px 10px;\n  width: 100%;\n  left: 0px; }\n\n.pin-wrap {\n  width: 100%;\n  height: 100%;\n  position: relative; }\n\n.pin {\n  cursor: pointer;\n  overflow: hidden;\n  position: relative;\n  height: calc( 100% - 10px);\n  border-radius: 5px;\n  width: calc( 100% - 10px); }\n  .pin .pin_icon {\n    opacity: 0;\n    transition: opacity 0.3s ease; }\n  .pin:hover .pin_icon {\n    opacity: 0.3; }\n\n.modal-link {\n  min-width: 400px;\n  height: auto; }\n\n.invite-link {\n  line-height: 50px;\n  color: #1294bf;\n  font-family: 'Roboto Slab', serif;\n  text-align: center; }\n  .invite-link span {\n    text-align: center;\n    width: 100%; }\n\n.pins {\n  background: #171a1c; }\n  .pins .pins-options {\n    display: flex;\n    height: 50px; }\n  .pins .grid-inner {\n    width: calc(100% - 20px);\n    margin: 0px 10px;\n    margin-top: 10px; }\n\n.pin-img {\n  transform: none !important;\n  background-size: cover;\n  background-position: center; }\n\n.pin-textsms {\n  background: #131313;\n  color: #e0e0e0;\n  font-size: 16px;\n  font-family: 'Roboto Slab', serif;\n  padding: 30px; }\n\n.list {\n  overflow-y: scroll;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n  display: block; }\n\n.list-alt {\n  background: rgba(0, 0, 0, 0.06); }\n\n.list-content {\n  display: block;\n  color: #95B4C0;\n  font-size: 15px; }\n\n.sub {\n  font-size: 12px;\n  opacity: 0.8; }\n\nspan {\n  opacity: 0.999; }\n\n.expand-btn i {\n  transition: transform 0.3s ease; }\n\n.btn-rotate i {\n  transition: transform 0.4s cubic-bezier(0.25, 0.34, 0, 1); }\n\n.btn-rotate-90 i {\n  transform: rotate(-90deg); }\n\n.expand-btn.expanded i {\n  transform: rotate(45deg); }\n\n.todo-date {\n  transition: color 0.3s ease;\n  line-height: 50px;\n  padding-left: 10px;\n  font-size: 13px;\n  text-transform: uppercase;\n  font-weight: 500; }\n  .todo-date span {\n    opacity: 0.8; }\n  .todo-date.done {\n    color: #C08F84; }\n\n.check-btn.check-btn-done {\n  color: #C08F84; }\n\n.check-btn {\n  color: #171a1c; }\n  .check-btn i {\n    transition: color 0.3s ease; }\n  .check-btn:hover i {\n    color: #95B4C0 !important; }\n\n.todo.done {\n  color: #C08F84; }\n  .todo.done i {\n    color: #C08F84; }\n\n.todo.undone:hover i {\n  color: #95B4C0; }\n\n.todo-sub-item {\n  padding-left: 50px; }\n\n.pin_icon {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  background: white;\n  border-radius: 0px 5px;\n  padding: 6px;\n  font-size: 19px;\n  opacity: 0.3;\n  color: black; }\n\n.todo-wrap {\n  transition: color 0.3s ease;\n  cursor: pointer; }\n  .todo-wrap .name {\n    font-family: 'Roboto Slab', serif;\n    font-size: 16px;\n    padding-left: 15px;\n    line-height: 50px; }\n  .todo-wrap .created_at {\n    font-family: Arial;\n    transition: opacity 0.2s ease;\n    position: absolute;\n    right: 0px;\n    top: 0px;\n    opacity: 0.2;\n    color: whitesmoke;\n    height: 50px;\n    line-height: 50px;\n    padding-right: 5px; }\n  .todo-wrap.done i {\n    color: #C08F84; }\n  .todo-wrap .completed {\n    color: #C08F84; }\n  .todo-wrap.done {\n    color: #C08F84; }\n\n.main-menu {\n  z-index: 3; }\n\n.photo_count {\n  position: absolute;\n  bottom: 5px;\n  right: 5px;\n  line-height: 14px;\n  font-size: 14px;\n  opacity: 0.99; }\n\n.list-item {\n  background: #243035; }\n  .list-item:hover {\n    background: #171a1c;\n    transition: background 0.3s ease;\n    cursor: pointer; }\n\n.list-count {\n  opacity: 0.99;\n  font-family: 'Roboto Slab', serif;\n  color: grey;\n  font-size: 24px;\n  padding: 0px 10px;\n  width: auto; }\n  .list-count div {\n    transform: none !important; }\n\n.list-name {\n  font-size: 20px;\n  font-family: 'Roboto Slab', serif;\n  color: #95B4C0; }\n\n.room-members {\n  padding: 20px 100px;\n  flex-wrap: wrap; }\n\n.profile-self-label {\n  position: absolute;\n  height: 10px;\n  width: 10px;\n  background: #05bdff;\n  bottom: 6%;\n  right: 8%;\n  border-radius: 5px; }\n\n.profile-mini-selected {\n  background: rgba(0, 0, 0, 0.6);\n  align-items: center;\n  border-radius: 50%;\n  display: flex;\n  /* border: 12px solid black; */\n  height: 105%;\n  width: 105%;\n  margin-top: -2.5%;\n  margin-left: -2.5%;\n  align-content: center;\n  justify-content: center; }\n\n.search-results {\n  margin-top: 10px;\n  display: flex;\n  justify-content: center; }\n  .search-results .profile-mini {\n    margin: 10px; }\n\n.profile-mini {\n  position: relative;\n  flex-direction: column;\n  align-items: center;\n  justify-content: flex-end;\n  width: 100%;\n  overflow: hidden;\n  height: 100%;\n  max-width: 120px;\n  max-height: 120px;\n  background: #243035;\n  padding: 5px;\n  cursor: pointer;\n  transition: background 0.3s ease; }\n  .profile-mini:hover {\n    background: #171a1c; }\n  .profile-mini .profile-name {\n    font-family: 'Roboto Slab', serif;\n    color: #95B4C0;\n    line-height: 30px;\n    font-size: 16px;\n    text-align: center;\n    height: 30px; }\n  .profile-mini .avatar {\n    background: #2b383e;\n    position: relative;\n    cursor: pointer;\n    background-position: center;\n    background-size: cover;\n    height: 60%;\n    width: 60%;\n    border-radius: 50%; }\n  .profile-mini .name {\n    animation: color 0.3s ease;\n    font-family: Merienda; }\n\n.button-person-add {\n  color: #5c6467; }\n\n.login-form {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  width: 100%;\n  height: 100%;\n  margin: 0; }\n\n.title {\n  width: 100%;\n  text-align: center;\n  line-height: 30px;\n  font-weight: 600;\n  text-transform: uppercase;\n  opacity: 0.5; }\n\n.modal {\n  padding: 20px; }\n\n.lists-grid {\n  overflow: visible;\n  height: auto; }\n\n.lists-inner {\n  overflow: scroll; }\n\n.lists-options {\n  background: #171a1c; }\n\n.form {\n  min-width: 400px;\n  min-height: 200px; }\n  .form.pin-form {\n    min-height: 300px; }\n  .form input {\n    font-size: 16px !important; }\n  .form .input-amount-submit {\n    left: 0px;\n    opacity: 0.99;\n    text-transform: uppercase;\n    margin-top: 50px;\n    width: 50% !important;\n    left: 25%; }\n  .form .input-amount-submit-s {\n    color: #95B4C0;\n    background: rgba(0, 0, 0, 0.1); }\n  .form .input-amount-submit-p {\n    color: #171a1c;\n    background: #95B4C0; }\n  .form .input-amount-submit-false {\n    color: #365463; }\n\n.list-title {\n  opacity: 0.99;\n  font-family: 'Roboto Slab', serif;\n  font-size: 16px;\n  font-weight: 500;\n  line-height: 54px;\n  padding: 0px 10px; }\n\n.viewer {\n  background: black;\n  position: absolute;\n  width: 100vw;\n  height: calc(100vh - 50px);\n  top: 50px;\n  left: 0;\n  overflow: hidden; }\n\n.viewer-image {\n  border-radius: 10px;\n  position: absolute;\n  left: 0;\n  top: 0; }\n\n.add-btn {\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center;\n  height: 100%;\n  width: 100%;\n  cursor: pointer;\n  background: rgba(0, 0, 0, 0.06);\n  transition: background 0.3s ease; }\n  .add-btn:hover {\n    background: #171a1c; }\n\n.add-friend-view {\n  width: 80%;\n  min-width: 450px;\n  max-height: 500px; }\n\n.btn-opaque {\n  opacity: 0.4;\n  transition: opacity 0.3s ease; }\n  .btn-opaque:hover {\n    opacity: 0.6; }\n\n.user-overlay-delete {\n  cursor: pointer;\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  background: rgba(23, 26, 28, 0.83);\n  opacity: 1;\n  transition: opacity 0.3s ease;\n  z-index: 10;\n  align-items: center;\n  display: flex;\n  align-content: center;\n  justify-content: center; }\n  .user-overlay-delete i {\n    color: red; }\n  .user-overlay-delete.hidden {\n    opacity: 0; }\n  .user-overlay-delete:hover {\n    opacity: 1; }\n", ""]);

// exports


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (true) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = __webpack_require__(43);


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * 
 * @preventMunge
 */



exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = __webpack_require__(41);

var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *         case 'city-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

var Dispatcher = (function () {
  function Dispatcher() {
    _classCallCheck(this, Dispatcher);

    this._callbacks = {};
    this._isDispatching = false;
    this._isHandled = {};
    this._isPending = {};
    this._lastID = 1;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   */

  Dispatcher.prototype.register = function register(callback) {
    var id = _prefix + this._lastID++;
    this._callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   */

  Dispatcher.prototype.unregister = function unregister(id) {
    !this._callbacks[id] ?  true ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
    delete this._callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   */

  Dispatcher.prototype.waitFor = function waitFor(ids) {
    !this._isDispatching ?  true ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this._isPending[id]) {
        !this._isHandled[id] ?  true ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
        continue;
      }
      !this._callbacks[id] ?  true ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
      this._invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   */

  Dispatcher.prototype.dispatch = function dispatch(payload) {
    !!this._isDispatching ?  true ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
    this._startDispatching(payload);
    try {
      for (var id in this._callbacks) {
        if (this._isPending[id]) {
          continue;
        }
        this._invokeCallback(id);
      }
    } finally {
      this._stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   */

  Dispatcher.prototype.isDispatching = function isDispatching() {
    return this._isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @internal
   */

  Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
    this._isPending[id] = true;
    this._callbacks[id](this._pendingPayload);
    this._isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @internal
   */

  Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
    for (var id in this._callbacks) {
      this._isPending[id] = false;
      this._isHandled[id] = false;
    }
    this._pendingPayload = payload;
    this._isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */

  Dispatcher.prototype._stopDispatching = function _stopDispatching() {
    delete this._pendingPayload;
    this._isDispatching = false;
  };

  return Dispatcher;
})();

module.exports = Dispatcher;

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = isPromise;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (;
    part = parser.exec(query);
    result[decode(part[1])] = decode(part[2])
  );

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};


/***/ }),
/* 47 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(34);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./Button.scss", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./Button.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./SlideButton.scss", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./SlideButton.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(36);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./Grid.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./Grid.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(38);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./Modal.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./Modal.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(39);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./Overlay.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./Overlay.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var required = __webpack_require__(46)
  , qs = __webpack_require__(45)
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @api public
 */
function lolcation(loc) {
  loc = loc || global.location || {};

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @api private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @api private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @api public
 */
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL}
 * @api public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
      url.pathname = value.length && value.charAt(0) !== '/' ? '/' + value : value;

      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String}
 * @api public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

URL.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
URL.extractProtocol = extractProtocol;
URL.location = lolcation;
URL.qs = qs;

module.exports = URL;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 54 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map