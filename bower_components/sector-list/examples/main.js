/* global sector */

var View = sector.mixins.View,
    Bound = sector.mixins.Bound,
    List = sector.ext.list.mixins.List,
    Selectable = sector.ext.list.mixins.Selectable,
    utils = sector.utils;

// form component to add items to list
sector.Component.define({
  type: 'simple-item-form',
  debug: true,
  events: {
    submit: 'handleSubmit'
  },
  binding: {
    firstName: '[name=firstName]',
    lastName: '[name=lastName]'
  },
  handleSubmit: function (event) {
    event.preventDefault();
    this.publish('ui.addItemRequested', utils.clone(this.data));
  }
}, View, Bound);

// list item component
sector.Component.define({
  type: 'simple-list-item',
  debug: true,
  template: '#list-item-template',
  ui: {
    remove: 'button.remove',
    select: 'button.select'
  },
  events: {
    'remove click': 'handleRemoveClick',
    'select click': 'handleClick',
    'selected': 'handleSelected'
  },
  binding: {
    firstName: '.firstName',
    lastName: '.lastName'
  },
  initialize: function () {
    this.render(this.data);
  },
  handleRemoveClick: function (event) {
    event.preventDefault();
    this.remove();
  },
  handleClick: function (event) {
    event.preventDefault();
    this.selected = !this.selected;
  },
  handleSelected: function () {
    if (this.selected) {
      utils.addClassName(this.el, 'selected');
    } else {
      utils.removeClassName(this.el, 'selected');
    }
  }
}, View, Bound, Selectable);

// list component
sector.Component.define({
  type: 'simple-list',
  debug: true,
  itemTagName: 'li',
  itemComponent: 'simple-list-item',
  itemParent: 'ul',
  allowMultipleSelections: false,
  ui: {
    button: 'button'
  },
  events: {
    'button click': 'handleButtonClick'
  },
  initialize: function () {
    this.subscribe('ui.addItemRequested', this.handleAddItemRequested);
  },
  handleAddItemRequested: function (msg) {
    this.addItem(msg.data);
  },
  handleButtonClick: function (event) {
    event.preventDefault();
    alert(JSON.stringify(this.getSelectionData()));
  }
}, View, List);

sector.init();