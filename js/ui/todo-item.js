/* global sector */
(function() {
  'use strict';

  var ENTER_KEY = 13,
      ESCAPE = 27;

  var Component = sector.Component,
      View = sector.mixins.View,
      Bound = sector.mixins.Bound,
      utils = sector.utils;

  Component.define({
    type: 'todo-item',
    template: '#template-todo-item',
    ui: {
      label: 'label',
      toggle: 'input.toggle',
      destroy: 'button.destroy',
      edit: 'input.edit'
    },
    events: {
      'dblclick': 'handleDblClick',
      'toggle.click': 'handleToggleClick',
      'destroy.click': 'handleDestroyClick',
      'edit.keydown': 'handleEditKeydown',
      'edit.blur': 'handleEditBlur'
    },
    binding: {
      'id': { attribute: 'data-todo-id' },
      'completed': {
        selector: 'input.toggle',
        events: ['click']
      },
      'text': 'label, input.edit',
    },
    initialize: function (options) {
      this.render(this.data);
      if (this.data.completed) {
        utils.addClassName(this.el, 'completed');
      }
      this.subscribe('data.todoUpdated', this.handleTodoUpdated);
      this.subscribe('data.todoRemoved', this.handleTodoRemoved);
    },
    saveTodo: function () {
      var todoText = this.data.text.trim(),
          todoId = this.data.id;
      if (todoText === this.preEditValue) { return; }
      if (todoText === '') {
        this.publish('ui.removeTodoRequested', todoId);
      } else {
        this.publish('ui.updateTodoRequested', {id: todoId, text: todoText });
      }
    },
    stopEditing: function () {
      if (!this.el) { return; }
      utils.removeClassName(this.el, 'editing');
      this.preEditValue = null;
    },
    handleDblClick: function () {
      this.preEditValue = this.data.text.trim();
      utils.addClassName(this.el, 'editing');
      this.ui.edit.focus();
    },
    handleToggleClick: function () {
      var completed = this.data.checked,
          todoId = this.data.id;
      this.publish('ui.toggleCompleteRequested', {
        id: todoId, completed: completed
      });
    },
    handleDestroyClick: function () {
      this.publish('ui.removeTodoRequested', this.data.id);
    },
    handleEditKeydown: function (event) {
      if (this.el.className.indexOf('editing') !== -1) {
        if (event.which === ENTER_KEY) {
          this.stopEditing();
          this.saveTodo();
        } else if (event.which === ESCAPE) {
          this.stopEditing();
        }
      }
    },
    handleEditBlur: function () {
      if (this.el.className.indexOf('editing') !== -1) {
        this.stopEditing();
        this.saveTodo();
      }
    },
    handleTodoUpdated: function (msg) {
      var todo = msg.data.todo;
      if (todo.id == this.data.id) {
        if (!msg.data.visible) {
          this.remove();
        } else {
          this.update(todo);
          this.el.className = todo.completed ? 'completed' : '';
        }
      }
    },
    handleTodoRemoved: function (msg) {
      var todo = msg.data.todo;
      if (todo.id == this.data.id) {
        this.remove();
      }
    }
  }, View, Bound);

})();