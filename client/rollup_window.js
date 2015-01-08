var $ = require('jquery');

module.exports = {
  setup: function($el) {
    if ( ! $el.hasClass('window') )
      throw new Error('Expected element to have class .window');

    $el.find('.titlebar').click(function() {
      var content = $(this).next('.content').toggle();
      var icon = $(this).find('.roll')
      if (content.is(':hidden')) {
        icon.addClass('down')
        icon.removeClass('up')
      } else {
        icon.addClass('up')
        icon.removeClass('down')
      }
    })
  }
}
