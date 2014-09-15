/* global sector */
(function() {
  'use strict';

  var ENTER_KEY = 13;

  var View = sector.mixins.View;

  sector.Component.define({
    type: 'todo-header',
    ui: { text: '#new-todo' },
    events: { 'keydown @text': 'handleTextKeydown' },
    handleTextKeydown: function (event) {
      if (event.which !== ENTER_KEY || !this.ui.text.value.trim()) {
        return;
      }
      this.publish('ui.addTodoRequested', { text: this.ui.text.value.trim() });
      this.ui.text.value = '';
    }
  }, View);

})();