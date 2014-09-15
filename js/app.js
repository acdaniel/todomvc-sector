/* global sector */
(function( window ) {
	'use strict';

  var Router = sector.ext.router.components.Router;
	Router.attachTo(document,
    {
      mode: 'hash',
      routes: {
        '/': 'ui.viewAllRequested',
        '/active': 'ui.viewActiveRequested',
        '/completed': 'ui.viewCompletedRequested'
      }
    }
  );

  sector.init();

})( window );