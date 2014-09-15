/* global sector */
(function() {
  'use strict';

  var View = sector.mixins.View;

  sector.Component.define({
    type: 'todo-footer',
    ui: {
      count: '#todo-count',
      clear: '#clear-completed',
      allLink: 'a.all',
      activeLink: 'a.active',
      completedLink: 'a.completed',
    },
    events: {
      'click @clear': 'handleClearClick'
    },
    initialize: function () {
      this.subscribe('data.todosLoaded', this.updateCounts);
      this.subscribe('data.todoAdded', this.updateCounts);
      this.subscribe('data.todoUpdated', this.updateCounts);
      this.subscribe('data.todoRemoved', this.updateCounts);
      this.subscribe('ui.viewAllRequested', this.handleViewAll);
      this.subscribe('ui.viewActiveRequested', this.handleViewActive);
      this.subscribe('ui.viewCompletedRequested', this.handleViewCompleted);
    },
    updateCounts: function (msg) {
      var countLabel = '<strong>' + msg.data.activeCount + '</strong>';
      countLabel += msg.data.activeCount === 1 ? ' item left' : ' items left';
      this.ui.count.innerHTML = countLabel;
      this.ui.clear.textContent = 'Clear completed (' + msg.data.completedCount + ')';
      this.ui.clear.style.visibility = msg.data.completedCount > 0 ? 'visible' : 'hidden';
      this.el.style.display = msg.data.totalCount > 0 ? 'block' : 'none';
    },
    handleClearClick: function () {
      this.publish('ui.clearCompletedRequested');
    },
    handleViewAll: function (msg) {
      sector.addClassName(this.ui.allLink, 'selected');
      sector.removeClassName(this.ui.activeLink, 'selected');
      sector.removeClassName(this.ui.completedLink, 'selected');
    },
    handleViewActive: function (msg) {
      sector.removeClassName(this.ui.allLink, 'selected');
      sector.addClassName(this.ui.activeLink, 'selected');
      sector.removeClassName(this.ui.completedLink, 'selected');
    },
    handleViewCompleted: function (msg) {
      sector.removeClassName(this.ui.allLink, 'selected');
      sector.removeClassName(this.ui.activeLink, 'selected');
      sector.addClassName(this.ui.completedLink, 'selected');
    }
  }, View);

})();