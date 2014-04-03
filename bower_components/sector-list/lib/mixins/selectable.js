var sector; try { sector = require('sector'); } catch (e) { sector = window.sector; }
var utils = sector.utils;

module.exports =  function Selectable () {

  this.defaults = utils.defaults({}, this.defaults, {
    selected: false
  });

  Object.defineProperty(this, 'selected', {
    get: function () {
      return this._selected;
    },
    set: function (selected) {
      if (this.el && this._selected !== selected) {
        this._selected = selected;
        var e = utils.createEvent('selected', { selected: selected });
        this.el.dispatchEvent(e);
      }
    }
  });

};