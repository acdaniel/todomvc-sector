/* global sector */
(function() {
  'use strict';

  var View = sector.mixins.View;
  var List = sector.ext.list.mixins.List;

  sector.Component.define({
    type: 'todo-main',
    ui: {
      toggle: '#toggle-all',
      list: '#todo-list'
    },
    events: {
      'click @toggle': 'handleToggleClick'
    },
    itemParent: '#todo-list',
    itemTagName: 'li',
    itemComponent: 'todo-item',
    initialize: function () {
      this.el.style.display = 'none';
      this.subscribe('data.todosLoaded', this.handleTodosLoaded);
      this.subscribe('data.todoAdded', this.handleTodoAdded);
      this.subscribe('data.todoRemoved', this.updateDisplay);
      this.subscribe('data.todoUpdated', this.updateDisplay);
      this.subscribe('ui.viewAllRequested', this.handleViewAll);
      this.subscribe('ui.viewActiveRequested', this.handleViewActive);
      this.subscribe('ui.viewCompletedRequested', this.handleViewCompleted);
    },
    handleToggleClick: function () {
      var completed = this.ui.toggle.checked;
      this.publish('ui.toggleAllCompleteRequested', { completed: completed });
    },
    updateDisplay: function (msg) {
      this.el.style.display = (msg.data.todos && msg.data.todos.length === 0) ? 'none' : 'block';
      this.ui.toggle.checked = (msg.data.totalCount !== 0 && msg.data.completedCount === msg.data.totalCount);
    },
    handleTodosLoaded: function (msg) {
      this.trace('todos have been loaded');
      this.updateItems(msg.data.todos);
      this.updateDisplay(msg);
    },
    handleTodoAdded: function (msg) {
      if (msg.data.visible) {
        this.addItem(msg.data.todo);
        this.el.style.display = 'block';
      }
    },
    handleViewAll: function (msg) {
      this.publish('ui.loadTodosRequested', {filter: 'all'});
    },
    handleViewActive: function (msg) {
      this.publish('ui.loadTodosRequested', {filter: 'active'});
    },
    handleViewCompleted: function (msg) {
      this.publish('ui.loadTodosRequested', {filter: 'completed'});
    }
  }, View, List);

})();