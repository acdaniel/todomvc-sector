var sector; try { sector = require('sector'); } catch (e) { sector = window.sector; }

module.exports =  function Selectable () {

  this.defaults = sector.defaults({}, this.defaults, {
    selected: false
  });

  Object.defineProperty(this, 'selected', {
    get: function () {
      return this._selected;
    },
    set: function (selected) {
      if (this.el && this._selected !== selected) {
        this._selected = selected;
        var e = sector.createEvent('selected', { selected: selected });
        this.el.dispatchEvent(e, { selected: this._selected });
      }
    }
  });

};