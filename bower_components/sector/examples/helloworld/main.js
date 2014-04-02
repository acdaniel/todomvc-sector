/* global sector, alert */

sector.Component.define({
  type: 'alerter',
  initialize: function () {
    this.subscribe('ui.alertRequested', function (msg) {
      alert(msg.data);
    });
  }
});

sector.Component.define({
  type: 'hello-world',
  ui: { button: 'button' },
  events: { 'button click': 'handleClick' },
  handleClick: function () {
    this.publish('ui.alertRequested', 'Hello World :)');
  }
}, sector.mixins.View);

sector.init();