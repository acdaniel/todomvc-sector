/* global sector */
(function() {
  'use strict';

  var Component = sector.Component,
      View = sector.mixins.View,
      RouteNav = sector.ext.router.mixins.RouteNav;

  Component.define({
    type: 'todo-footer',
    activeClassName: 'selected',
    linkSelector: '#filters li a',
    ui: {
      count: '#todo-count',
      clear: '#clear-completed'
    },
    events: {
      'clear.click': 'handleClearClick'
    },
    initialize: function () {
      this.subscribe('data.todosLoaded', this.updateCounts);
      this.subscribe('data.todoAdded', this.updateCounts);
      this.subscribe('data.todoUpdated', this.updateCounts);
      this.subscribe('data.todoRemoved', this.updateCounts);
    },
    updateCounts: function (msg) {
      var countLabel = '<strong>' + msg.data.activeCount + '</strong>';
      countLabel += msg.data.activeCount === 1 ? ' item left' : ' items left';
      this.ui.count.innerHTML = countLabel;
      this.ui.clear.innerText = 'Clear completed (' + msg.data.completedCount + ')';
      this.ui.clear.style.visibility = msg.data.completedCount > 0 ? 'visible' : 'hidden';
      this.el.style.display = msg.data.totalCount > 0 ? 'block' : 'none';
    },
    handleClearClick: function () {
      this.publish('ui.clearCompletedRequested');
    }
  }, View, RouteNav);

})();