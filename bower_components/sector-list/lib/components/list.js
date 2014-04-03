var sector; try { sector = require('sector'); } catch (e) { sector = window.sector; }
var ListMixin = require('../mixins/list');

module.exports = sector.Component.define({
  type: 'list'
}, sector.mixins.View, ListMixin);