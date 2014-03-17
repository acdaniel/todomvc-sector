/* global sector */
(function( window ) {
  'use strict';

  var Component = sector.Component,
      View = sector.mixins.View;

  Component.define({
    type: 'todo-footer',
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
      this.subscribe('ui.routeChanged', this.handleRouteChanged);
    },
    updateCounts: function (msg) {
      var countLabel = '<strong>' + msg.data.activeCount + '</strong>';
      countLabel += msg.data.activeCount === 1 ? ' item left' : ' items left';
      this.ui.count.innerHTML = countLabel;
      this.ui.clear.innerText = 'Clear completed (' + msg.data.completedCount + ')';
      this.ui.clear.style.visibility = msg.data.completedCount > 0 ? 'visible' : 'hidden';
      this.el.style.display = msg.data.totalCount > 0 ? 'block' : 'none';
      if (msg.data.filter) {
        this.updateFilterIndicator(msg.data.filter);
      }
    },
    handleClearClick: function () {
      this.publish('ui.clearCompletedRequested');
    },
    handleRouteChanged: function (msg) {
      this.updateFilterIndicator(msg.data.name);
    },
    updateFilterIndicator: function (filter) {
      var link,
          href = '#/' + (filter == 'all' ? '' : filter),
          filters = this.select('#filters li a');
      for (var i = 0, l = filters.length; i < l; i++) {
        link = filters[i];
        if (link.hash === href) {
          link.className = 'selected';
        } else {
          link.className = '';
        }
      }
    }
  }, View);

})( window );