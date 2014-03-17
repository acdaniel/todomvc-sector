/* global sector */
(function( window ) {
  'use strict';

  var ENTER_KEY = 13;

  var Component = sector.Component,
      View = sector.mixins.View;

  Component.define({
    type: 'todo-header',
    ui: { text: '#new-todo' },
    events: { 'text.keydown': 'handleTextKeydown' },
    handleTextKeydown: function (event) {
      if (event.which !== ENTER_KEY || !this.ui.text.value.trim()) {
        return;
      }
      this.publish('ui.addTodoRequested', { text: this.ui.text.value.trim() });
      this.ui.text.value = '';
    }
  }, View);

})( window );