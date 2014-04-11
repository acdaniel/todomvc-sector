var sector; try { sector = require('sector'); } catch (e) { sector = window.sector; }
var Selectable = require('./selectable');

module.exports =  function List () {

  this.defaults = sector.defaults({}, this.defaults, {
    itemParent: null,
    itemTagName: 'div',
    itemTagAttrs: null,
    itemComponent: null,
    itemComponentOptions: null,
    allowMultipleSelections: true
  });

  this.addItem = function (data, index) {
    var component = sector.registry.findComponent(this.itemComponent);
    var el = document.createElement(this.itemTagName);
    if (this.itemTagAttrs) {
      for (var attr in this.itemTagAttrs) {
        el.setAttribute(attr, this.itemTagAttrs[attr]);
      }
    }
    var options = this.itemComponentOptions ? sector.clone(this.itemComponentOptions) : {};
    options.id = sector.uniqueId(this.id + '-i');
    options.data = data;
    component.attachTo(el, options);
    if ('undefined' === typeof index || index >= this.itemParent.children.length) {
      this.itemParent.appendChild(el);
    } else {
      this.insertBefore(el, this.itemParent.children[index]);
    }
    if (component.prototype._mixins.indexOf(Selectable) > -1) {
      this.listenTo(el, 'selected', function (event) {
        var el = event.target, selected = event.detail.selected, index;
        if (this.allowMultipleSelections) {
          index = this._selectedElements.indexOf(el);
          if (selected && index === -1) {
            this._selectedElements.push(el);
          } else if (!selected && index >= 0) {
            this._selectedElements.splice(index, 1);
          }
        } else {
          if (this._selectedElements[0] && this._selectedElements[0] !== el) {
            sector.registry.findInstance(this._selectedElements[0].id).selected = false;
          } else if (!selected) {
            this._selectedElements = [];
          }
          if (selected) {
            this._selectedElements[0] = el;
          }
        }
      });
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

  this.getSelectionData = function () {
    var id, data = new Array(this._selectedElements.length);
    for (var i = 0, l = this._selectedElements.length; i < l; i++) {
      id = this._selectedElements[i].id;
      data[i] = sector.registry.findInstance(id).data;
    }
    return data;
  };

  this.selectAllItems = function () {
    if (!this.allowMultipleSelections) {
      return;
    }
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
    this._selectedElements = [];
    this.itemParent = this.itemParent || this.el;
    if (sector.isString(this.itemParent)) {
      this.itemParent = this.select(this.itemParent, true);
    }
  });

};