/* global sector */

var View = sector.mixins.View,
    Bound = sector.mixins.Bound,
    List = sector.ext.list.mixins.List;

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
    this.publish('ui.addItemRequested', this.data);
  }
}, View, Bound);

// list item component
sector.Component.define({
  type: 'simple-list-item',
  debug: true,
  template: '#list-item-template',
  ui: {
    remove: 'button.remove'
  },
  events: {
    'remove click': 'handleRemoveClick'
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
  }
}, View, Bound);

// list component
sector.Component.define({
  type: 'simple-list',
  debug: true,
  itemComponent: 'simple-list-item',
  initialize: function () {
    this.subscribe('ui.addItemRequested', this.handleAddItemRequested);
  },
  handleAddItemRequested: function (msg) {
    this.addItem(msg.data);
  }
}, List);

sector.init();