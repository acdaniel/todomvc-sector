var sector; try { sector = require('sector'); } catch (e) { sector = window.sector; }
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