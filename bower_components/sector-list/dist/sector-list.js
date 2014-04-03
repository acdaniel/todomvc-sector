/**
 * sector-list v0.1.1
 * A list component that allows repeating and binding to a collection for the Sector library
 * https://github.com/acdaniel/sector-list
 *
 * Copyright 2014 Adam Daniel <adam@acdaniel.com>
 * Released under the MIT license
 *
 * Date: 2014-04-03T18:57:16.829Z
 */
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self);var f=o;f=f.sector||(f.sector={}),f=f.ext||(f.ext={}),f.list=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var sector; try { sector = _dereq_('sector'); } catch (e) { sector = window.sector; }
var ListMixin = _dereq_('../mixins/list');

module.exports = sector.Component.define({
  type: 'list'
}, sector.mixins.View, ListMixin);
},{"../mixins/list":3}],2:[function(_dereq_,module,exports){

exports.mixins = {
  List: _dereq_('./mixins/list'),
  Selectable: _dereq_('./mixins/selectable')
};

exports.components = {
  List: _dereq_('./components/list')
};
},{"./components/list":1,"./mixins/list":3,"./mixins/selectable":4}],3:[function(_dereq_,module,exports){
var sector; try { sector = _dereq_('sector'); } catch (e) { sector = window.sector; }
var utils = sector.utils;

module.exports =  function List () {

  this.defaults = utils.defaults({}, this.defaults, {
    itemParent: null,
    itemTagName: 'div',
    itemTagAttrs: null,
    itemComponent: null,
    itemComponentOptions: null
  });

  this.addItem = function (data, index) {
    var component = sector.registry.findComponent(this.itemComponent);
    var el = document.createElement(this.itemTagName);
    if (this.itemTagAttrs) {
      for (var attr in this.itemTagAttrs) {
        el.setAttribute(attr, this.itemTagAttrs[attr]);
      }
    }
    var options = this.itemComponentOptions || {};
    options.id = utils.uniqueId(this.id + '-i');
    options.data = data;
    component.attachTo(el, options);
    if ('undefined' === typeof index) {
      index = this.itemParent.children.length;
    }
    if (index >= this.itemParent.children.length) {
      this.itemParent.appendChild(el);
    } else {
      this.insertBefore(el, this.itemParent.children[index]);
    }
  };

  this.removeItem = function (index) {
    this.itemParent.removeChild(this.itemParent.children[index]);
  };

  this.updateItem = function (index, data) {
    var id = this.itemParent.children[index].id;
    var instance = sector.registry.findInstance(id);
    instance.update(data);
  };

  this.updateItems = function (arr) {
    var i, l, children = this.itemParent.children, id, instance;
    if (arr.length < children.length) {
      for (i = children.length - 1, l = arr.length; i >= l; i--) {
        this.itemParent.removeChild(children[i]);
      }
    }
    for (i = 0, l = arr.length; i < l; i++) {
      if (i >= children.length) {
        this.addItem(arr[i]);
      } else {
        id = children[i].id;
        instance = sector.registry.findInstance(id);
        instance.update(arr[i]);
      }
    }
  };

  this.selectAllItems = function () {
    var id, children = this.itemParent.children;
    for (var i = 0, l = children.length; i < l; i++) {
      id = children[i].id;
      sector.registry.findInstance(id).selected = true;
    }
  };

  this.unselectAllItems = function () {
    var id, children = this.itemParent.children;
    for (var i = 0, l = children.length; i < l; i++) {
      id = children[i].id;
      sector.registry.findInstance(id).selected = false;
    }
  };

  this.before('initialize', function () {
    this.itemParent = this.itemParent || this.el;
    if (utils.isString(this.itemParent)) {
      this.itemParent = this.select(this.itemParent, true);
    }
  });

};
},{}],4:[function(_dereq_,module,exports){
var sector; try { sector = _dereq_('sector'); } catch (e) { sector = window.sector; }
var utils = sector.utils;

module.exports =  function Selectable () {

  this.defaults = utils.defaults({}, this.defaults, {
    selected: false
  });

  Object.defineProperty(this, 'selected', {
    get: function () {
      return this._selected;
    },
    set: function (selected) {
      if (this.el && this._selected !== selected) {
        this._selected = selected;
        var e = utils.createEvent('selected', { selected: selected });
        this.el.dispatchEvent(e);
      }
    }
  });

};
},{}]},{},[2])
(2)
});