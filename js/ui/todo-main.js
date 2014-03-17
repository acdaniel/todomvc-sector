/* global sector */
(function( window ) {
  'use strict';

  var Component = sector.Component,
      TodoItem = sector.registry.findComponent('todo-item'),
      View = sector.mixins.View;

  Component.define({
    type: 'todo-main',
    ui: {
      toggle: '#toggle-all',
      list: '#todo-list'
    },
    events: {
      'toggle.click': 'handleToggleClick'
    },
    initialize: function () {
      this.el.style.display = 'none';
      this.subscribe('data.todosLoaded', this.handleTodosLoaded);
      this.subscribe('data.todoAdded', this.handleTodoAdded);
      this.subscribe('data.todoRemoved', this.updateDisplay);
      this.subscribe('data.todoUpdated', this.updateDisplay);
      this.subscribe('ui.routeChanged', this.handleRouteChanged);
    },
    handleToggleClick: function () {
      var completed = this.ui.toggle.checked;
      this.publish('ui.toggleAllCompleteRequested', { completed: completed });
    },
    updateDisplay: function (msg) {
      if (msg.data.totalCount === 0) {
        this.el.style.display = 'none';
      }
      this.ui.toggle.checked = (msg.data.completedCount === msg.data.totalCount);
    },
    renderList: function (todos) {
      this.trace('rendering list items', todos);
      this.ui.list.innerHTML = '';
      if (todos.length === 0) {
        this.el.style.display = 'none';
        return;
      }
      for (var i = 0, l = todos.length; i < l; i++) {
        this.addTodoToList(todos[i]);
      }
      this.el.style.display = 'block';
    },
    addTodoToList: function (todo) {
      var listItem = document.createElement('li');
      this.ui.list.appendChild(listItem);
      TodoItem.attachTo(listItem, { debug: false, todo: todo});
      this.el.style.display = 'block';
    },
    handleTodosLoaded: function (msg) {
      this.trace('todos have been loaded');
      var todos = msg.data.todos;
      this.renderList(todos);
      this.updateDisplay(msg);
    },
    handleTodoAdded: function (msg) {
      if (msg.data.visible) {
        this.addTodoToList(msg.data.todo);
      }
    },
    handleRouteChanged: function (msg) {
      var filter = msg.data.name || 'all';
      this.publish('ui.loadTodosRequested', {filter: filter});
    }
  }, View);

})( window );