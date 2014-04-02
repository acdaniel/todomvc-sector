/* global sector */
(function( window ) {
	'use strict';

  var Router = sector.ext.router.components.Router;
	Router.attachTo(document,
    {
      mode: 'hash',
      routes: {
        all: '/',
        active: '/active',
        completed: '/completed'
      }
    }
  );

  sector.init();

})( window );