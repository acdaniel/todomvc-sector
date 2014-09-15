/* global sector */
(function( window ) {
  'use strict';

  sector.Component.define({
    type: 'todos',
    initialize: function () {
      this.store = window.depot('todos', { idAttribute: 'id' });
      this.filter = 'all';
      this.subscribe('ui.loadTodosRequested', this.handleLoad);
      this.subscribe('ui.addTodoRequested', this.handleAdd);
      this.subscribe('ui.removeTodoRequested', this.handleRemove);
      this.subscribe('ui.updateTodoRequested', this.handleUpdate);
      this.subscribe('ui.toggleCompleteRequested', this.handleToggle);
      this.subscribe('ui.toggleAllCompleteRequested', this.handleToggleAll);
      this.subscribe('ui.clearCompletedRequested', this.handleClearCompleted);
    },
    getCounts: function () {
      return {
        totalCount: this.store.size(),
        activeCount: this.store.find({completed: false}).length,
        completedCount: this.store.find({completed: true}).length
      };
    },
    handleLoad: function (msg) {
      var todos, response, filter = this.filter;
      if (msg.data && msg.data.filter) {
        filter = msg.data.filter.toLowerCase();
      }
      switch (filter) {
        case 'active':
          todos = this.store.find({completed: false});
          break;
        case 'completed':
          todos = this.store.find({completed: true});
          break;
        default:
          filter = 'all';
          todos = this.store.all();
      }
      this.filter = filter;
      response = this.getCounts();
      response.todos = todos;
      response.filter = filter;
      this.publish('data.todosLoaded', response);
    },
    handleAdd: function (msg) {
      var visible = this.filter !== 'complete', response;
      var todo = {
        text: msg.data.text,
        completed: false
      };
      this.store.save(todo);
      response = this.getCounts();
      response.todo = todo;
      response.visible = visible;
      this.publish('data.todoAdded', response);
    },
    handleRemove: function (msg) {
      var id = msg.data.id || msg.data, todo, response;
      if (!id) { return; }
      todo = this.store.get(id);
      this.store.destroy(id);
      response = this.getCounts();
      response.todo = todo;
      this.publish('data.todoRemoved', response);
    },
    handleUpdate: function (msg) {
      var response;
      var todo = {
        id: msg.data.id,
        text: msg.data.text,
        completed: msg.data.completed || false
      };
      this.store.save(todo);
      response = this.getCounts();
      response.todo = todo;
      response.visible = this.filter === 'all' || (this.filter === 'completed' && todo.completed);
      this.publish('data.todoUpdated', response);
    },
    handleToggle: function (msg) {
      var id = msg.data.id || msg.data, response;
      if (!id) { return; }
      var todo = this.store.get(id);
      todo.completed = !todo.completed;
      this.store.save(todo);
      response = this.getCounts();
      response.todo = todo;
      response.visible = this.filter === 'all' || (this.filter === 'completed' && todo.completed);
      this.publish('data.todoUpdated', response);
    },
    handleToggleAll: function (msg) {
      var completed = !!msg.data.completed;
      this.store.updateAll({ completed: completed});
      this.handleLoad(msg);
    },
    handleClearCompleted: function (msg) {
      this.store.destroyAll({completed: true});
      this.handleLoad(msg);
    }
  });
})( window );