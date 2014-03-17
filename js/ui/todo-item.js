/* global sector */
(function() {
  'use strict';

  var ENTER_KEY = 13,
      ESCAPE = 27;

  var Component = sector.Component,
      View = sector.mixins.View;

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
    initialize: function (options) {
      var todo = options.todo;
      todo.checked = todo.completed ? 'checked' : '';
      this.render(todo);
      this.el.setAttribute('data-todo-id', todo.id);
      this.el.className = todo.completed ? 'completed' : '';
      this.subscribe('data.todoUpdated', this.handleTodoUpdated);
      this.subscribe('data.todoRemoved', this.handleTodoRemoved);
    },
    saveTodo: function () {
      var todoText = this.ui.edit.value.trim(),
          todoId = this.el.getAttribute('data-todo-id');
      if (todoText === this.preEditValue) { return; }
      if (todoText === '') {
        this.publish('ui.removeTodoRequested', todoId);
      } else {
        this.publish('ui.updateTodoRequested', {id: todoId, text: todoText });
        this.ui.label.innerText = todoText;
      }
    },
    stopEditing: function () {
      if (!this.el) { return; }
      this.el.className = this.el.className.replace('editing', '').trim();
      this.preEditValue = null;
    },
    handleDblClick: function () {
      this.preEditValue = this.ui.edit.value.trim();
      this.el.className += ' editing';
      this.ui.edit.focus();
    },
    handleToggleClick: function () {
      var completed = this.ui.toggle.checked,
          todoId = this.el.getAttribute('data-todo-id');
      this.publish('ui.toggleCompleteRequested', {
        id: todoId, completed: completed
      });
    },
    handleDestroyClick: function () {
      var todoId = this.el.getAttribute('data-todo-id');
      this.publish('ui.removeTodoRequested', todoId);
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
      if (todo.id == this.el.getAttribute('data-todo-id')) {
        if (!msg.data.visible) {
          this.remove();
        } else {
          this.ui.edit.value = todo.text;
          this.ui.label.innerText = todo.text;
          this.ui.toggle.checked = todo.completed;
          this.el.className = todo.completed ? 'completed' : '';
        }
      }
    },
    handleTodoRemoved: function (msg) {
      var todo = msg.data.todo;
      if (todo.id == this.el.getAttribute('data-todo-id')) {
        this.remove();
      }
    }
  }, View);

})();